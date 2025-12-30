// src/app/api/cron/auto-approve-proof/route.ts
import { NextResponse } from "next/server";
import { db } from "../../../../../elaview-mvp/src/server/db";
import { subHours, addDays } from "date-fns";
import { checkAvailableBalance, createTransferWithCheck } from '../../../../../elaview-mvp/src/lib/stripe-balance';
import {
  PAYMENT_CONFIG,
  calculatePayoutSchedule,
  generateVerificationDates,
} from '../../../../../elaview-mvp/src/lib/payment-config';

export const dynamic = 'force-dynamic';

type CronResult = {
  bookingId: string;
  status: string;
  error?: string;
};

export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  try {
    const APPROVAL_WINDOW_HOURS = 48;
    const cutoffTime = subHours(new Date(), APPROVAL_WINDOW_HOURS);

    const bookingsToAutoApprove = await db.booking.findMany({
  where: {
    proofStatus: 'PENDING',
    proofUploadedAt: {
      lte: cutoffTime,
    },
    status: {
      in: ['CONFIRMED', 'PENDING_BALANCE'],
      not: 'DISPUTED'  // 🆕 ADD THIS LINE - Skip disputed bookings
    },
  },
  include: {
    space: {
      include: {
        owner: {
          include: {
            spaceOwnerProfile: true
          }
        }
      }
    },
    campaign: { include: { advertiser: true } },
  },
});

    console.log(`[Auto-Approve] Found ${bookingsToAutoApprove.length} bookings to auto-approve`);

    const results: CronResult[] = [];

    for (const booking of bookingsToAutoApprove) {
      try {
        // First update status to APPROVED
        await db.booking.update({
          where: { id: booking.id },
          data: {
            proofStatus: 'APPROVED',
            proofApprovedAt: new Date(),
            status: 'ACTIVE',
          }
        });

        const spaceOwner = booking.space.owner;
        const stripeAccountId = spaceOwner.spaceOwnerProfile?.stripeAccountId;

        if (stripeAccountId && !booking.firstPayoutProcessed) {
          try {
            const { stripe } = await import('../../../../../elaview-mvp/src/lib/stripe');

            const installFee = Number(booking.space.installationFee ?? 0);
            const payoutSchedule = calculatePayoutSchedule(
              booking.totalDays,
              Number(booking.pricePerDay),
              installFee
            );

            // ✅ Calculate actual dates for verification schedule
            const actualStartDate = booking.startDate;
            const actualEndDate = booking.endDate;
            const verificationDates = generateVerificationDates(
              actualStartDate,
              booking.totalDays
            );
            const nextVerificationDue = verificationDates.length > 0 ? verificationDates[0] : null;

            const verificationSchedule = verificationDates.length > 0 ? {
              checkpoints: verificationDates.map((date, index) => ({
                dueDate: date,
                dayNumber: (index + 1) * PAYMENT_CONFIG.VERIFICATION_INTERVAL_DAYS,
                payoutAmount: payoutSchedule.checkpointPayouts[index],
                completed: false,
                photoUrl: null,
                uploadedAt: null,
                approvedAt: null,
              }))
            } : null;

            const qualityGuaranteePeriod = addDays(
              actualStartDate,
              PAYMENT_CONFIG.QUALITY_GUARANTEE_DAYS
            );

            // ✅ Check balance before attempting transfers
            const totalPayoutAmount = payoutSchedule.firstRentalPayout + installFee;
            const totalPayoutCents = Math.round(totalPayoutAmount * 100);

            const balanceCheck = await checkAvailableBalance(totalPayoutCents);

            if (!balanceCheck.hasBalance) {
              console.error(`[Auto-Approve] Insufficient balance for booking ${booking.id}: ${balanceCheck.error}`);
              
              await db.booking.update({
                where: { id: booking.id },
                data: {
                  payoutError: balanceCheck.error,
                  adminNotes: `Auto-approve attempted but insufficient balance: ${balanceCheck.error}. Manual transfer required.`,
                }
              });

              results.push({ bookingId: booking.id, status: 'insufficient_balance', error: balanceCheck.error });
              continue; // Skip this booking, will retry next cron run
            }

            // Transfer installation fee
            let installTransfer;
            if (installFee > 0) {
              installTransfer = await createTransferWithCheck({
                amount: Math.round(installFee * 100),
                currency: 'usd',
                destination: stripeAccountId,
                description: `Auto-approved installation fee for ${booking.campaign.name}`,
                metadata: {
                  bookingId: booking.id,
                  phase: 'installation_fee_auto',
                  campaignId: booking.campaignId,
                },
              });
              console.log(`[Auto-Approve] Installation fee: $${installFee} via ${installTransfer.id}`);
            }

            // Transfer first rental payout
            const rentalTransfer = await createTransferWithCheck({
              amount: Math.round(payoutSchedule.firstRentalPayout * 100),
              currency: 'usd',
              destination: stripeAccountId,
              description: `Auto-approved first payout for ${booking.campaign.name}`,
              metadata: {
                bookingId: booking.id,
                phase: 'first_rental_payout_auto',
                campaignId: booking.campaignId,
              },
            });
            console.log(`[Auto-Approve] First rental payout: $${payoutSchedule.firstRentalPayout} via ${rentalTransfer.id}`);

            const totalPayout = payoutSchedule.firstRentalPayout + installFee;

            // Update booking with transfer info
            await db.booking.update({
              where: { id: booking.id },
              data: {
                startDate: actualStartDate,
                endDate: actualEndDate,
                stripeTransferId: rentalTransfer.id,
                installationFeeTransferId: installTransfer?.id,
                installationFeeTransferredAt: installTransfer ? new Date() : null,
                transferredAt: new Date(),
                transferAmount: totalPayout,
                firstPayoutProcessed: true,
                firstPayoutDate: new Date(),
                firstPayoutAmount: payoutSchedule.firstRentalPayout,
                payoutProcessedAt: new Date(),
                verificationSchedule: verificationSchedule as any,
                nextVerificationDue: nextVerificationDue,
                qualityGuaranteePeriod,
                verificationPhotos: { checkpoints: [] },
                payoutError: null, // Clear any previous errors
              }
            });

            // ✅ Update campaign status to ACTIVE
            await db.campaign.update({
              where: { id: booking.campaignId },
              data: { status: 'ACTIVE' }
            });

            await db.notification.create({
              data: {
                userId: spaceOwner.id,
                type: 'PAYOUT_PROCESSED',
                title: 'Payment Received',
                content: `You've received $${totalPayout.toFixed(2)} for ${booking.space.title} ($${installFee} installation + $${payoutSchedule.firstRentalPayout.toFixed(2)} Day 1 rental). Funds will arrive in 2-7 business days.`,
                bookingId: booking.id,
              }
            });

            console.log(`[Auto-Approve] Payout processed: $${totalPayout}`);

          } catch (payoutError: any) {
            console.error(`[Auto-Approve] Payout failed for booking ${booking.id}:`, payoutError);
            
            await db.booking.update({
              where: { id: booking.id },
              data: { 
                payoutError: payoutError.message,
                adminNotes: `Auto-approval payout failed: ${payoutError.message}. Manual review required.`
              }
            });

            if (process.env.ADMIN_USER_ID) {
              await db.notification.create({
                data: {
                  userId: process.env.ADMIN_USER_ID,
                  type: 'SYSTEM_UPDATE',
                  title: 'Auto-Approval Payout Failed',
                  content: `Payout failed for booking ${booking.id} (${booking.space.title}). Error: ${payoutError.message}. Proof was auto-approved but payout needs manual processing.`,
                  bookingId: booking.id,
                }
              });
            }

            results.push({ bookingId: booking.id, status: 'payout_failed', error: payoutError.message });
            continue;
          }
        } else if (!stripeAccountId) {
          console.warn(`[Auto-Approve] Space owner ${spaceOwner.id} has no Stripe Connect account`);
          
          await db.booking.update({
            where: { id: booking.id },
            data: { payoutError: 'Space owner has not set up payout account' }
          });
        }

        // Notify both parties
        await db.notification.createMany({
          data: [
            {
              userId: booking.campaign.advertiserId,
              type: 'PROOF_APPROVED',
              title: 'Installation Proof Auto-Approved',
              content: `Installation proof for ${booking.space.title} was automatically approved after 48 hours.`,
              bookingId: booking.id,
            },
            {
              userId: booking.space.ownerId,
              type: 'PROOF_APPROVED',
              title: 'Installation Proof Approved',
              content: `Your installation proof for ${booking.campaign.name} has been auto-approved. ${stripeAccountId ? 'Payment is being processed.' : 'Please set up your payout account to receive payment.'}`,
              bookingId: booking.id,
            },
          ],
        });

        results.push({ bookingId: booking.id, status: 'success' });
        console.log(`[Auto-Approve] Successfully auto-approved booking ${booking.id}`);
      } catch (error) {
        console.error(`[Auto-Approve] Error processing booking ${booking.id}:`, error);
        results.push({ bookingId: booking.id, status: 'error', error: String(error) });
      }
    }

    return NextResponse.json({
      success: true,
      processed: results.length,
      results,
    });
  } catch (error) {
    console.error('[Auto-Approve] Fatal error:', error);
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 }
    );
  }
}