// src/app/api/cron/cancel-missed-installations/route.ts
import { NextResponse } from "next/server";
import { db } from "../../../../../elaview-mvp/src/server/db";
import { startOfDay } from "date-fns";

export const dynamic = 'force-dynamic';

// Type for cron job results
type CronResult = {
  bookingId: string;
  status: string;
  refunded?: boolean;
  error?: string;
};

export async function GET(request: Request) {
  // Verify cron secret
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  try {
    const today = startOfDay(new Date());

    // Find bookings where campaign started but no proof submitted
    const missedBookings = await db.booking.findMany({
      where: {
        startDate: {
          lt: today, // Campaign start date has passed
        },
        status: { in: ['CONFIRMED', 'PENDING_BALANCE'] }, // Still waiting for proof
        proofStatus: null, // No proof submitted
      },
      include: {
        space: { include: { owner: true } },
        campaign: { include: { advertiser: true } },
      },
    });

    console.log(`[Auto-Cancel] Found ${missedBookings.length} bookings with missed installation deadlines`);

    const results: CronResult[] = []; // ✅ Added type annotation

    for (const booking of missedBookings) {
      try {
        // Cancel the booking
        await db.booking.update({
          where: { id: booking.id },
          data: {
            status: 'CANCELLED',
            cancelledAt: new Date(),
            cancellationReason: 'Installation proof not submitted by campaign start date',
          },
        });

        let wasRefunded = false;

        // Process refund to advertiser
        if (booking.stripePaymentIntentId && !booking.refundedAt) {
          try {
            // Import stripe
            const { stripe } = await import('../../../../../elaview-mvp/src/lib/stripe');

            const refundAmount = Number(booking.totalAmount) + Number(booking.platformFee);
            const amountInCents = Math.round(refundAmount * 100);

            // Create refund in Stripe
            const refund = await stripe.refunds.create({
              payment_intent: booking.stripePaymentIntentId,
              amount: amountInCents,
              reason: 'requested_by_customer',
              metadata: {
                bookingId: booking.id,
                reason: 'Installation proof not submitted by deadline',
                autoCanceled: 'true',
              },
            });

            // Update booking with refund info
            await db.booking.update({
              where: { id: booking.id },
              data: {
                refundedAt: new Date(),
                stripeRefundId: refund.id,
              }
            });

            // Notify advertiser about refund
            await db.notification.create({
              data: {
                userId: booking.campaign.advertiserId,
                type: 'REFUND_PROCESSED',
                title: 'Refund Processed',
                content: `Your payment of $${refundAmount.toFixed(2)} for ${booking.space.title} has been refunded. Funds will appear in your account in 5-10 business days.`,
                bookingId: booking.id,
              }
            });

            wasRefunded = true;
            console.log(`[Auto-Cancel] Refund processed: $${refundAmount} via refund ${refund.id}`);

          } catch (refundError: any) {
            console.error(`[Auto-Cancel] Refund failed for booking ${booking.id}:`, refundError);
            
            // Log refund failure for manual review
            await db.booking.update({
              where: { id: booking.id },
              data: { 
                adminNotes: `Auto-refund failed: ${refundError.message}. Requires manual processing.`
              }
            });
          }
        }

        // Create notifications
        await db.notification.createMany({
          data: [
            {
              userId: booking.campaign.advertiserId,
              type: 'BOOKING_CANCELLED',
              title: 'Booking Canceled - Installation Not Completed',
              content: `Your booking for ${booking.space.title} has been canceled because installation proof was not submitted. ${wasRefunded ? 'A full refund has been processed.' : 'A refund will be processed shortly.'}`,
              bookingId: booking.id,
            },
            {
              userId: booking.space.ownerId,
              type: 'BOOKING_CANCELLED',
              title: 'Booking Canceled - Missed Installation Deadline',
              content: `Booking for ${booking.campaign.name} was canceled because installation proof was not submitted by the campaign start date.`,
              bookingId: booking.id,
            },
          ],
        });

        results.push({ bookingId: booking.id, status: 'canceled', refunded: wasRefunded });
        console.log(`[Auto-Cancel] Canceled booking ${booking.id} for missed installation`);
      } catch (error) {
        console.error(`[Auto-Cancel] Error canceling booking ${booking.id}:`, error);
        results.push({ bookingId: booking.id, status: 'error', error: String(error) });
      }
    }

    return NextResponse.json({
      success: true,
      canceled: results.length,
      results,
    });
  } catch (error) {
    console.error('[Auto-Cancel] Fatal error:', error);
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 }
    );
  }
}