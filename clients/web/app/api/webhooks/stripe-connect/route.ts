// src/app/api/webhooks/stripe-connect/route.ts
import { type NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { stripe } from '../../../../../elaview-mvp/src/lib/stripe';
import { db } from '../../../../../elaview-mvp/src/server/db';
import { sendNotifications } from '../../../../../elaview-mvp/src/lib/notifications';
import { WhatsAppAlerts } from '../../../../../elaview-mvp/src/lib/notifications/whatsapp';
import type Stripe from 'stripe';

const webhookSecret = process.env.STRIPE_CONNECT_WEBHOOK_SECRET!;

/**
 * Stripe Connect Webhook Handler
 * Monitors Connect account events for health tracking
 */
export async function POST(req: NextRequest) {
  const body = await req.text();
  const headersList = await headers();
  const signature = headersList.get('stripe-signature');

  if (!signature) {
    console.error('[STRIPE CONNECT WEBHOOK] Missing signature');
    return NextResponse.json({ error: 'Missing signature' }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err: any) {
    console.error('[STRIPE CONNECT WEBHOOK] Signature verification failed:', err.message);
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  console.log(`[STRIPE CONNECT WEBHOOK] Received event: ${event.type}`);

  try {
    switch (event.type) {
      case 'account.updated':
        await handleAccountUpdated(event.data.object);
        break;

      case 'account.application.deauthorized': {
        // ✅ FIX: Handle Application object type correctly
        const application = event.data.object;
        // The account ID is in the event.account field for this event type
        const accountId = event.account!;
        if (accountId) {
          const account = await stripe.accounts.retrieve(accountId);
          await handleAccountDeauthorized(account);
        }
        break;
      }

      case 'account.external_account.created':
        await handleExternalAccountCreated(event.data.object as Stripe.BankAccount | Stripe.Card);
        break;

      case 'account.external_account.deleted':
        await handleExternalAccountDeleted(event.data.object as Stripe.BankAccount | Stripe.Card);
        break;

      default:
        console.log(`[STRIPE CONNECT WEBHOOK] Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });

  } catch (error) {
    console.error('[STRIPE CONNECT WEBHOOK] Error processing event:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}

/**
 * Handle account.updated event
 * Detects changes in account status, requirements, or capabilities
 */
async function handleAccountUpdated(account: Stripe.Account) {
  console.log(`[ACCOUNT UPDATED] Processing account: ${account.id}`);

  // Find space owner with this Stripe account
  const spaceOwner = await db.spaceOwnerProfile.findFirst({
    where: { stripeAccountId: account.id },
    include: {
      user: {
        select: {
          id: true,
          email: true,
          name: true,
        }
      }
    },
  });

  if (!spaceOwner) {
    console.warn(`[ACCOUNT UPDATED] No space owner found for account ${account.id}`);
    return;
  }

  const isActive = account.charges_enabled && account.payouts_enabled;
  const isComplete = account.details_submitted && isActive;

  // Determine account status
  let accountStatus = 'PENDING';
  let shouldNotify = false;
  let notificationMessage = '';

  if (account.requirements?.disabled_reason) {
    accountStatus = 'DISABLED';
    shouldNotify = true;
    notificationMessage = `Account disabled: ${account.requirements.disabled_reason}`;
  } else if (account.requirements?.currently_due && account.requirements.currently_due.length > 0) {
    accountStatus = 'RESTRICTED';
    shouldNotify = true;
    notificationMessage = `Account restricted. ${account.requirements.currently_due.length} verification items required.`;
  } else if (isActive) {
    accountStatus = 'ACTIVE';
    // If previously disconnected, notify about reconnection
    if (spaceOwner.accountDisconnectedAt) {
      shouldNotify = true;
      notificationMessage = 'Account reconnected successfully!';
    }
  }

  // Detect disconnection (was active, now not)
  const wasActive = spaceOwner.stripeAccountStatus === 'ACTIVE';
  const isNowInactive = !isActive;
  const isDisconnection = wasActive && isNowInactive;

  console.log(`[ACCOUNT UPDATED] Status change:`, {
    account: account.id,
    previousStatus: spaceOwner.stripeAccountStatus,
    newStatus: accountStatus,
    isDisconnection,
    user: spaceOwner.user.email,
  });

  // Update database
  await db.spaceOwnerProfile.update({
    where: { id: spaceOwner.id },
    data: {
      stripeAccountStatus: accountStatus,
      onboardingComplete: isComplete,
      lastAccountHealthCheck: new Date(),
      accountDisconnectedAt: isDisconnection ? new Date() : (accountStatus === 'ACTIVE' ? null : spaceOwner.accountDisconnectedAt),
    },
  });

  // Handle disconnection
  if (isDisconnection) {
    console.error(`[ACCOUNT DISCONNECTED] User ${spaceOwner.user.email} account disconnected`);

    // Create in-app notification
    await db.notification.create({
      data: {
        userId: spaceOwner.user.id,
        type: 'SYSTEM_UPDATE',
        title: '🚨 Stripe Account Disconnected',
        content: `Your Stripe payout account has been disconnected or restricted. Please reconnect within 7 days to avoid space listing suspension.`,
      },
    });

    // Send email notification
    await sendNotifications({
      type: 'space_submitted', // Using existing type, should create new one
      spaceTitle: 'N/A',
      ownerEmail: spaceOwner.user.email,
      ownerName: spaceOwner.user.name || undefined,
    }).catch(err => console.error('Failed to send email:', err));

    // Send WhatsApp alert to admin
    await WhatsAppAlerts.payoutFailed({
      bookingId: 'DISCONNECT',
      ownerName: spaceOwner.user.name || spaceOwner.user.email,
      amount: 0,
      error: notificationMessage,
    }).catch(err => console.error('Failed to send WhatsApp:', err));

    // Mark disconnection notification time
    await db.spaceOwnerProfile.update({
      where: { id: spaceOwner.id },
      data: {
        accountDisconnectedNotifiedAt: new Date(),
      },
    });
  }

  // Handle reconnection
  if (accountStatus === 'ACTIVE' && spaceOwner.accountDisconnectedAt) {
    console.log(`[ACCOUNT RECONNECTED] User ${spaceOwner.user.email} reconnected account`);

    await db.notification.create({
      data: {
        userId: spaceOwner.user.id,
        type: 'SYSTEM_UPDATE',
        title: '✅ Stripe Account Reconnected',
        content: `Your Stripe payout account has been successfully reconnected. Your spaces are active and you can receive payouts.`,
      },
    });

    // TODO: Process any held payouts
  }

  console.log(`[ACCOUNT UPDATED] Updated database for ${spaceOwner.user.email}: ${accountStatus}`);
}

/**
 * Handle account.application.deauthorized event
 * User explicitly removed the platform connection
 */
async function handleAccountDeauthorized(account: Stripe.Account) {
  console.error(`[ACCOUNT DEAUTHORIZED] Account ${account.id} disconnected platform`);

  const spaceOwner = await db.spaceOwnerProfile.findFirst({
    where: { stripeAccountId: account.id },
    include: {
      user: {
        select: {
          id: true,
          email: true,
          name: true,
        }
      }
    },
  });

  if (!spaceOwner) {
    console.warn(`[ACCOUNT DEAUTHORIZED] No space owner found for ${account.id}`);
    return;
  }

  // Mark account as disabled
  await db.spaceOwnerProfile.update({
    where: { id: spaceOwner.id },
    data: {
      stripeAccountStatus: 'DISABLED',
      accountDisconnectedAt: new Date(),
      lastAccountHealthCheck: new Date(),
    },
  });

  // Deactivate all their spaces
  await db.space.updateMany({
    where: {
      ownerId: spaceOwner.user.id,
      status: 'ACTIVE',
    },
    data: {
      status: 'SUSPENDED',
    },
  });

  // Notify user
  await db.notification.create({
    data: {
      userId: spaceOwner.user.id,
      type: 'SYSTEM_UPDATE',
      title: '⚠️ Stripe Account Disconnected',
      content: `You have disconnected Elaview from your Stripe account. Your spaces have been suspended. To reactivate, please reconnect your Stripe account in Settings.`,
    },
  });

  // Alert admin
  await WhatsAppAlerts.payoutFailed({
    bookingId: 'DEAUTH',
    ownerName: spaceOwner.user.name || spaceOwner.user.email,
    amount: 0,
    error: 'User deauthorized platform access',
  }).catch(err => console.error('Failed to send WhatsApp:', err));

  console.log(`[ACCOUNT DEAUTHORIZED] Suspended spaces for ${spaceOwner.user.email}`);
}

/**
 * Handle external_account.created event
 * Space owner added a bank account or debit card
 */
async function handleExternalAccountCreated(
  externalAccount: Stripe.BankAccount | Stripe.Card
) {
  console.log(`[EXTERNAL ACCOUNT CREATED] Type: ${externalAccount.object}, Account: ${externalAccount.account}`);

  const spaceOwner = await db.spaceOwnerProfile.findFirst({
    where: { stripeAccountId: externalAccount.account as string },
    include: {
      user: {
        select: {
          id: true,
          email: true,
          name: true,
        }
      }
    },
  });

  if (!spaceOwner) return;

  // Notify user of successful bank account addition
  await db.notification.create({
    data: {
      userId: spaceOwner.user.id,
      type: 'SYSTEM_UPDATE',
      title: '✅ Payout Method Added',
      content: `Your payout method has been added successfully. You can now receive payments.`,
    },
  });

  console.log(`[EXTERNAL ACCOUNT CREATED] Notified ${spaceOwner.user.email}`);
}

/**
 * Handle external_account.deleted event
 * Space owner removed their bank account
 */
async function handleExternalAccountDeleted(
  externalAccount: Stripe.BankAccount | Stripe.Card
) {
  console.warn(`[EXTERNAL ACCOUNT DELETED] Type: ${externalAccount.object}, Account: ${externalAccount.account}`);

  const spaceOwner = await db.spaceOwnerProfile.findFirst({
    where: { stripeAccountId: externalAccount.account as string },
    include: {
      user: {
        select: {
          id: true,
          email: true,
          name: true,
        }
      }
    },
  });

  if (!spaceOwner) return;

  // Warn user about removed payout method
  await db.notification.create({
    data: {
      userId: spaceOwner.user.id,
      type: 'SYSTEM_UPDATE',
      title: '⚠️ Payout Method Removed',
      content: `Your payout method has been removed. Please add a new bank account to continue receiving payments.`,
    },
  });

  // Mark as needing action
  await db.spaceOwnerProfile.update({
    where: { id: spaceOwner.id },
    data: {
      stripeAccountStatus: 'RESTRICTED',
      lastAccountHealthCheck: new Date(),
    },
  });

  console.log(`[EXTERNAL ACCOUNT DELETED] Updated status for ${spaceOwner.user.email}`);
}