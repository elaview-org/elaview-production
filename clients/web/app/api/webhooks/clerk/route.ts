// src/app/api/webhooks/clerk/route.ts
import { type NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { Webhook } from 'svix';
import { db } from '../../../../../elaview-mvp/src/server/db';

type ClerkWebhookEvent = {
  type: string;
  data: {
    id: string;
    email_addresses: Array<{ email_address: string; id: string }>;
    first_name?: string;
    last_name?: string;
    image_url?: string;
    phone_numbers?: Array<{ phone_number: string }>;
  };
};

export async function POST(req: NextRequest) {
  // Get the headers
  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error occured -- no svix headers', {
      status: 400
    });
  }

  // Get the body
  const payload = await req.text();

  // Create a new Svix instance with your secret.
  const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET!);

  let evt: ClerkWebhookEvent;

  // Verify the payload with the headers
  try {
    evt = wh.verify(payload, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as ClerkWebhookEvent;
  } catch (err) {
    console.error('Error verifying webhook:', err);
    return new Response('Error occured', {
      status: 400
    });
  }

  // Handle the webhook
  const { type, data } = evt;
  console.log(`Clerk webhook received: ${type} for user ${data.id}`);

  try {
    switch (type) {
      case 'user.created':
        await handleUserCreated(data);
        break;
      case 'user.updated':
        await handleUserUpdated(data);
        break;
      case 'user.deleted':
        await handleUserDeleted(data);
        break;
      default:
        console.log(`Unhandled webhook type: ${type}`);
    }

    return NextResponse.json({ message: 'Webhook processed successfully' });
  } catch (error) {
    console.error('Error processing webhook:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

async function handleUserCreated(data: ClerkWebhookEvent['data']) {
  // Find primary email
  const primaryEmail = data.email_addresses.find(email => email.id === data.email_addresses[0]?.id);
  const primaryPhone = data.phone_numbers?.[0]?.phone_number;

  // Handle test events gracefully
  if (!primaryEmail) {
    console.log('[Clerk Webhook] Test event received (no email data). Webhook verification successful.');
    return;
  }

  const fullName = [data.first_name, data.last_name].filter(Boolean).join(' ') || null;

  // Check if user should be admin
  const adminEmails = process.env.ADMIN_EMAILS?.split(',').map(e => e.trim().toLowerCase()) || [];
  const isAdmin = adminEmails.includes(primaryEmail.email_address.toLowerCase());

  // Check if user already exists
  const existingUser = await db.user.findUnique({
    where: { clerkId: data.id }
  });

  if (existingUser) {
    console.log(`[Clerk Webhook] User ${data.id} already exists, skipping creation`);
    return;
  }

  // Create user
  const user = await db.user.create({
    data: {
      clerkId: data.id,
      email: primaryEmail.email_address,
      name: fullName,
      phone: primaryPhone || null,
      avatar: data.image_url || null,
      role: isAdmin ? 'ADMIN' : 'ADVERTISER',
      status: 'ACTIVE',
      advertiserProfile: {
        create: {
          companyName: null,
          industry: null,
          website: null,
        }
      }
    },
    include: {
      advertiserProfile: true,
    }
  });

  console.log(`[Clerk Webhook] User created: ${user.id} (${user.email}) - Role: ${user.role}`);
}

async function handleUserUpdated(data: ClerkWebhookEvent['data']) {
  const primaryEmail = data.email_addresses.find(email => email.id === data.email_addresses[0]?.id);
  const primaryPhone = data.phone_numbers?.[0]?.phone_number;
  const fullName = [data.first_name, data.last_name].filter(Boolean).join(' ') || null;

  // Handle test events gracefully
  if (!primaryEmail) {
    console.log('[Clerk Webhook] Test event received (no email data). Skipping update.');
    return;
  }

  // Update user in database
  await db.user.update({
    where: { clerkId: data.id },
    data: {
      email: primaryEmail.email_address,
      name: fullName,
      phone: primaryPhone || null,
      avatar: data.image_url || null,
      updatedAt: new Date(),
    }
  });

  console.log('User updated in database via webhook:', data.id);
}

async function handleUserDeleted(data: ClerkWebhookEvent['data']) {
  // Soft delete - update status instead of hard delete
  await db.user.update({
    where: { clerkId: data.id },
    data: {
      status: 'DELETED',
      updatedAt: new Date(),
    }
  });

  console.log('User soft deleted in database via webhook:', data.id);
}
