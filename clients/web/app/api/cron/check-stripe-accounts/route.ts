// src/app/api/cron/check-stripe-accounts/route.ts
import { type NextRequest, NextResponse } from 'next/server';
import { db } from '../../../../../elaview-mvp/src/server/db';
import { stripe } from '../../../../../elaview-mvp/src/lib/stripe';
import { WhatsAppAlerts, sendWhatsAppMessage } from '../../../../../elaview-mvp/src/lib/notifications/whatsapp';
import { addDays, differenceInDays } from 'date-fns';

/**
 * Scheduled Stripe Connect Account Health Check
 * Runs every 24 hours to verify all active space owner accounts
 *
 * Schedule: Daily at 2:00 AM UTC
 * Cron expression: 0 2 * * *
 *
 * Vercel Cron: Add to vercel.json:
 * {
 *   "crons": [{
 *     "path": "/api/cron/check-stripe-accounts",
 *     "schedule": "0 2 * * *"
 *   }]
 * }
 */
export async function GET(request: NextRequest) {
  try {
    // Verify cron secret
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      console.error('[STRIPE HEALTH CHECK] Unauthorized access attempt');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log('[STRIPE HEALTH CHECK] Starting daily account health check...');

    const results = {
      checked: 0,
      active: 0,
      restricted: 0,
      disabled: 0,
      disconnected: 0,
      errors: 0,
      suspendedSpaces: 0,
      notificationsSent: 0,
    };

    // Get all space owners with Stripe accounts
    const spaceOwners = await db.spaceOwnerProfile.findMany({
      where: {
        stripeAccountId: { not: null },
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
            role: true,
          }
        }
      },
    });

    console.log(`[STRIPE HEALTH CHECK] Found ${spaceOwners.length} accounts to check`);

    for (const owner of spaceOwners) {
      try {
        results.checked++;

        // Skip if user is no longer a space owner
        if (owner.user.role !== 'SPACE_OWNER') {
          console.log(`[STRIPE HEALTH CHECK] Skipping ${owner.user.email} - not space owner`);
          continue;
        }

        // Retrieve account from Stripe
        const account = await stripe.accounts.retrieve(owner.stripeAccountId!);

        const isActive = account.charges_enabled && account.payouts_enabled;
        const isComplete = account.details_submitted && isActive;

        // Determine status
        let accountStatus = 'PENDING';
        if (account.requirements?.disabled_reason) {
          accountStatus = 'DISABLED';
          results.disabled++;
        } else if (account.requirements?.currently_due && account.requirements.currently_due.length > 0) {
          accountStatus = 'RESTRICTED';
          results.restricted++;
        } else if (isActive) {
          accountStatus = 'ACTIVE';
          results.active++;
        }

        // Check for disconnection (was active, now not)
        const wasActive = owner.stripeAccountStatus === 'ACTIVE';
        const isNowInactive = !isActive;
        const isNewDisconnection = wasActive && isNowInactive && !owner.accountDisconnectedAt;

        // Update database
        await db.spaceOwnerProfile.update({
          where: { id: owner.id },
          data: {
            stripeAccountStatus: accountStatus,
            onboardingComplete: isComplete,
            lastAccountHealthCheck: new Date(),
            accountDisconnectedAt: isNewDisconnection
              ? new Date()
              : (accountStatus === 'ACTIVE' ? null : owner.accountDisconnectedAt),
          },
        });

        // Handle new disconnections
        if (isNewDisconnection) {
          results.disconnected++;
          console.error(`[STRIPE HEALTH CHECK] NEW DISCONNECTION: ${owner.user.email}`);

          await db.notification.create({
            data: {
              userId: owner.user.id,
              type: 'SYSTEM_UPDATE',
              title: '🚨 Stripe Account Issue Detected',
              content: `Your Stripe payout account requires attention. Please reconnect within 7 days to avoid space listing suspension.`,
            },
          });

          await db.spaceOwnerProfile.update({
            where: { id: owner.id },
            data: { accountDisconnectedNotifiedAt: new Date() },
          });

          results.notificationsSent++;

          // Alert admin
          await WhatsAppAlerts.payoutFailed({
            bookingId: 'HEALTH_CHECK',
            ownerName: owner.user.name || owner.user.email,
            amount: 0,
            error: `Account no longer active: ${account.requirements?.disabled_reason || 'Unknown reason'}`,
          }).catch(err => console.error('WhatsApp alert failed:', err));
        }

        // Check 7-day grace period expiration
        if (owner.accountDisconnectedAt && accountStatus !== 'ACTIVE') {
          const daysSinceDisconnect = differenceInDays(new Date(), owner.accountDisconnectedAt);

          if (daysSinceDisconnect >= 7) {
            console.warn(`[STRIPE HEALTH CHECK] Grace period expired for ${owner.user.email}`);

            // Suspend all active spaces
            const suspendedCount = await db.space.updateMany({
              where: {
                ownerId: owner.user.id,
                status: 'ACTIVE',
              },
              data: {
                status: 'SUSPENDED',
                rejectionReason: 'Space suspended: Stripe account disconnected for over 7 days. Please reconnect your payout account.',
              },
            });

            results.suspendedSpaces += suspendedCount.count;

            // Notify user
            if (suspendedCount.count > 0) {
              await db.notification.create({
                data: {
                  userId: owner.user.id,
                  type: 'SYSTEM_UPDATE',
                  title: '⚠️ Spaces Suspended',
                  content: `Your ${suspendedCount.count} space(s) have been suspended due to disconnected Stripe account. Reconnect your payout account to reactivate.`,
                },
              });

              results.notificationsSent++;
            }
          } else if (daysSinceDisconnect === 5) {
            // 2-day warning
            await db.notification.create({
              data: {
                userId: owner.user.id,
                type: 'SYSTEM_UPDATE',
                title: '⏰ 2 Days Until Space Suspension',
                content: `Your Stripe account has been disconnected for 5 days. Reconnect within 2 days to avoid space suspension.`,
              },
            });

            results.notificationsSent++;
          }
        }

        console.log(`[STRIPE HEALTH CHECK] ${owner.user.email}: ${accountStatus}`);

      } catch (error: any) {
        results.errors++;
        console.error(`[STRIPE HEALTH CHECK] Error checking ${owner.user.email}:`, error);

        // If account not found, mark as disabled
        if (error.type === 'StripeInvalidRequestError' && error.code === 'account_invalid') {
          await db.spaceOwnerProfile.update({
            where: { id: owner.id },
            data: {
              stripeAccountStatus: 'DISABLED',
              accountDisconnectedAt: new Date(),
              lastAccountHealthCheck: new Date(),
            },
          });
        }
      }
    }

    // Send daily summary to admin (only if there are issues)
    if (results.disconnected > 0 || results.disabled > 0 || results.restricted > 0 || results.suspendedSpaces > 0) {
      const summary =
        `📊 *Daily Stripe Account Health Report*\n\n` +
        `✅ Active: ${results.active}\n` +
        `⚠️ Restricted: ${results.restricted}\n` +
        `❌ Disabled: ${results.disabled}\n` +
        `🔴 New Disconnections: ${results.disconnected}\n` +
        `🚫 Spaces Suspended: ${results.suspendedSpaces}\n\n` +
        `Total Checked: ${results.checked}\n` +
        `Errors: ${results.errors}\n` +
        `Notifications Sent: ${results.notificationsSent}`;

      await sendWhatsAppMessage(summary).catch(err =>
        console.error('Failed to send summary:', err)
      );
    }

    console.log('[STRIPE HEALTH CHECK] Completed successfully', results);

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      ...results,
    });

  } catch (error) {
    console.error('[STRIPE HEALTH CHECK] Fatal error:', error);
    return NextResponse.json(
      {
        error: 'Health check failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
