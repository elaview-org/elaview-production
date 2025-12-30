// src/app/api/cron/daily/route.ts
import { NextResponse } from 'next/server';
import { db } from '../../../../../elaview-mvp/src/server/db';
import { stripe } from '../../../../../elaview-mvp/src/lib/stripe';
import { addDays, addHours, differenceInDays } from 'date-fns';
import { checkAvailableBalance, createTransferWithCheck } from '../../../../../elaview-mvp/src/lib/stripe-balance';
import {
  PAYMENT_CONFIG,
  calculatePayoutSchedule,
  generateVerificationDates,
} from '../../../../../elaview-mvp/src/lib/payment-config';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    // Verify cron secret
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const today = new Date();
    const results: any[] = [];

    // ============================================
    // 1. AUTO-APPROVE: Proof submissions awaiting review for >48 hours
    // ============================================
    const overdueProofs = await db.booking.findMany({
      where: {
        proofStatus: 'PENDING',
        proofUploadedAt: {
          lte: addHours(today, -48)
        }
      },
      include: {
        campaign: {
          select: {
            advertiserId: true,
            name: true,
          }
        },
        space: {
          include: {
            owner: {
              include: {
                spaceOwnerProfile: true
              }
            }
          }
        }
      }
    });

    for (const booking of overdueProofs) {
      console.log(`Auto-approving overdue proof for booking ${booking.id}`);
      
      const ownerProfile = booking.space.owner.spaceOwnerProfile;
      if (!ownerProfile?.stripeAccountId) {
        console.error(`Cannot auto-approve booking ${booking.id}: No Stripe account`);
        continue;
      }

      const installFee = Number(booking.space.installationFee ?? 0);
      const payoutSchedule = calculatePayoutSchedule(
        booking.totalDays,
        Number(booking.pricePerDay),
        installFee
      );

      const actualStartDate = new Date();
      const actualEndDate = addDays(actualStartDate, booking.totalDays);
      const verificationDates = generateVerificationDates(actualStartDate, booking.totalDays);
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

      const qualityGuaranteePeriod = addDays(actualStartDate, PAYMENT_CONFIG.QUALITY_GUARANTEE_DAYS);
      const totalPayoutAmount = payoutSchedule.firstRentalPayout + installFee;
      const totalPayoutCents = Math.round(totalPayoutAmount * 100);

      const balanceCheck = await checkAvailableBalance(totalPayoutCents);

      if (!balanceCheck.hasBalance) {
        console.error(`[Daily Cron - Auto-Approve] Insufficient balance for booking ${booking.id}: ${balanceCheck.error}`);
        
        await db.booking.update({
          where: { id: booking.id },
          data: {
            proofStatus: 'APPROVED',
            proofApprovedAt: new Date(),
            status: 'ACTIVE',
            payoutError: balanceCheck.error,
            adminNotes: `Auto-approved but payout failed: ${balanceCheck.error}. Manual transfer required.`,
          }
        });

        // ✅ Update message with autoApprovedAt
        const proofMessage = await db.message.findFirst({
          where: {
            bookingId: booking.id,
            messageType: 'PROOF_SUBMISSION',
          }
        });

        if (proofMessage) {
          await db.message.update({
            where: { id: proofMessage.id },
            data: {
              proofStatus: 'APPROVED',
              proofApprovedAt: new Date(),
              autoApprovedAt: new Date(),
            }
          });
        }

        results.push({ 
          bookingId: booking.id, 
          action: 'auto_approved_insufficient_balance', 
          error: balanceCheck.error 
        });
        continue;
      }

      try {
        let installTransfer;
        if (installFee > 0) {
          installTransfer = await createTransferWithCheck({
            amount: Math.round(installFee * 100),
            currency: 'usd',
            destination: ownerProfile.stripeAccountId,
            description: `Auto-approved installation fee for ${booking.campaign.name}`,
            metadata: {
              bookingId: booking.id,
              phase: 'installation_fee_auto',
              campaignId: booking.campaignId,
            },
          });
        }

        const rentalTransfer = await createTransferWithCheck({
          amount: Math.round(payoutSchedule.firstRentalPayout * 100),
          currency: 'usd',
          destination: ownerProfile.stripeAccountId,
          description: `Auto-approved first payout for ${booking.campaign.name}`,
          metadata: {
            bookingId: booking.id,
            phase: 'first_rental_payout_auto',
            campaignId: booking.campaignId,
          },
        });

        const totalPayout = payoutSchedule.firstRentalPayout + installFee;

        await db.booking.update({
          where: { id: booking.id },
          data: {
            status: 'ACTIVE',
            startDate: actualStartDate,
            endDate: actualEndDate,
            proofStatus: 'APPROVED',
            proofApprovedAt: new Date(),
            stripeTransferId: rentalTransfer.id,
            installationFeeTransferId: installTransfer?.id,
            installationFeeTransferredAt: installTransfer ? new Date() : null,
            transferredAt: new Date(),
            transferAmount: totalPayout,
            firstPayoutProcessed: true,
            firstPayoutDate: new Date(),
            firstPayoutAmount: payoutSchedule.firstRentalPayout,
            verificationSchedule: verificationSchedule as any,
            nextVerificationDue: nextVerificationDue,
            qualityGuaranteePeriod,
            verificationPhotos: { checkpoints: [] },
            adminNotes: 'Auto-approved after 48 hours (no advertiser response)',
            payoutError: null,
          }
        });

        // ✅ Update message with autoApprovedAt
        const proofMessage = await db.message.findFirst({
          where: {
            bookingId: booking.id,
            messageType: 'PROOF_SUBMISSION',
          }
        });

        if (proofMessage) {
          await db.message.update({
            where: { id: proofMessage.id },
            data: {
              proofStatus: 'APPROVED',
              proofApprovedAt: new Date(),
              autoApprovedAt: new Date(),
            }
          });
        }

        await db.notification.create({
          data: {
            userId: booking.space.owner.id,
            type: 'PAYOUT_PROCESSED',
            title: 'Payment Sent (Auto-Approved)',
            content: `$${totalPayout.toFixed(2)} sent for "${booking.space.title}". Installation was automatically approved after advertiser review period expired.`,
            bookingId: booking.id,
          }
        });

        await db.notification.create({
          data: {
            userId: booking.campaign.advertiserId,
            type: 'PROOF_APPROVED',
            title: 'Installation Auto-Approved',
            content: `Installation for "${booking.campaign.name}" was automatically approved. Campaign is now live. You have ${PAYMENT_CONFIG.QUALITY_GUARANTEE_DAYS} days quality guarantee.`,
            bookingId: booking.id,
          }
        });

        results.push({
          bookingId: booking.id,
          action: 'auto_approved',
          payout: totalPayout,
        });

      } catch (error: any) {
        console.error(`Failed to auto-approve booking ${booking.id}:`, error);
        
        await db.booking.update({
          where: { id: booking.id },
          data: {
            proofStatus: 'APPROVED',
            proofApprovedAt: new Date(),
            status: 'ACTIVE',
            payoutError: error.message,
            adminNotes: `Auto-approved but payout failed: ${error.message}. Manual transfer required.`,
          }
        });

        results.push({ 
          bookingId: booking.id, 
          action: 'auto_approved_payout_failed', 
          error: error.message 
        });
      }
    }

    // ============================================
    // 1.5. 🆕 24-HOUR REMINDER: Notify advertisers 24h before auto-approval
    // ============================================
    const twentyFourHoursBeforeAutoApproval = await db.booking.findMany({
      where: {
        proofStatus: 'PENDING',
        proofUploadedAt: {
          gte: addHours(today, -25),
          lte: addHours(today, -23),
        }
      },
      include: {
        campaign: {
          select: {
            advertiserId: true,
            name: true,
          }
        },
        space: {
          select: {
            title: true,
          }
        }
      }
    });

    for (const booking of twentyFourHoursBeforeAutoApproval) {
      await db.notification.create({
        data: {
          userId: booking.campaign.advertiserId,
          type: 'PROOF_UPLOADED',
          title: '⏰ Installation Proof Auto-Approves in 24 Hours',
          content: `Installation proof for "${booking.space.title}" will be automatically approved in 24 hours unless you review it. View in messages to approve or request changes.`,
          bookingId: booking.id,
          campaignId: booking.campaignId,
        }
      });

      results.push({
        bookingId: booking.id,
        action: '24hr_review_reminder_sent',
      });
    }

    console.log(`[24HR REMINDER] Sent ${twentyFourHoursBeforeAutoApproval.length} reminders`);

    // ============================================
    // 2. BALANCE CHARGE REMINDERS: Notify 48 hours before balance due
    // ============================================
    const upcomingBalanceBookings = await db.booking.findMany({
      where: {
        status: 'PENDING_BALANCE',
        balanceDueDate: {
          gte: addDays(today, 1),
          lte: addDays(today, 3),
        },
        balancePaidAt: null,
      },
      include: {
        campaign: {
          include: {
            advertiser: {
              select: { id: true, name: true }
            }
          }
        },
        space: {
          select: { title: true }
        }
      }
    });

    for (const booking of upcomingBalanceBookings) {
      const daysUntilDue = differenceInDays(booking.balanceDueDate!, today);

      if (daysUntilDue === 2) {
        await db.notification.create({
          data: {
            userId: booking.campaign.advertiser.id,
            type: 'PAYMENT_REMINDER',
            title: 'Balance Payment Due Soon',
            content: `Your balance payment of $${Number(booking.balanceAmount).toFixed(2)} for "${booking.space.title}" is due in 2 days. Please ensure your payment method is up to date.`,
            bookingId: booking.id,
          }
        });

        results.push({
          bookingId: booking.id,
          action: 'balance_reminder_sent',
          daysUntil: daysUntilDue,
        });
      }
    }

    // ============================================
    // 3. CHARGE BALANCE
    // ============================================
    const balanceDueBookings = await db.booking.findMany({
      where: {
        status: 'PENDING_BALANCE',
        balanceDueDate: {
          lte: addDays(today, 1)
        },
        balancePaidAt: null,
      },
      include: {
        campaign: {
          include: {
            advertiser: {
              include: {
                advertiserProfile: true
              }
            }
          }
        },
        space: {
          select: {
            title: true,
          }
        }
      }
    });

    const MAX_RETRY_ATTEMPTS = 3;
    const RETRY_INTERVAL_HOURS = 24;

    for (const booking of balanceDueBookings) {
      // ✅ FIX BUG-PAY-001: Check if another cron job is already processing this booking
      // Verify the booking is still in PENDING_BALANCE state and hasn't been paid
      const bookingStatus = await db.booking.findUnique({
        where: { id: booking.id },
        select: {
          id: true,
          status: true,
          balancePaidAt: true,
          lastBalanceChargeAttempt: true,
        },
      });

      if (!bookingStatus) {
        console.log(`[BALANCE CHARGE] Booking ${booking.id} not found, skipping`);
        continue;
      }

      if (bookingStatus.status !== 'PENDING_BALANCE' || bookingStatus.balancePaidAt) {
        console.log(`[BALANCE CHARGE] Booking ${booking.id} already processed (status: ${bookingStatus.status}, paid: ${!!bookingStatus.balancePaidAt}), skipping`);
        continue;
      }

      // Check if another process just started processing (within last 30 seconds)
      if (bookingStatus.lastBalanceChargeAttempt) {
        const secondsSinceAttempt = (today.getTime() - bookingStatus.lastBalanceChargeAttempt.getTime()) / 1000;
        if (secondsSinceAttempt < 30) {
          console.log(`[BALANCE CHARGE] Booking ${booking.id} being processed by another job (${secondsSinceAttempt}s ago), skipping`);
          continue;
        }
      }

      if (booking.balanceChargeAttempts >= MAX_RETRY_ATTEMPTS) {
        const daysSinceDue = differenceInDays(today, booking.balanceDueDate!);

        console.error(`[BALANCE CHARGE] Booking ${booking.id} exceeded retry limit (${MAX_RETRY_ATTEMPTS}). Cancelling.`);

        await db.booking.update({
          where: { id: booking.id },
          data: {
            status: 'CANCELLED',
            adminNotes: `Cancelled: Balance payment failed after ${MAX_RETRY_ATTEMPTS} attempts over ${daysSinceDue} days`,
          }
        });

        if (booking.depositChargeId) {
          try {
            await stripe.refunds.create({
              charge: booking.depositChargeId,
              reason: 'requested_by_customer',
            });

            await db.notification.create({
              data: {
                userId: booking.campaign.advertiser.id,
                type: 'BOOKING_CANCELLED',
                title: 'Booking Cancelled',
                content: `Booking for "${booking.space.title}" was cancelled because balance payment failed after ${MAX_RETRY_ATTEMPTS} attempts. Deposit refunded.`,
                bookingId: booking.id,
              }
            });
          } catch (error) {
            console.error(`[BALANCE CHARGE] Failed to refund deposit for booking ${booking.id}:`, error);
          }
        }

        continue;
      }

      if (booking.lastBalanceChargeAttempt) {
        const hoursSinceAttempt = differenceInDays(today, booking.lastBalanceChargeAttempt) * 24;
        if (hoursSinceAttempt < RETRY_INTERVAL_HOURS) {
          console.log(`[BALANCE CHARGE] Skipping booking ${booking.id}: Too soon since last attempt (${hoursSinceAttempt}h < ${RETRY_INTERVAL_HOURS}h)`);
          continue;
        }
      }

      const customerId = booking.campaign.advertiser.advertiserProfile?.stripeCustomerId;

      if (!customerId) {
        console.error(`[BALANCE CHARGE] No Stripe customer for booking ${booking.id}`);

        await db.booking.update({
          where: { id: booking.id },
          data: {
            status: 'CANCELLED',
            adminNotes: 'Cancelled: No payment method on file for balance charge',
            balanceChargeError: 'No Stripe customer ID',
          }
        });

        if (booking.depositChargeId) {
          try {
            await stripe.refunds.create({
              charge: booking.depositChargeId,
              reason: 'requested_by_customer',
            });

            await db.notification.create({
              data: {
                userId: booking.campaign.advertiser.id,
                type: 'BOOKING_CANCELLED',
                title: 'Booking Cancelled',
                content: `Booking for "${booking.space.title}" was cancelled because no payment method was found. Deposit refunded.`,
                bookingId: booking.id,
              }
            });
          } catch (error) {
            console.error(`[BALANCE CHARGE] Failed to refund deposit for booking ${booking.id}:`, error);
          }
        }

        continue;
      }

      try {
        console.log(`[BALANCE CHARGE] Attempt ${booking.balanceChargeAttempts + 1}/${MAX_RETRY_ATTEMPTS} for booking ${booking.id}`);

        // ✅ FIX BUG-PAY-001: Mark booking as being processed (soft lock)
        // This prevents other concurrent cron jobs from processing the same booking
        await db.booking.update({
          where: { id: booking.id },
          data: { lastBalanceChargeAttempt: new Date() },
        });

        const idempotencyKey = `balance_${booking.id}_${booking.balanceDueDate?.getTime()}`;

        const paymentIntent = await stripe.paymentIntents.create({
          amount: Math.round(Number(booking.balanceAmount) * 100),
          currency: 'usd',
          customer: customerId,
          description: `Balance payment for ${booking.campaign.name} - ${booking.space.title}`,
          metadata: {
            bookingId: booking.id,
            chargeType: 'balance',
            campaignId: booking.campaignId,
            attemptNumber: booking.balanceChargeAttempts + 1,
          },
          confirm: true,
          off_session: true,
        }, {
          idempotencyKey,
        });

        console.log(`[BALANCE CHARGE] Success for booking ${booking.id}: ${paymentIntent.id}`);

        await db.booking.update({
          where: { id: booking.id },
          data: {
            balanceChargeAttempts: 0,
            lastBalanceChargeAttempt: new Date(),
            balanceChargeError: null,
          }
        });

        await db.notification.create({
          data: {
            userId: booking.campaign.advertiser.id,
            type: 'PAYMENT_RECEIVED',
            title: 'Balance Payment Processed',
            content: `Balance payment of $${Number(booking.balanceAmount).toFixed(2)} has been charged for "${booking.space.title}". Your booking is now fully paid.`,
            bookingId: booking.id,
          }
        });

        results.push({
          bookingId: booking.id,
          action: 'balance_charged',
          amount: Number(booking.balanceAmount),
        });

      } catch (error: any) {
        console.error(`[BALANCE CHARGE] Failed for booking ${booking.id}:`, error);

        const newAttempts = booking.balanceChargeAttempts + 1;

        await db.booking.update({
          where: { id: booking.id },
          data: {
            balanceChargeAttempts: newAttempts,
            lastBalanceChargeAttempt: new Date(),
            balanceChargeError: error.message || 'Unknown error',
          }
        });

        if (newAttempts === 1) {
          await db.notification.create({
            data: {
              userId: booking.campaign.advertiser.id,
              type: 'PAYMENT_FAILED',
              title: 'Balance Payment Failed',
              content: `We couldn't charge your card for "${booking.space.title}". We'll retry daily for ${MAX_RETRY_ATTEMPTS} days. Please ensure your payment method is valid or use the "Retry Payment" button.`,
              bookingId: booking.id,
            }
          });
        }

        results.push({
          bookingId: booking.id,
          action: 'balance_charge_failed',
          attempt: newAttempts,
          error: error.code || error.message,
        });
      }
    }

    // ============================================
    // 4. MARK CAMPAIGNS COMPLETE
    // ============================================
    const completedCampaigns = await db.booking.findMany({
      where: {
        status: 'ACTIVE',
        endDate: {
          lte: today
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
          select: {
            name: true,
            advertiserId: true
          }
        }
      }
    });

    for (const booking of completedCampaigns) {
      await db.booking.update({
        where: { id: booking.id },
        data: { status: 'COMPLETED' }
      });

      await db.notification.create({
        data: {
          userId: booking.space.owner.id,
          type: 'SYSTEM_UPDATE',
          title: 'Campaign Completed',
          content: `Your campaign "${booking.campaign.name}" has been completed. Thank you!`,
          bookingId: booking.id
        }
      });

      results.push({
        bookingId: booking.id,
        action: 'marked_complete',
        campaignName: booking.campaign.name
      });
    }

    // ============================================
    // 5. CANCEL NO-PROOF BOOKINGS
    // ============================================
    const overdueNoProof = await db.booking.findMany({
      where: {
        status: 'CONFIRMED',
        paidAt: { not: null },
        proofUploadedAt: null
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
            advertiserId: true
          }
        }
      }
    });

    for (const booking of overdueNoProof) {
      if (!booking.paidAt) continue;
      
      const daysSincePayment = differenceInDays(today, booking.paidAt);
      
      if (daysSincePayment > 5) {
        await db.booking.update({
          where: { id: booking.id },
          data: {
            status: 'CANCELLED',
            adminNotes: `Auto-cancelled: No proof uploaded after ${daysSincePayment} days`
          }
        });

        await db.notification.create({
          data: {
            userId: booking.space.owner.id,
            type: 'SYSTEM_UPDATE',
            title: 'Booking Cancelled - No Proof',
            content: `Your booking for "${booking.space.title}" was cancelled because installation proof was not uploaded within 5 days of payment.`,
            bookingId: booking.id
          }
        });

        await db.notification.create({
          data: {
            userId: booking.campaign.advertiserId,
            type: 'SYSTEM_UPDATE',
            title: 'Booking Cancelled - Refund Issued',
            content: `Your booking was cancelled because the space owner did not install your ad. A full refund has been processed.`,
            bookingId: booking.id
          }
        });

        results.push({
          bookingId: booking.id,
          action: 'cancelled_no_proof',
          daysSincePayment
        });
      }
    }

    // ============================================
    // 6. VERIFICATION REMINDERS
    // ============================================
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
            content: `Verification photo for "${booking.campaign.name}" is due in 3 days. Upload your photo to receive payment.`,
            bookingId: booking.id,
          }
        });
      }
    }

    // ============================================
    // 7. INSTALLATION WINDOW REMINDERS
    // ============================================
    const upcomingBookings = await db.booking.findMany({
      where: {
        status: { in: ['CONFIRMED', 'PENDING_BALANCE'] },
        proofStatus: null,
        startDate: {
          gte: new Date(),
          lte: addDays(new Date(), 7),
        },
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

    for (const booking of upcomingBookings) {
      const daysUntilStart = differenceInDays(booking.startDate, new Date());

      if (daysUntilStart === 7) {
        await db.notification.create({
          data: {
            userId: booking.space.owner.id,
            type: 'SYSTEM_UPDATE',
            title: 'Installation Window Now Open',
            content: `You can now install the ad for ${booking.campaign.name} and upload proof photos. Campaign starts in 7 days.`,
            bookingId: booking.id,
          },
        });
      } else if (daysUntilStart === 3) {
        await db.notification.create({
          data: {
            userId: booking.space.owner.id,
            type: 'SYSTEM_UPDATE',
            title: '⚠️ Install Your Ad Soon',
            content: `Campaign starts in 3 days. Please install the ad for ${booking.campaign.name} and upload proof soon.`,
            bookingId: booking.id,
          },
        });
      } else if (daysUntilStart === 1) {
        await db.notification.create({
          data: {
            userId: booking.space.owner.id,
            type: 'SYSTEM_UPDATE',
            title: '🚨 Last Chance to Install',
            content: `Campaign starts tomorrow! Upload installation proof today or the booking will be canceled.`,
            bookingId: booking.id,
          },
        });
      }
    }

    // ============================================
    // 8. OVERDUE VERIFICATION WARNINGS
    // ============================================
    const overdueVerifications = await db.booking.findMany({
      where: {
        status: 'ACTIVE',
        nextVerificationDue: {
          lt: today
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
          select: {
            name: true,
            advertiserId: true,
          }
        }
      }
    });

    for (const booking of overdueVerifications) {
      const daysOverdue = differenceInDays(
        today,
        new Date(booking.nextVerificationDue!)
      );
      
      await db.notification.create({
        data: {
          userId: booking.space.owner.id,
          type: 'SYSTEM_UPDATE',
          title: 'URGENT: Verification Overdue',
          content: `Your verification photo for "${booking.campaign.name}" is ${daysOverdue} days overdue. Upload immediately to avoid payment delays and reputation penalties.`,
          bookingId: booking.id,
        }
      });
      
      if (daysOverdue > 7) {
        console.error(`CRITICAL: Booking ${booking.id} verification is ${daysOverdue} days overdue.`);
      }
    }

    return NextResponse.json({
      success: true,
      timestamp: today.toISOString(),
      autoApprovals: overdueProofs.length,
      twentyFourHourReminders: twentyFourHoursBeforeAutoApproval.length,
      balanceCharges: balanceDueBookings.length,
      completedCampaigns: completedCampaigns.length,
      cancelledNoProof: results.filter(r => r.action === 'cancelled_no_proof').length,
      upcomingReminders: upcomingVerifications.filter(b => {
        const daysUntil = differenceInDays(new Date(b.nextVerificationDue!), today);
        return daysUntil === 3;
      }).length,
      overdueWarnings: overdueVerifications.length,
      results,
    });

  } catch (error) {
    console.error('Daily cron job error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}