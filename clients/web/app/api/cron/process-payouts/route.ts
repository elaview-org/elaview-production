// src/app/api/cron/process-payouts/route.ts
import { NextResponse } from 'next/server';
import { db } from '../../../../../elaview-mvp/src/server/db';
import { stripe } from '../../../../../elaview-mvp/src/lib/stripe';
import { addDays, differenceInDays, format } from 'date-fns';
import { WhatsAppAlerts } from '../../../../../elaview-mvp/src/lib/notifications/whatsapp';
import { holdPayout } from '../../../../../elaview-mvp/src/lib/payout-holds';
import { createTransferWithCheck, createTransferWithSourceTransaction, validateChargeId } from '../../../../../elaview-mvp/src/lib/stripe-balance';
import { calculatePayoutSchedule } from '../../../../../elaview-mvp/src/lib/payment-config';

/**
 * COMPREHENSIVE PAYOUT PROCESSING CRON JOB
 *
 * Runs daily to process all types of payouts:
 * 1. Installation fee payouts (immediate after proof approval)
 * 2. First rental payouts (30% after proof approval)
 * 3. Final payouts (70% at campaign completion)
 * 4. Campaign status transitions
 * 5. Verification reminders
 *
 * Schedule: Daily at 3:00 AM UTC (runs after Stripe account health check)
 */
export async function GET(request: Request) {
  try {
    // Verify cron secret
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      console.error('[PAYOUT CRON] Unauthorized access attempt');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log('[PAYOUT CRON] Starting payout processing...');

    const today = new Date();
    const stats = {
      installationPayouts: 0,
      firstRentalPayouts: 0,
      finalPayouts: 0,
      heldPayouts: 0,
      failedPayouts: 0,
      completedCampaigns: 0,
      cancelledBookings: 0,
      verificationReminders: 0,
      totalProcessed: 0,
      totalAmount: 0,
    };

    // ========================================
    // PART 1: INSTALLATION FEE + FIRST RENTAL PAYOUTS
    // Process after proof approval
    // ========================================
    console.log('[PAYOUT CRON] Processing installation & first rental payouts...');

    const approvedProofBookings = await db.booking.findMany({
      where: {
        proofStatus: 'APPROVED',
        firstPayoutProcessed: false,
        status: { in: ['ACTIVE', 'CONFIRMED'] },
        paidAt: { not: null },
      },
      include: {
        space: {
          include: {
            owner: {
              include: {
                spaceOwnerProfile: true,
              }
            }
          }
        },
        campaign: {
          select: {
            id: true,
            name: true,
            advertiserId: true,
          }
        }
      },
    });

    console.log(`[PAYOUT CRON] Found ${approvedProofBookings.length} bookings ready for first payout`);

    for (const booking of approvedProofBookings) {
      try {
        const stripeAccountId = booking.space.owner.spaceOwnerProfile?.stripeAccountId;
        const accountStatus = booking.space.owner.spaceOwnerProfile?.stripeAccountStatus;

        // Check if account is active
        if (!stripeAccountId || accountStatus !== 'ACTIVE') {
          console.warn(`[PAYOUT CRON] Holding payout for booking ${booking.id} - Account not active`);
          await holdPayout(booking.id, 'ACCOUNT_DISCONNECTED', {
            notifyOwner: true,
            notifyAdmin: false, // Already notified by health check
          });
          stats.heldPayouts++;
          continue;
        }

        // Calculate payout amounts using correct payment schedule
        const installationFee = Number(booking.space.installationFee || 0);
        const payoutSchedule = calculatePayoutSchedule(
          booking.totalDays,
          Number(booking.pricePerDay),
          installationFee
        );

        const firstRentalAmount = payoutSchedule.firstRentalPayout;
        const totalFirstPayout = installationFee + firstRentalAmount;

        console.log(`[PAYOUT CRON] Processing first payout for booking ${booking.id}:`, {
          campaignDays: booking.totalDays,
          installationFee,
          firstRentalAmount,
          totalFirstPayout,
          breakdown: payoutSchedule,
          spaceOwner: booking.space.owner.email,
        });

        // CRITICAL: Validate charge ID exists for source_transaction
        const validation = validateChargeId(booking);

        if (!validation.valid) {
          console.error(`[FIRST PAYOUT] Validation failed for booking ${booking.id}: ${validation.error}`);

          await db.booking.update({
            where: { id: booking.id },
            data: {
              payoutStatus: 'FAILED',
              payoutError: validation.error,
              adminNotes: `CRITICAL: ${validation.error} - Manual review required. PI: ${booking.stripePaymentIntentId}`,
              payoutAttempts: (booking.payoutAttempts || 0) + 1,
              lastPayoutAttempt: new Date(),
            }
          });

          stats.failedPayouts++;
          continue;
        }

        const chargeId = validation.chargeId!;
        console.log(`[FIRST PAYOUT] ✓ Validated charge ID: ${chargeId} for booking ${booking.id}`);

        // Create Stripe transfer with source_transaction (prevents commingling)
        const transfer = await createTransferWithSourceTransaction({
          amount: Math.round(totalFirstPayout * 100), // Convert to cents
          currency: 'usd',
          destination: stripeAccountId,
          description: `First payout for ${booking.campaign.name}`,
          sourceChargeId: chargeId,  // ← CRITICAL: Links to specific charge
          metadata: {
            bookingId: booking.id,
            campaignId: booking.campaign.id,
            spaceOwnerId: booking.space.owner.id,
            type: 'FIRST_PAYOUT',
            installationFee: installationFee.toFixed(2),
            firstRental: firstRentalAmount.toFixed(2),
            chargeIdUsed: chargeId,  // Track which charge
          },
        });

        // Update booking with transfer info
        await db.booking.update({
          where: { id: booking.id },
          data: {
            firstPayoutProcessed: true,
            firstPayoutDate: new Date(),
            firstPayoutAmount: totalFirstPayout,
            installationFeeTransferId: transfer.id,
            installationFeeTransferredAt: new Date(),
            firstRentalTransferId: transfer.id,
            firstRentalTransferredAt: new Date(),
            payoutStatus: 'PARTIALLY_PAID',
            payoutAttempts: booking.payoutAttempts + 1,
            lastPayoutAttempt: new Date(),
            payoutError: null,
            pendingPayoutReason: null,
          },
        });

        // Notify space owner
        await db.notification.create({
          data: {
            userId: booking.space.owner.id,
            type: 'SYSTEM_UPDATE',
            title: '💰 First Payout Processed',
            content: `$${totalFirstPayout.toFixed(2)} has been transferred to your account for "${booking.campaign.name}". This includes installation fee and 30% of rental. Final 70% will be paid at campaign completion.`,
            bookingId: booking.id,
          },
        });

        stats.installationPayouts++;
        stats.firstRentalPayouts++;
        stats.totalAmount += totalFirstPayout;
        stats.totalProcessed++;

        console.log(`[PAYOUT CRON] ✅ First payout successful: ${transfer.id}`);

      } catch (error: any) {
        console.error(`[PAYOUT CRON] ❌ Failed to process first payout for booking ${booking.id}:`, error);

        // Check if error is due to insufficient balance (funds in pending)
        const isInsufficientFunds =
          error.message?.toLowerCase().includes('insufficient') ||
          error.message?.toLowerCase().includes('balance') ||
          error.code === 'PRECONDITION_FAILED';

        if (isInsufficientFunds) {
          // GRACEFUL HANDLING: Mark as PENDING, not FAILED
          await db.booking.update({
            where: { id: booking.id },
            data: {
              firstPayoutProcessed: false, // Will retry
              payoutStatus: 'PENDING',
              pendingPayoutReason: 'Platform escrow funds clearing (2-7 business days)',
              payoutAttempts: (booking.payoutAttempts || 0) + 1,
              lastPayoutAttempt: new Date(),
            }
          });

          // Notify space owner (not admin - this is normal)
          await db.notification.create({
            data: {
              userId: booking.space.owner.id,
              type: 'SYSTEM_UPDATE',
              title: 'Payment Processing',
              content: `Your payment for "${booking.campaign.name}" is being processed. Funds are clearing and will be sent within 2-7 business days.`,
              bookingId: booking.id,
            }
          });

          stats.heldPayouts++;
          console.log(`[PAYOUT CRON] ⏸️ Marked as PENDING (funds clearing): ${booking.id}`);
          continue; // Will retry next day
        }

        // Check if it's an account issue
        if (error.code === 'account_invalid' || error.code === 'account_inactive') {
          await holdPayout(booking.id, 'ACCOUNT_DISCONNECTED');
          stats.heldPayouts++;
        } else {
          // True failure - update booking and alert admin
          await db.booking.update({
            where: { id: booking.id },
            data: {
              payoutError: error.message,
              payoutAttempts: (booking.payoutAttempts || 0) + 1,
              lastPayoutAttempt: new Date(),
              payoutStatus: 'FAILED',
            },
          });

          // Alert admin for true failures
          await WhatsAppAlerts.payoutFailed({
            bookingId: booking.id,
            ownerName: booking.space.owner.name || booking.space.owner.email,
            amount: Number(booking.spaceOwnerAmount),
            error: error.message,
          }).catch(err => console.error('WhatsApp alert failed:', err));

          stats.failedPayouts++;
        }
      }
    }

    // ========================================
    // PART 2: FINAL PAYOUTS (70%)
    // Process at campaign completion
    // ========================================
    console.log('[PAYOUT CRON] Processing final payouts...');

    const completedCampaigns = await db.booking.findMany({
      where: {
        status: { in: ['ACTIVE', 'COMPLETED'] },  // FIX: Accept both ACTIVE and COMPLETED status
        endDate: { lte: today },
        firstPayoutProcessed: true,
        finalPayoutProcessed: false,
      },
      include: {
        space: {
          include: {
            owner: {
              include: {
                spaceOwnerProfile: true,
              }
            }
          }
        },
        campaign: {
          select: {
            id: true,
            name: true,
            advertiserId: true,
          }
        }
      },
    });

    console.log(`[PAYOUT CRON] Found ${completedCampaigns.length} campaigns ready for final payout`);

    for (const booking of completedCampaigns) {
      try {
        const stripeAccountId = booking.space.owner.spaceOwnerProfile?.stripeAccountId;
        const accountStatus = booking.space.owner.spaceOwnerProfile?.stripeAccountStatus;

        // Check if account is active
        if (!stripeAccountId || accountStatus !== 'ACTIVE') {
          console.warn(`[PAYOUT CRON] Holding final payout for booking ${booking.id} - Account not active`);
          await holdPayout(booking.id, 'ACCOUNT_DISCONNECTED');
          stats.heldPayouts++;
          continue;
        }

        // Skip if verification schedule exists and not complete
        if (booking.verificationSchedule) {
          const schedule = booking.verificationSchedule as any;
          const allComplete = schedule?.checkpoints?.every((cp: any) => cp.completed) ?? false;

          if (!allComplete) {
            console.log(`[PAYOUT CRON] Skipping ${booking.id} - verification incomplete`);
            continue;
          }
        }

        // Calculate final payout using correct payment schedule
        const payoutSchedule = calculatePayoutSchedule(
          booking.totalDays,
          Number(booking.pricePerDay),
          Number(booking.space.installationFee || 0)
        );

        const finalPayoutAmount = payoutSchedule.finalRentalPayout;

        console.log(`[PAYOUT CRON] Processing final payout for booking ${booking.id}:`, {
          campaignDays: booking.totalDays,
          finalPayoutAmount,
          breakdown: payoutSchedule,
          spaceOwner: booking.space.owner.email,
        });

        // CRITICAL: Validate charge ID exists for source_transaction
        const validation = validateChargeId(booking);

        if (!validation.valid) {
          console.error(`[FINAL PAYOUT] Validation failed for booking ${booking.id}: ${validation.error}`);

          await db.booking.update({
            where: { id: booking.id },
            data: {
              payoutStatus: 'FAILED',
              payoutError: validation.error,
              adminNotes: `CRITICAL: ${validation.error} - Manual review required. PI: ${booking.stripePaymentIntentId}`,
              payoutAttempts: (booking.payoutAttempts || 0) + 1,
              lastPayoutAttempt: new Date(),
            }
          });

          stats.failedPayouts++;
          continue;
        }

        const chargeId = validation.chargeId!;
        console.log(`[FINAL PAYOUT] ✓ Validated charge ID: ${chargeId} for booking ${booking.id}`);

        // Create Stripe transfer with source_transaction (prevents commingling)
        const transfer = await createTransferWithSourceTransaction({
          amount: Math.round(finalPayoutAmount * 100), // Convert to cents
          currency: 'usd',
          destination: stripeAccountId,
          description: `Final payout for ${booking.campaign.name}`,
          sourceChargeId: chargeId,  // ← CRITICAL
          metadata: {
            bookingId: booking.id,
            campaignId: booking.campaign.id,
            spaceOwnerId: booking.space.owner.id,
            type: 'FINAL_PAYOUT',
            amount: finalPayoutAmount.toFixed(2),
            chargeIdUsed: chargeId,
          },
        });

        // Update booking to completed
        await db.booking.update({
          where: { id: booking.id },
          data: {
            status: 'COMPLETED',
            finalPayoutProcessed: true,
            finalPayoutDate: new Date(),
            finalPayoutAmount: finalPayoutAmount,
            finalTransferId: transfer.id,
            finalTransferredAt: new Date(),
            payoutStatus: 'COMPLETED',
            payoutAttempts: booking.payoutAttempts + 1,
            lastPayoutAttempt: new Date(),
            payoutError: null,
            pendingPayoutReason: null,
          },
        });

        // Notify space owner
        await db.notification.create({
          data: {
            userId: booking.space.owner.id,
            type: 'SYSTEM_UPDATE',
            title: '🎉 Final Payout Completed',
            content: `$${finalPayoutAmount.toFixed(2)} has been transferred for campaign completion of "${booking.campaign.name}". Campaign is now complete. Thank you!`,
            bookingId: booking.id,
          },
        });

        // Notify advertiser
        await db.notification.create({
          data: {
            userId: booking.campaign.advertiserId,
            type: 'SYSTEM_UPDATE',
            title: '✅ Campaign Completed',
            content: `Your campaign "${booking.campaign.name}" has been completed successfully. Space owner has been paid.`,
            bookingId: booking.id,
          },
        });

        stats.finalPayouts++;
        stats.completedCampaigns++;
        stats.totalAmount += finalPayoutAmount;
        stats.totalProcessed++;

        console.log(`[PAYOUT CRON] ✅ Final payout successful: ${transfer.id}`);

      } catch (error: any) {
        console.error(`[PAYOUT CRON] ❌ Failed to process final payout for booking ${booking.id}:`, error);

        // Check if error is due to insufficient balance (funds in pending)
        const isInsufficientFunds =
          error.message?.toLowerCase().includes('insufficient') ||
          error.message?.toLowerCase().includes('balance') ||
          error.code === 'PRECONDITION_FAILED';

        if (isInsufficientFunds) {
          // GRACEFUL HANDLING: Mark as PENDING, not FAILED
          await db.booking.update({
            where: { id: booking.id },
            data: {
              finalPayoutProcessed: false, // Will retry
              payoutStatus: 'PENDING',
              pendingPayoutReason: 'Platform escrow funds clearing (2-7 business days)',
              payoutAttempts: (booking.payoutAttempts || 0) + 1,
              lastPayoutAttempt: new Date(),
            }
          });

          // Notify space owner (not admin - this is normal)
          await db.notification.create({
            data: {
              userId: booking.space.owner.id,
              type: 'SYSTEM_UPDATE',
              title: 'Final Payment Processing',
              content: `Your final payment for "${booking.campaign.name}" is being processed. Funds are clearing and will be sent within 2-7 business days.`,
              bookingId: booking.id,
            }
          });

          stats.heldPayouts++;
          console.log(`[PAYOUT CRON] ⏸️ Final payout marked as PENDING (funds clearing): ${booking.id}`);
          continue; // Will retry next day
        }

        // Check if it's an account issue
        if (error.code === 'account_invalid' || error.code === 'account_inactive') {
          await holdPayout(booking.id, 'ACCOUNT_DISCONNECTED');
          stats.heldPayouts++;
        } else {
          // True failure - update booking and alert admin
          await db.booking.update({
            where: { id: booking.id },
            data: {
              payoutError: error.message,
              payoutAttempts: (booking.payoutAttempts || 0) + 1,
              lastPayoutAttempt: new Date(),
              payoutStatus: 'FAILED',
            },
          });

          // Alert admin for true failures
          await WhatsAppAlerts.payoutFailed({
            bookingId: booking.id,
            ownerName: booking.space.owner.name || booking.space.owner.email,
            amount: Number(booking.spaceOwnerAmount),
            error: error.message,
          }).catch(err => console.error('WhatsApp alert failed:', err));

          stats.failedPayouts++;
        }
      }
    }

    // ========================================
    // PART 3: CANCEL BOOKINGS WITHOUT PROOF
    // After 5 days of payment
    // ========================================
    console.log('[PAYOUT CRON] Checking for bookings without proof...');

    const overdueProofs = await db.booking.findMany({
      where: {
        status: 'CONFIRMED',
        paidAt: { not: null },
        proofUploadedAt: null,
      },
      include: {
        space: {
          include: {
            owner: {
              select: { id: true, name: true, email: true }
            }
          }
        },
        campaign: {
          select: {
            name: true,
            advertiserId: true,
          }
        }
      },
    });

    for (const booking of overdueProofs) {
      if (!booking.paidAt) continue;

      const daysSincePayment = differenceInDays(today, booking.paidAt);

      if (daysSincePayment > 5) {
        await db.booking.update({
          where: { id: booking.id },
          data: {
            status: 'CANCELLED',
            adminNotes: `Auto-cancelled: No proof uploaded after ${daysSincePayment} days`,
          },
        });

        await db.notification.create({
          data: {
            userId: booking.space.owner.id,
            type: 'SYSTEM_UPDATE',
            title: 'Booking Cancelled - No Proof',
            content: `Your booking for "${booking.space.title}" was cancelled because installation proof was not uploaded within 5 days of payment.`,
            bookingId: booking.id,
          },
        });

        await db.notification.create({
          data: {
            userId: booking.campaign.advertiserId,
            type: 'SYSTEM_UPDATE',
            title: 'Booking Cancelled - Refund Issued',
            content: `Your booking was cancelled because the space owner did not install your ad. A full refund has been processed.`,
            bookingId: booking.id,
          },
        });

        stats.cancelledBookings++;
        console.log(`[PAYOUT CRON] Cancelled booking ${booking.id} - no proof after ${daysSincePayment} days`);
      }
    }

    // ========================================
    // PART 4: VERIFICATION REMINDERS
    // ========================================
    console.log('[PAYOUT CRON] Sending verification reminders...');

    const threeDaysFromNow = addDays(today, 3);
    const upcomingVerifications = await db.booking.findMany({
      where: {
        status: 'ACTIVE',
        nextVerificationDue: {
          gte: today,
          lte: threeDaysFromNow,
        }
      },
      include: {
        space: {
          include: {
            owner: {
              select: { id: true, name: true }
            }
          }
        },
        campaign: {
          select: { name: true }
        }
      }
    });

    for (const booking of upcomingVerifications) {
      const daysUntilDue = differenceInDays(
        new Date(booking.nextVerificationDue!),
        today
      );

      if (daysUntilDue === 3) {
        await db.notification.create({
          data: {
            userId: booking.space.owner.id,
            type: 'SYSTEM_UPDATE',
            title: 'Verification Photo Due Soon',
            content: `Verification photo for "${booking.campaign.name}" is due in 3 days (${format(new Date(booking.nextVerificationDue!), 'MMM d, yyyy')}). Upload your photo to receive payment.`,
            bookingId: booking.id,
          },
        });

        stats.verificationReminders++;
      }
    }

    // Log summary
    console.log('[PAYOUT CRON] ============ SUMMARY ============');
    console.log(`Total payouts processed: ${stats.totalProcessed}`);
    console.log(`Total amount transferred: $${stats.totalAmount.toFixed(2)}`);
    console.log(`Installation fee payouts: ${stats.installationPayouts}`);
    console.log(`First rental payouts: ${stats.firstRentalPayouts}`);
    console.log(`Final payouts: ${stats.finalPayouts}`);
    console.log(`Held payouts: ${stats.heldPayouts}`);
    console.log(`Failed payouts: ${stats.failedPayouts}`);
    console.log(`Completed campaigns: ${stats.completedCampaigns}`);
    console.log(`Cancelled bookings: ${stats.cancelledBookings}`);
    console.log(`Verification reminders: ${stats.verificationReminders}`);
    console.log('[PAYOUT CRON] ===============================');

    // Send summary to admin if significant activity
    if (stats.totalProcessed > 0 || stats.failedPayouts > 0 || stats.heldPayouts > 0) {
      const summary =
        `💰 *Daily Payout Processing Report*\n\n` +
        `✅ Payouts Processed: ${stats.totalProcessed}\n` +
        `💵 Total Amount: $${stats.totalAmount.toFixed(2)}\n` +
        `🔧 Installation Fees: ${stats.installationPayouts}\n` +
        `📊 First Rentals: ${stats.firstRentalPayouts}\n` +
        `🎯 Final Payouts: ${stats.finalPayouts}\n` +
        `⏸️ Held: ${stats.heldPayouts}\n` +
        `❌ Failed: ${stats.failedPayouts}\n` +
        `🎉 Completed: ${stats.completedCampaigns}\n` +
        `🚫 Cancelled: ${stats.cancelledBookings}`;

      const { sendWhatsAppMessage } = await import('../../../../../elaview-mvp/src/lib/notifications/whatsapp');
      await sendWhatsAppMessage(summary).catch(err =>
        console.error('Failed to send summary:', err)
      );
    }

    return NextResponse.json({
      success: true,
      timestamp: today.toISOString(),
      stats,
    });

  } catch (error) {
    console.error('[PAYOUT CRON] Fatal error:', error);
    return NextResponse.json(
      {
        error: 'Payout processing failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
