// src/app/api/webhooks/stripe/route.ts
import { NextResponse } from 'next/server';
import type Stripe from 'stripe';
import { stripe } from '../../../../../elaview-mvp/src/lib/stripe';
import { db } from '../../../../../elaview-mvp/src/server/db';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  console.log('🔔 WEBHOOK RECEIVED');

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

  if (!webhookSecret) {
    console.error('❌ No webhook secret');
    return NextResponse.json({ error: 'Webhook secret not configured' }, { status: 500 });
  }

  try {
    // Next.js 15 fix: Use arrayBuffer() and convert to Buffer
    const buf = await req.arrayBuffer();
    const rawBody = Buffer.from(buf);
    console.log('📦 Body length:', rawBody.length);

    const signature = req.headers.get('stripe-signature');
    console.log('✍️ Signature present:', !!signature);

    if (!signature) {
      return NextResponse.json({ error: 'No signature' }, { status: 400 });
    }

    // Verify webhook signature
    const event = stripe.webhooks.constructEvent(
      rawBody,
      signature,
      webhookSecret
    );

    console.log('✅ Webhook verified:', event.type);
    console.log('📨 Event ID:', event.id);

    // Check if event already processed (idempotency)
    const existingEvent = await db.stripeWebhookEvent.findUnique({
      where: { stripeEventId: event.id }
    });

    if (existingEvent?.processed) {
      console.log(`✓ Event ${event.id} already processed, skipping`);
      return NextResponse.json({ received: true });
    }

    // Record event (prevents duplicate processing during retries)
    await db.stripeWebhookEvent.upsert({
      where: { stripeEventId: event.id },
      create: {
        stripeEventId: event.id,
        processed: false,
      },
      update: {},
    });

    // Handle events
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutSessionCompleted(event.data.object);
        break;

      case 'checkout.session.expired':
        await handleCheckoutSessionExpired(event.data.object);
        break;

      case 'payment_intent.succeeded':
        await handlePaymentIntentSucceeded(event.data.object);
        break;

      case 'payment_intent.payment_failed':
        await handlePaymentIntentFailed(event.data.object);
        break;

      default:
        console.log(`ℹ️ Unhandled event type: ${event.type}`);
    }

    // Mark event as processed
    await db.stripeWebhookEvent.update({
      where: { stripeEventId: event.id },
      data: {
        processed: true,
        processedAt: new Date(),
      },
    });

    console.log('✅ Webhook processed successfully');
    return NextResponse.json({ received: true });

  } catch (err: any) {
    console.error('❌ Webhook error:', err.message);
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}

// ============================================
// HANDLER: Checkout Session Completed
// ============================================
async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
  console.log('💳 Checkout session completed:', session.id);

  const bookingIds = session.metadata?.bookingIds?.split(',') || [];
  const userId = session.metadata?.userId;
  const campaignId = session.metadata?.campaignId;
  const paymentType = session.metadata?.paymentType as 'DEPOSIT' | 'IMMEDIATE' | undefined;

  console.log('📋 Metadata:', { bookingIds, userId, campaignId, paymentType });

  if (bookingIds.length === 0) {
    console.error('❌ No booking IDs found in session metadata');
    return;
  }

  try {
    await db.$transaction(async (tx) => {
      // Check if already processed
      const bookings = await tx.booking.findMany({
        where: { id: { in: bookingIds } },
        select: { id: true, status: true },
      });

      const alreadyProcessed = bookings.every(b => 
        ['CONFIRMED', 'PENDING_BALANCE', 'ACTIVE', 'COMPLETED'].includes(b.status)
      );

      if (alreadyProcessed) {
        console.log(`✓ All bookings already processed. Skipping duplicate webhook.`);
        return;
      }

      const fullBookings = await tx.booking.findMany({
        where: { id: { in: bookingIds } },
        include: {
          space: {
            include: {
              owner: {
                select: { id: true, name: true, email: true }
              }
            }
          },
          campaign: {
            include: {
              advertiser: {
                select: { id: true, name: true, email: true }
              }
            }
          }
        }
      });

      console.log(`📦 Found ${fullBookings.length} bookings`);

      if (fullBookings.length === 0) {
        console.error('❌ No bookings found in database');
        return;
      }

      const isDepositPayment = paymentType === 'DEPOSIT' || 
                               fullBookings.some(b => b.paymentType === 'DEPOSIT');

      console.log('💰 Payment type:', isDepositPayment ? 'DEPOSIT' : 'IMMEDIATE');

      if (isDepositPayment) {
        // DEPOSIT PAYMENT: Update to PENDING_BALANCE
        // Extract charge ID from payment intent
        // ⚠️ CRITICAL: Charge ID is REQUIRED for payouts (prevents fund commingling)
        let depositChargeId: string | undefined;
        if (session.payment_intent) {
          try {
            const paymentIntentId = session.payment_intent as string;
            const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
            depositChargeId = typeof paymentIntent.latest_charge === 'string'
              ? paymentIntent.latest_charge
              : paymentIntent.latest_charge?.id;

            if (!depositChargeId) {
              // CRITICAL: No charge ID means payout will fail later
              console.error(`[WEBHOOK] ❌ CRITICAL: No charge ID found in deposit PaymentIntent ${paymentIntentId}`);
              console.error(`[WEBHOOK] PaymentIntent status: ${paymentIntent.status}`);
              console.error(`[WEBHOOK] This will cause payout failures!`);
              // TODO: Add admin alerting system here

              // Don't mark as PENDING_BALANCE - trigger webhook retry by throwing
              throw new Error(`CRITICAL: Failed to capture deposit charge ID for PaymentIntent ${paymentIntentId}. This will prevent payouts.`);
            }

            console.log(`[WEBHOOK] ✅ Deposit charge ID captured: ${depositChargeId} for PI: ${paymentIntentId}`);
          } catch (error: any) {
            // CRITICAL ERROR: Charge ID capture failed
            console.error(`[WEBHOOK] ❌ CRITICAL: Failed to retrieve deposit charge ID for PI ${session.payment_intent}`);
            console.error(`[WEBHOOK] Error: ${error.message}`);
            console.error('[WEBHOOK] ⚠️  WARNING: Payouts will FAIL for these bookings without charge ID!');
            // TODO: Add admin alerting system

            // Re-throw to trigger Stripe webhook retry
            throw error;
          }
        } else {
          console.error('[WEBHOOK] ❌ CRITICAL: No payment_intent in checkout session');
          throw new Error('No payment_intent in checkout session');
        }

        // Only update booking status if we successfully captured charge ID
        await tx.booking.updateMany({
          where: { id: { in: bookingIds } },
          data: {
            depositPaidAt: new Date(),
            depositChargeId: session.payment_intent as string,
            depositStripeChargeId: depositChargeId,  // ✅ REQUIRED for payouts
            status: 'PENDING_BALANCE',
          }
        });

        console.log(`✅ Updated ${bookingIds.length} bookings to PENDING_BALANCE (deposit paid)`);
        console.log(`✅ Deposit charge ID ${depositChargeId} stored - payouts will work`);

        // Notify advertiser
        const firstBooking = fullBookings[0];
        if (firstBooking?.campaign?.advertiser?.id) {
          await tx.notification.create({
            data: {
              userId: firstBooking.campaign.advertiser.id,
              type: 'PAYMENT_RECEIVED',
              title: 'Deposit Payment Confirmed',
              content: `Your deposit for ${fullBookings.length} space${fullBookings.length > 1 ? 's' : ''} has been processed. Balance will be charged 7 days before campaign start.`,
              campaignId: campaignId || undefined,
            }
          });
        } else {
          console.warn('⚠️ Cannot create deposit notification: missing advertiser data');
        }

        // Notify space owners (grouped by owner)
        const ownerBookings = new Map<string, typeof fullBookings>();
        fullBookings.forEach(booking => {
          const ownerId = booking.space.owner.id;
          if (!ownerBookings.has(ownerId)) {
            ownerBookings.set(ownerId, []);
          }
          ownerBookings.get(ownerId)!.push(booking);
        });

        for (const [ownerId, ownerBookingsList] of ownerBookings) {
          if (ownerBookingsList.length === 0) continue;
          
          const firstBooking = ownerBookingsList[0];
          if (!firstBooking) continue;
          
          const spaceNames = ownerBookingsList.map(b => b.space.title);
          const advertiserName = firstBooking.campaign.advertiser.name || 
                                 firstBooking.campaign.advertiser.email;
          
          await tx.notification.create({
            data: {
              userId: ownerId,
              type: 'PAYMENT_RECEIVED',
              title: 'Booking Deposit Received',
              content: `${advertiserName} paid deposit for ${spaceNames.length} space${spaceNames.length > 1 ? 's' : ''}: ${spaceNames.join(', ')}. Full payment will be processed before campaign start.`,
              campaignId: campaignId || undefined,
            }
          });
        }

      } else {
        // FULL PAYMENT: Update to CONFIRMED
        // Extract charge ID from payment intent
        // ⚠️ CRITICAL: Charge ID is REQUIRED for payouts (prevents fund commingling)
        // Without charge ID, payouts will fail with "Charge ID not captured from PaymentIntent"
        let chargeId: string | undefined;
        if (session.payment_intent) {
          try {
            const paymentIntentId = session.payment_intent as string;
            const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
            chargeId = typeof paymentIntent.latest_charge === 'string'
              ? paymentIntent.latest_charge
              : paymentIntent.latest_charge?.id;

            if (!chargeId) {
              // CRITICAL: No charge ID means payout will fail later
              console.error(`[WEBHOOK] ❌ CRITICAL: No charge ID found in PaymentIntent ${paymentIntentId}`);
              console.error(`[WEBHOOK] PaymentIntent status: ${paymentIntent.status}`);
              console.error(`[WEBHOOK] This will cause payout failures! Marking bookings as payment processing...`);
              // TODO: Add admin alerting system here (WhatsApp/email)

              // Don't mark as CONFIRMED - trigger webhook retry by throwing
              throw new Error(`CRITICAL: Failed to capture charge ID for PaymentIntent ${paymentIntentId}. PaymentIntent status: ${paymentIntent.status}. This will prevent payouts.`);
            }

            console.log(`[WEBHOOK] ✅ Charge ID captured: ${chargeId} for PI: ${paymentIntentId}`);
          } catch (error: any) {
            // CRITICAL ERROR: Charge ID capture failed
            console.error(`[WEBHOOK] ❌ CRITICAL: Failed to retrieve charge ID for PI ${session.payment_intent}`);
            console.error(`[WEBHOOK] Error: ${error.message}`);
            console.error('[WEBHOOK] ⚠️  WARNING: Payouts will FAIL for these bookings without charge ID!');
            // TODO: Add admin alerting system (WhatsApp/Slack/Email)

            // Re-throw to trigger Stripe webhook retry
            throw error;
          }
        } else {
          // No payment intent at all - this should never happen
          console.error('[WEBHOOK] ❌ CRITICAL: No payment_intent in checkout session');
          throw new Error('No payment_intent in checkout session');
        }

        // Only update booking status if we successfully captured charge ID
        await tx.booking.updateMany({
          where: { id: { in: bookingIds } },
          data: {
            status: 'CONFIRMED',
            paidAt: new Date(),
            stripePaymentIntentId: session.payment_intent as string,
            stripeChargeId: chargeId,  // ✅ REQUIRED for payouts
          }
        });

        console.log(`✅ Updated ${bookingIds.length} bookings to CONFIRMED (full payment)`);
        console.log(`✅ Charge ID ${chargeId} stored - payouts will work`);

        // Notify advertiser
        const firstBooking = fullBookings[0];
        if (firstBooking?.campaign?.advertiser?.id) {
          await tx.notification.create({
            data: {
              userId: firstBooking.campaign.advertiser.id,
              type: 'PAYMENT_RECEIVED',
              title: 'Payment Confirmed',
              content: `Your payment for ${fullBookings.length} space${fullBookings.length > 1 ? 's' : ''} has been processed. Space owners can now submit installation proof.`,
              campaignId: campaignId || undefined,
            }
          });
        } else {
          console.warn('⚠️ Cannot create payment notification: missing advertiser data');
        }

        // Notify space owners (grouped by owner)
        const ownerBookings = new Map<string, typeof fullBookings>();
        fullBookings.forEach(booking => {
          const ownerId = booking.space.owner.id;
          if (!ownerBookings.has(ownerId)) {
            ownerBookings.set(ownerId, []);
          }
          ownerBookings.get(ownerId)!.push(booking);
        });

        for (const [ownerId, ownerBookingsList] of ownerBookings) {
          if (ownerBookingsList.length === 0) continue;
          
          const firstBooking = ownerBookingsList[0];
          if (!firstBooking) continue;
          
          const spaceNames = ownerBookingsList.map(b => b.space.title);
          const advertiserName = firstBooking.campaign.advertiser.name || 
                                 firstBooking.campaign.advertiser.email;
          
          await tx.notification.create({
            data: {
              userId: ownerId,
              type: 'PAYMENT_RECEIVED',
              title: 'Payment Received',
              content: `${advertiserName} has paid for ${spaceNames.length} space${spaceNames.length > 1 ? 's' : ''}: ${spaceNames.join(', ')}. Please submit installation proof in messages when ready.`,
              campaignId: campaignId || undefined,
            }
          });
        }
      }
    });
  } catch (error) {
    console.error('❌ Transaction failed while processing checkout:', error);
    throw error;
  }
}
// ============================================
// HANDLER: Checkout Session Expired
// ============================================
async function handleCheckoutSessionExpired(session: Stripe.Checkout.Session) {
  console.log('⏰ Checkout session expired:', session.id);

  const userId = session.metadata?.userId;
  const bookingIds = session.metadata?.bookingIds?.split(',') || [];

  if (!userId) {
    console.error('No user ID found in expired session metadata');
    return;
  }

  await db.notification.create({
    data: {
      userId: userId,
      type: 'SESSION_EXPIRED',
      title: 'Payment Session Expired',
      content: `Your payment session for ${bookingIds.length} booking${bookingIds.length > 1 ? 's' : ''} has expired. Please try again to complete your payment.`,
    }
  });

  console.log('Notified user about expired session');
}

// ============================================
// HANDLER: Payment Intent Succeeded (Balance Charges)
// ============================================
async function handlePaymentIntentSucceeded(paymentIntent: Stripe.PaymentIntent) {
  console.log('✅ Payment intent succeeded:', paymentIntent.id);
  
  // Only handle balance charges here (checkout is handled by session.completed)
  if (paymentIntent.metadata?.chargeType === 'balance') {
    const bookingId = paymentIntent.metadata.bookingId;
    
    if (!bookingId) {
      console.error('No booking ID in balance charge metadata');
      return;
    }

    try {
      const booking = await db.booking.findUnique({
        where: { id: bookingId },
        include: {
          campaign: {
            include: {
              advertiser: { select: { id: true, name: true, email: true } }
            }
          },
          space: {
            include: {
              owner: { select: { id: true, name: true, email: true } }
            }
          }
        }
      });

      if (!booking) {
        console.error('Booking not found for balance charge');
        return;
      }

      // Check if already processed
      if (booking.balancePaidAt || booking.status === 'CONFIRMED') {
        console.log(`✓ Balance payment for booking ${bookingId} already processed. Skipping duplicate webhook.`);
        return;
      }

      await db.$transaction(async (tx) => {
        // Extract charge ID
        const balanceChargeId = typeof paymentIntent.latest_charge === 'string'
          ? paymentIntent.latest_charge
          : paymentIntent.latest_charge?.id;

        console.log(`[WEBHOOK] Balance charge ID captured: ${balanceChargeId} for booking: ${bookingId}`);

        // Update booking to CONFIRMED (balance paid)
        await tx.booking.update({
          where: { id: bookingId },
          data: {
            status: 'CONFIRMED',
            balancePaidAt: new Date(),
            balanceChargeId: paymentIntent.id,
            balanceStripeChargeId: balanceChargeId,  // NEW: Store charge ID
            paidAt: new Date(), // Mark as fully paid
            stripePaymentIntentId: paymentIntent.id,
          }
        });

        // Notify advertiser
        await tx.notification.create({
          data: {
            userId: booking.campaign.advertiser.id,
            type: 'PAYMENT_RECEIVED',
            title: 'Balance Payment Confirmed',
            content: `Balance payment for "${booking.space.title}" has been processed. Campaign will start on ${booking.startDate.toLocaleDateString()}.`,
            bookingId: booking.id,
          }
        });

        // Notify space owner
        await tx.notification.create({
          data: {
            userId: booking.space.owner.id,
            type: 'PAYMENT_RECEIVED',
            title: 'Full Payment Received',
            content: `${booking.campaign.advertiser.name || booking.campaign.advertiser.email} has completed payment for "${booking.space.title}". Submit installation proof in messages when ready.`,
            bookingId: booking.id,
          }
        });
      });

      console.log(`✅ Balance payment processed for booking ${bookingId}`);
    } catch (error) {
      console.error('Error handling balance payment:', error);
    }
  }
}

// ============================================
// HANDLER: Payment Intent Failed
// ============================================
async function handlePaymentIntentFailed(paymentIntent: Stripe.PaymentIntent) {
  console.log('❌ Payment intent failed:', paymentIntent.id);
  
  // Handle balance charge failures
  if (paymentIntent.metadata?.chargeType === 'balance') {
    const bookingId = paymentIntent.metadata.bookingId;
    
    if (!bookingId) {
      console.error('No booking ID in failed balance charge');
      return;
    }

    const booking = await db.booking.findUnique({
      where: { id: bookingId },
      include: {
        campaign: {
          include: {
            advertiser: { select: { id: true, email: true } }
          }
        },
        space: { select: { title: true } }
      }
    });

    if (!booking) {
      console.error('Booking not found for failed balance charge');
      return;
    }

    await db.notification.create({
      data: {
        userId: booking.campaign.advertiser.id,
        type: 'PAYMENT_FAILED',
        title: 'Balance Payment Failed',
        content: `Balance payment for "${booking.space.title}" failed. Please update your payment method. Campaign may be cancelled if not resolved within 48 hours.`,
        bookingId: booking.id,
      }
    });

    console.log(`Notified advertiser about failed balance charge for booking ${bookingId}`);
    return;
  }

  // Handle checkout payment failures
  try {
    const sessions = await stripe.checkout.sessions.list({
      payment_intent: paymentIntent.id,
      limit: 1,
    });

    if (sessions.data.length === 0) {
      console.error('No checkout session found for failed payment');
      return;
    }

    const session = sessions.data[0];
    if (!session) {
      console.error('Session is undefined');
      return;
    }

    const bookingIds = session.metadata?.bookingIds?.split(',') || [];
    const userId = session.metadata?.userId;

    if (!userId) {
      console.error('No user ID in session metadata');
      return;
    }

    const bookings = await db.booking.findMany({
      where: { id: { in: bookingIds } },
      include: {
        space: { select: { title: true } }
      }
    });

    const spaceNames = bookings.map(b => b.space.title).join(', ');

    await db.notification.create({
      data: {
        userId: userId,
        type: 'PAYMENT_FAILED',
        title: 'Payment Failed',
        content: `Payment for ${bookings.length} space${bookings.length > 1 ? 's' : ''} (${spaceNames}) failed. Please update your payment method and try again.`,
      }
    });

    console.log('Notified user about failed payment');
  } catch (error) {
    console.error('Error handling payment failure:', error);
  }
}