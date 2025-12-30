import { NextResponse } from 'next/server';
import { db } from '../../../../../elaview-mvp/src/server/db';
import { createTransferWithCheck, createTransferWithSourceTransaction, validateChargeId } from '../../../../../elaview-mvp/src/lib/stripe-balance';
import { calculatePayoutSchedule } from '../../../../../elaview-mvp/src/lib/payment-config';

/**
 * PENDING PAYOUTS RETRY CRON JOB
 *
 * Automatically retries payouts that were marked PENDING due to insufficient
 * available balance (funds in Stripe pending, waiting to clear)
 *
 * Runs every 6 hours to catch when pending funds become available
 * Max 10 retry attempts per booking (covers ~2.5 days)
 *
 * Schedule: 0 (star)/6 (star) (star) (star) (every 6 hours)
 */
export async function GET(request: Request) {
  // Verify cron secret
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  console.log('🔄 [RETRY PAYOUTS] Starting pending payout retry job...');
  const startTime = Date.now();

  try {
    // Find all bookings with pending payouts
    // NOTE: We retry ALL PENDING bookings regardless of reason text for maximum reliability
    const pendingPayouts = await db.booking.findMany({
      where: {
        payoutStatus: 'PENDING',
        payoutAttempts: { lt: 10 }, // Max 10 attempts (2.5 days)
      },
      include: {
        space: {
          include: {
            owner: {
              include: { spaceOwnerProfile: true }
            }
          }
        },
        campaign: true,
      },
    });

    console.log(`🔍 [RETRY PAYOUTS] Found ${pendingPayouts.length} pending payouts to retry`);

    const stats = {
      total: pendingPayouts.length,
      retried: 0,
      succeeded: 0,
      stillPending: 0,
      failed: 0,
      skipped: 0,
    };

    // Process each pending payout
    for (const booking of pendingPayouts) {
      const stripeAccountId = booking.space.owner.spaceOwnerProfile?.stripeAccountId;

      if (!stripeAccountId) {
        console.warn(`⚠️ [RETRY PAYOUTS] Booking ${booking.id} - No Stripe account`);
        stats.skipped++;
        continue;
      }

      stats.retried++;
      console.log(`🔄 [RETRY PAYOUTS] Attempting booking ${booking.id} (attempt ${(booking.payoutAttempts || 0) + 1})`);

      // CRITICAL: Validate charge ID exists for source_transaction
      const validation = validateChargeId(booking);

      if (!validation.valid) {
        console.error(`❌ [RETRY PAYOUTS] Validation failed for booking ${booking.id}: ${validation.error}`);
        await db.booking.update({
          where: { id: booking.id },
          data: {
            payoutError: validation.error,
            adminNotes: `Needs manual review - ${validation.error}. PI: ${booking.stripePaymentIntentId}`,
            payoutAttempts: (booking.payoutAttempts || 0) + 1,
            lastPayoutAttempt: new Date(),
          }
        });
        stats.skipped++;
        continue;
      }

      const chargeId = validation.chargeId!;
      console.log(`[RETRY PAYOUTS] ✓ Validated charge ID: ${chargeId} for booking ${booking.id}`);

      try {
        // Determine which payout phase we're in
        const isFirstPayout = !booking.firstPayoutProcessed;
        const isFinalPayout = booking.firstPayoutProcessed && !booking.finalPayoutProcessed;

        if (isFirstPayout) {
          // ========== RETRY FIRST PAYOUT ==========
          const installFee = Number(booking.space.installationFee || 0);
          const payoutSchedule = calculatePayoutSchedule(
            booking.totalDays,
            Number(booking.pricePerDay),
            installFee
          );

          console.log(`💰 [RETRY PAYOUTS] First payout for ${booking.id}:`, {
            installFee,
            firstRental: payoutSchedule.firstRentalPayout,
            total: installFee + payoutSchedule.firstRentalPayout,
          });

          // Transfer installation fee (if applicable)
          let installTransfer;
          if (installFee > 0) {
            installTransfer = await createTransferWithSourceTransaction({
              amount: Math.round(installFee * 100),
              currency: 'usd',
              destination: stripeAccountId,
              description: `Installation fee for ${booking.campaign.name} (Retry ${booking.payoutAttempts || 0})`,
              sourceChargeId: chargeId,  // ← CRITICAL
              metadata: {
                bookingId: booking.id,
                phase: 'installation_fee_retry',
                attempt: (booking.payoutAttempts || 0).toString(),
                chargeIdUsed: chargeId,
              },
            });
          }

          // Transfer first rental payment
          const rentalTransfer = await createTransferWithSourceTransaction({
            amount: Math.round(payoutSchedule.firstRentalPayout * 100),
            currency: 'usd',
            destination: stripeAccountId,
            description: `First rental payout for ${booking.campaign.name} (Retry ${booking.payoutAttempts || 0})`,
            sourceChargeId: chargeId,  // ← CRITICAL
            metadata: {
              bookingId: booking.id,
              phase: 'first_rental_retry',
              attempt: (booking.payoutAttempts || 0).toString(),
              chargeIdUsed: chargeId,
            },
          });

          // ✅ SUCCESS! Update booking
          await db.booking.update({
            where: { id: booking.id },
            data: {
              firstPayoutProcessed: true,
              firstPayoutDate: new Date(),
              firstPayoutAmount: payoutSchedule.firstRentalPayout,
              installationFeeTransferId: installTransfer?.id,
              installationFeeTransferredAt: installTransfer ? new Date() : null,
              firstRentalTransferId: rentalTransfer.id,
              firstRentalTransferredAt: new Date(),
              payoutStatus: 'PARTIALLY_PAID',
              pendingPayoutReason: null,
              payoutError: null,
            }
          });

          // Notify space owner of success
          await db.notification.create({
            data: {
              userId: booking.space.owner.id,
              type: 'PAYOUT_PROCESSED',
              title: '💰 Payment Sent',
              content: `$${(installFee + payoutSchedule.firstRentalPayout).toFixed(2)} has been transferred to your account for "${booking.campaign.name}". Funds will arrive in 2-7 business days.`,
              bookingId: booking.id,
            }
          });

          stats.succeeded++;
          console.log(`✅ [RETRY PAYOUTS] First payout succeeded: ${booking.id}`);

        } else if (isFinalPayout) {
          // ========== RETRY FINAL PAYOUT ==========
          const payoutSchedule = calculatePayoutSchedule(
            booking.totalDays,
            Number(booking.pricePerDay),
            Number(booking.space.installationFee || 0)
          );

          console.log(`💰 [RETRY PAYOUTS] Final payout for ${booking.id}:`, {
            finalAmount: payoutSchedule.finalRentalPayout,
          });

          // Transfer final payment with source_transaction
          const finalTransfer = await createTransferWithSourceTransaction({
            amount: Math.round(payoutSchedule.finalRentalPayout * 100),
            currency: 'usd',
            destination: stripeAccountId,
            description: `Final payout for ${booking.campaign.name} (Retry ${booking.payoutAttempts || 0})`,
            sourceChargeId: chargeId,  // ← CRITICAL
            metadata: {
              bookingId: booking.id,
              phase: 'final_payout_retry',
              attempt: (booking.payoutAttempts || 0).toString(),
              chargeIdUsed: chargeId,
            },
          });

          // ✅ SUCCESS! Update booking
          await db.booking.update({
            where: { id: booking.id },
            data: {
              finalPayoutProcessed: true,
              finalPayoutDate: new Date(),
              finalPayoutAmount: payoutSchedule.finalRentalPayout,
              finalTransferId: finalTransfer.id,
              finalTransferredAt: new Date(),
              payoutStatus: 'COMPLETED',
              status: 'COMPLETED',
              pendingPayoutReason: null,
              payoutError: null,
            }
          });

          // Notify space owner
          await db.notification.create({
            data: {
              userId: booking.space.owner.id,
              type: 'PAYOUT_PROCESSED',
              title: '🎉 Final Payment Sent',
              content: `$${payoutSchedule.finalRentalPayout.toFixed(2)} has been transferred for campaign completion of "${booking.campaign.name}".`,
              bookingId: booking.id,
            }
          });

          stats.succeeded++;
          console.log(`✅ [RETRY PAYOUTS] Final payout succeeded: ${booking.id}`);

        } else {
          console.warn(`⚠️ [RETRY PAYOUTS] Booking ${booking.id} in unknown state`);
          stats.skipped++;
        }

      } catch (error: any) {
        // Check if still insufficient balance
        const stillPending =
          error.message?.toLowerCase().includes('insufficient') ||
          error.message?.toLowerCase().includes('balance') ||
          error.code === 'PRECONDITION_FAILED';

        if (stillPending) {
          // Still waiting for funds - update attempt count, will retry next cycle
          await db.booking.update({
            where: { id: booking.id },
            data: {
              payoutAttempts: (booking.payoutAttempts || 0) + 1,
              lastPayoutAttempt: new Date(),
            }
          });

          stats.stillPending++;
          console.log(`⏸️ [RETRY PAYOUTS] Still pending (attempt ${(booking.payoutAttempts || 0) + 1}): ${booking.id}`);

        } else {
          // True failure - mark as failed
          await db.booking.update({
            where: { id: booking.id },
            data: {
              payoutStatus: 'FAILED',
              payoutError: error.message,
              payoutAttempts: (booking.payoutAttempts || 0) + 1,
              lastPayoutAttempt: new Date(),
            }
          });

          // Alert admin
          await db.notification.create({
            data: {
              userId: booking.campaign.advertiserId,
              type: 'SYSTEM_UPDATE',
              title: 'Payout Retry Failed',
              content: `Payout retry failed for booking ${booking.id} after ${(booking.payoutAttempts || 0) + 1} attempts: ${error.message}`,
              bookingId: booking.id,
            }
          });

          stats.failed++;
          console.error(`❌ [RETRY PAYOUTS] Failed: ${booking.id}`, error.message);
        }
      }
    }

    const duration = Date.now() - startTime;
    console.log('🏁 [RETRY PAYOUTS] ============ SUMMARY ============');
    console.log(`📊 Total pending payouts found: ${stats.total}`);
    console.log(`🔄 Attempted: ${stats.retried}`);
    console.log(`✅ Succeeded: ${stats.succeeded}`);
    console.log(`⏸️ Still pending: ${stats.stillPending}`);
    console.log(`❌ Failed: ${stats.failed}`);
    console.log(`⏭️ Skipped: ${stats.skipped}`);
    console.log(`⏱️ Duration: ${duration}ms`);

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      duration,
      stats,
    });

  } catch (error: any) {
    console.error('💥 [RETRY PAYOUTS] Critical error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message,
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
