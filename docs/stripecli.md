Test Credit Cards
Use these in the Stripe checkout:
Card NumberDescription4242 4242 4242 4242Successful payment4000 0000 0000 9995Declined payment4000 0025 0000 3155Requires authentication (3D Secure)



# This will give you the webhook secret
stripe listen --forward-to localhost:3000/api/webhooks/stripe



# Stripe Payment Integration Setup Guide

## Files Created

1. ✅ `src/lib/stripe.ts` - Stripe client initialization
2. ✅ `src/app/api/webhooks/stripe/route.ts` - Webhook handler
3. ✅ Payment mutation added to `src/server/api/routers/bookings.ts`
4. ✅ Updated `src/app/campaigns/[id]/page.tsx` - Campaign details with "Pay Now"

---

## Step 1: Get Your Stripe Test Keys

1. Go to https://dashboard.stripe.com/register (create account if needed)
2. Switch to **Test Mode** (toggle in top right)
3. Go to **Developers** → **API Keys**: https://dashboard.stripe.com/test/apikeys
4. Copy these keys:
   - **Publishable key** (starts with `pk_test_`)
   - **Secret key** (starts with `sk_test_`) - click "Reveal test key"

---

## Step 2: Add Keys to `.env.local`

Add these lines to your `.env.local` file:

```env
# Stripe
STRIPE_SECRET_KEY=sk_test_YOUR_SECRET_KEY_HERE
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_YOUR_PUBLISHABLE_KEY_HERE
STRIPE_WEBHOOK_SECRET=whsec_YOUR_WEBHOOK_SECRET_HERE  # We'll get this in Step 4
NEXT_PUBLIC_APP_URL=http://localhost:3000  # Change to your production URL when deploying
```

---

## Step 3: Install Stripe Package

Run this command in your terminal:

```bash
pnpm add stripe @stripe/stripe-js
```

---

## Step 4: Set Up Stripe Webhook (Local Testing)

### Option A: Use Stripe CLI (Recommended for Development)

1. Install Stripe CLI: https://stripe.com/docs/stripe-cli
   
   **Mac:**
   ```bash
   brew install stripe/stripe-cli/stripe
   ```
   
   **Windows:**
   Download from https://github.com/stripe/stripe-cli/releases

2. Login to Stripe CLI:
   ```bash
   stripe login
   ```

3. Forward webhooks to your local server:
   ```bash
   stripe listen --forward-to localhost:3000/api/webhooks/stripe
   ```

4. Copy the webhook signing secret (starts with `whsec_`)
5. Add it to `.env.local` as `STRIPE_WEBHOOK_SECRET`

### Option B: Use ngrok (Alternative)

1. Install ngrok: https://ngrok.com/download
2. Start your Next.js app: `pnpm dev`
3. In another terminal, run: `ngrok http 3000`
4. Copy the https URL (e.g., `https://abc123.ngrok.io`)
5. Go to Stripe Dashboard → **Developers** → **Webhooks**
6. Click **Add endpoint**
7. Endpoint URL: `https://abc123.ngrok.io/api/webhooks/stripe`
8. Events to listen for:
   - `checkout.session.completed`
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
9. Copy the **Signing secret** to `.env.local`

---

## Step 5: Update Your Code

### Add the payment mutation to `bookings.ts`:

Open `src/server/api/routers/bookings.ts` and add the import at the top:

```typescript
import { stripe, formatAmountForStripe } from '~/lib/stripe';
```

Then add the `createCheckoutSession` mutation to the `bookingsRouter` (the full code is in the artifact).

---

## Step 6: Test the Payment Flow

### Start Everything:

```bash
# Terminal 1: Start your app
pnpm dev

# Terminal 2: Start Stripe webhook forwarding
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

### Test Flow:

1. **Create a Campaign** (`/campaigns/new`)
   - Upload creative
   - Fill in details
   
2. **Browse & Add Spaces** (`/browse`)
   - Select campaign
   - Add spaces to cart
   
3. **Submit for Approval** (`/cart`)
   - Click "Submit for Approval"
   
4. **Approve as Space Owner** (switch to space owner role)
   - Go to `/requests`
   - Approve the booking
   
5. **Pay as Advertiser** (switch back to advertiser)
   - Go to `/campaigns/[id]`
   - See "Payment Required" banner
   - Click "Pay Now"
   - Use test card: `4242 4242 4242 4242`
   - Any future expiry date
   - Any CVC
   
6. **Verify**
   - Payment redirects back to campaign
   - Booking status changes to `CONFIRMED`
   - Both parties get notifications

---

## Test Credit Cards

Use these in the Stripe checkout:

| Card Number | Description |
|-------------|-------------|
| `4242 4242 4242 4242` | Successful payment |
| `4000 0000 0000 9995` | Declined payment |
| `4000 0025 0000 3155` | Requires authentication (3D Secure) |

All test cards:
- **Expiry**: Any future date (e.g., 12/34)
- **CVC**: Any 3 digits (e.g., 123)
- **ZIP**: Any 5 digits (e.g., 12345)

---

## Step 7: Deploy to Production

### When deploying to Railway/Vercel:

1. Add environment variables to your hosting platform:
   ```
   STRIPE_SECRET_KEY=sk_live_... (from production mode)
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
   NEXT_PUBLIC_APP_URL=https://yourdomain.com
   ```

2. Set up production webhook in Stripe Dashboard:
   - URL: `https://yourdomain.com/api/webhooks/stripe`
   - Events: Same as above
   - Get the production webhook secret → `STRIPE_WEBHOOK_SECRET`

---

## Troubleshooting

### "Webhook signature verification failed"
- Make sure `STRIPE_WEBHOOK_SECRET` is set correctly
- Restart your dev server after adding the env var
- Check that Stripe CLI is forwarding to the correct port

### Payment succeeds but booking doesn't update
- Check webhook logs in Stripe Dashboard
- Check your server logs for errors
- Verify booking IDs are in the session metadata

### "No Stripe publishable key found"
- Make sure the env var starts with `NEXT_PUBLIC_`
- Restart your dev server

### Payment button doesn't work
- Check browser console for errors
- Verify `createCheckoutSession` mutation exists in `bookings.ts`
- Check that bookings are actually in `APPROVED` status

---

## What Happens in the Payment Flow

1. **User clicks "Pay Now"** on campaign details page
2. **Frontend** calls `createCheckoutSession` mutation
3. **Backend** creates Stripe checkout session with:
   - Line items for each approved booking
   - Total amount (booking cost + platform fee)
   - Metadata (booking IDs, user ID, campaign ID)
4. **User redirects** to Stripe Checkout
5. **User completes payment** with credit card
6. **Stripe sends webhook** to `/api/webhooks/stripe`
7. **Webhook handler** updates bookings:
   - Status: `APPROVED` → `CONFIRMED`
   - Sets `paidAt` timestamp
   - Stores `stripePaymentIntentId`
8. **Notifications created** for both parties
9. **User redirects back** to campaign page with success message

---

## Next Steps After Payment Works

Once payment is working, you still need:

1. **Proof Upload System** (space owner uploads photos after campaign starts)
2. **Payouts to Space Owners** (Stripe Connect integration)
3. **Campaign Lifecycle Automation** (background jobs)
4. **Notifications UI** (display in-app notifications)
5. **Email Notifications** (send emails for important events)

---

## Security Notes

- ✅ Never expose `STRIPE_SECRET_KEY` in client-side code
- ✅ Always verify webhook signatures
- ✅ Store sensitive data in environment variables
- ✅ Use HTTPS in production
- ✅ Validate all payment amounts on the server

---

You're now ready to test payments! Start with Step 1 and work your way through.