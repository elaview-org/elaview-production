# Digital Signage — Local E2E Testing Guide

## Overview

This guide walks you through testing the full digital signage flow locally:

```
Register Screen → Generate Pairing Code → Pair Player Device →
Create Campaign → Book Space → Owner Approves → Pay →
Auto-Schedule Created → Pushed to Signaling → Player Displays Ad
```

You will need **4 terminal tabs** and a **browser**.

---

## Prerequisites

- Docker Desktop running
- `devbox shell` active (provides bun, dotnet, etc.)
  ```bash
  cd /path/to/elaview-production
  devbox shell
  ```
  This loads all env vars from Doppler automatically (prefixed with `ELAVIEW_`).

---

## Step 1: Start the Database

```bash
# Terminal 1 — Backend
cd backend
docker compose up -d database
```

Wait a few seconds for Postgres to be ready, then apply migrations:

```bash
dotnet ef database update
```

---

## Step 2: Start the Backend

```bash
# Still Terminal 1
dotnet run --project ElaviewBackend.csproj
```

You should see:
```
http://localhost:7106
http://localhost:7106/api/graphql
Schema downloaded and is stored at Data/schema.graphql
```

**Verify:** Open `http://localhost:7106/api/graphql` in a browser — you should see Banana Cake Pop (the GraphQL IDE).

---

## Step 3: Start the Signaling Service

```bash
# Terminal 2
cd services/signaling
bun run dev
```

You should see:
```
[INFO] Signaling service started {"port":8001,"backendUrl":"http://localhost:7106"}
[INFO] WebSocket endpoint: ws://localhost:8001/ws
[INFO] Health check: http://localhost:8001/health
```

**Verify:**
```bash
curl http://localhost:8001/health
# → {"status":"ok","uptime":...}
```

---

## Step 4: Start the Player App

```bash
# Terminal 3
cd apps/player
bun run dev
```

You should see:
```
VITE ready in ~500ms
➜ Local: http://localhost:5173/
```

**Don't open the player yet** — we need to set up data first.

---

## Step 5: Log In as Space Owner (user1)

Open `http://localhost:7106/api/graphql` in your browser (Banana Cake Pop).

The seeded accounts use password format: `{prefix}{ELAVIEW_BACKEND_ADMIN_PASSWORD}`.

| Account | Email | Password |
|---------|-------|----------|
| User 1 (Space Owner) | `user1@elaview.com` | `user1` + your admin password |
| User 2 (Advertiser) | `user2@elaview.com` | `user2` + your admin password |
| Admin | `admin@elaview.com` | `admin` + your admin password |

Log in as **user1** (will be our space owner):

```bash
# Terminal 4 — cURL commands (keep this tab for API calls)
# Adjust the password!
curl -X POST http://localhost:7106/api/auth/login \
  -H "Content-Type: application/json" \
  -c cookies-owner.txt \
  -d '{"email": "user1@elaview.com", "password": "user1YOUR_ADMIN_PASSWORD"}'
```

Save the cookie jar — you'll use `-b cookies-owner.txt` for authenticated requests.

---

## Step 6: Switch to Space Owner Profile

```bash
curl -X POST http://localhost:7106/api/graphql \
  -H "Content-Type: application/json" \
  -b cookies-owner.txt \
  -d '{
    "query": "mutation { switchProfileType(input: { profileType: SPACE_OWNER }) { user { id activeProfileType } } }"
  }'
```

---

## Step 7: Create a DigitalDisplay Space

```bash
curl -X POST http://localhost:7106/api/graphql \
  -H "Content-Type: application/json" \
  -b cookies-owner.txt \
  -d '{
    "query": "mutation CreateSpace($input: CreateSpaceInput!) { createSpace(input: { input: $input }) { space { id title type } } }",
    "variables": {
      "input": {
        "title": "Downtown Digital Billboard",
        "description": "High-traffic digital display in downtown area",
        "type": "DIGITAL_DISPLAY",
        "address": "123 Main St",
        "city": "San Francisco",
        "state": "CA",
        "latitude": 37.7749,
        "longitude": -122.4194,
        "pricePerDay": 50.00,
        "minDuration": 7
      }
    }
  }' | jq .
```

**Save the returned `space.id`** — you'll need it next.

---

## Step 8: Register a Digital Signage Screen

```bash
SPACE_ID="<paste-space-id-here>"

curl -X POST http://localhost:7106/api/graphql \
  -H "Content-Type: application/json" \
  -b cookies-owner.txt \
  -d "{
    \"query\": \"mutation { registerDigitalSignageScreen(input: { input: { spaceId: \\\"$SPACE_ID\\\", name: \\\"Lobby Screen\\\", resolution: \\\"1920x1080\\\" }}) { digitalSignageScreen { id name status } } }\"
  }" | jq .
```

**Save the returned `digitalSignageScreen.id`** — you'll need it next.

---

## Step 9: Generate a Pairing Code

```bash
SCREEN_ID="<paste-screen-id-here>"

curl -X POST http://localhost:7106/api/graphql \
  -H "Content-Type: application/json" \
  -b cookies-owner.txt \
  -d "{
    \"query\": \"mutation { generateDevicePairingCode(input: { input: { screenId: \\\"$SCREEN_ID\\\" }}) { pairingCode expiresAt } }\"
  }" | jq .
```

You'll get something like:
```json
{
  "data": {
    "generateDevicePairingCode": {
      "pairingCode": "847291",
      "expiresAt": "2026-03-22T12:10:00Z"
    }
  }
}
```

**The code expires in 10 minutes.** Move quickly to the next step.

---

## Step 10: Pair the Player

1. Open `http://localhost:5173` in a browser
2. You'll see the **Pair Screen** with a code input
3. Enter the 6-digit pairing code from Step 9
4. Optionally change the device name
5. Click **"Pair Device"**

**Expected result:**
- Player navigates to `/display`
- Shows idle screen: big "ELAVIEW" text + "Waiting for ad schedules..."
- Green status dot in bottom-right corner (connected to signaling)

**Check signaling logs (Terminal 2):**
```
[INFO] Device authenticated {...}
[INFO] Device registered {...}
```

---

## Step 11: Quick Test — Push a Fake Schedule

Before going through the full booking flow, verify push works:

```bash
# Use the screen ID from Step 8
curl -X POST http://localhost:8001/api/push-schedule \
  -H "Authorization: Bearer dev-secret" \
  -H "Content-Type: application/json" \
  -d "{
    \"screenId\": \"$SCREEN_ID\",
    \"schedules\": [{
      \"id\": \"test-schedule-1\",
      \"screenId\": \"$SCREEN_ID\",
      \"bookingId\": null,
      \"campaignId\": null,
      \"creativeAssetUrl\": \"https://picsum.photos/1920/1080\",
      \"creativeType\": \"Image\",
      \"rotationIntervalSeconds\": 15,
      \"startDate\": \"2025-01-01T00:00:00Z\",
      \"endDate\": \"2027-12-31T00:00:00Z\",
      \"status\": \"Active\"
    }]
  }"
```

**Expected result:**
- Signaling logs: `Pushed schedule update to devices {"screenId":"...","devicesPushed":1}`
- Player immediately shows the random image fullscreen
- Green dot visible in bottom-right

**Push a second schedule to test rotation:**
```bash
curl -X POST http://localhost:8001/api/push-schedule \
  -H "Authorization: Bearer dev-secret" \
  -H "Content-Type: application/json" \
  -d "{
    \"screenId\": \"$SCREEN_ID\",
    \"schedules\": [
      {
        \"id\": \"test-1\",
        \"screenId\": \"$SCREEN_ID\",
        \"bookingId\": null,
        \"campaignId\": null,
        \"creativeAssetUrl\": \"https://picsum.photos/seed/ad1/1920/1080\",
        \"creativeType\": \"Image\",
        \"rotationIntervalSeconds\": 10,
        \"startDate\": \"2025-01-01T00:00:00Z\",
        \"endDate\": \"2027-12-31T00:00:00Z\",
        \"status\": \"Active\"
      },
      {
        \"id\": \"test-2\",
        \"screenId\": \"$SCREEN_ID\",
        \"bookingId\": null,
        \"campaignId\": null,
        \"creativeAssetUrl\": \"https://picsum.photos/seed/ad2/1920/1080\",
        \"creativeType\": \"Image\",
        \"rotationIntervalSeconds\": 10,
        \"startDate\": \"2025-01-01T00:00:00Z\",
        \"endDate\": \"2027-12-31T00:00:00Z\",
        \"status\": \"Active\"
      }
    ]
  }"
```

Player should rotate between the two images every 10 seconds.

---

## Step 12 (Optional): Full Booking Flow

This tests the real end-to-end path through Stripe. Requires Stripe test keys configured in Doppler.

### 12a. Log in as Advertiser (user2)

```bash
curl -X POST http://localhost:7106/api/auth/login \
  -H "Content-Type: application/json" \
  -c cookies-advertiser.txt \
  -d '{"email": "user2@elaview.com", "password": "user2YOUR_ADMIN_PASSWORD"}'
```

### 12b. Create a Campaign

```bash
curl -X POST http://localhost:7106/api/graphql \
  -H "Content-Type: application/json" \
  -b cookies-advertiser.txt \
  -d '{
    "query": "mutation CreateCampaign($input: CreateCampaignInput!) { createCampaign(input: { input: $input }) { campaign { id name } } }",
    "variables": {
      "input": {
        "name": "Summer Sale 2026",
        "description": "Big summer promotion",
        "imageUrl": "https://picsum.photos/seed/summer-sale/1920/1080",
        "targetAudience": "Local shoppers",
        "goals": "Brand awareness"
      }
    }
  }' | jq .
```

Save the `campaign.id`.

### 12c. Create a Booking

```bash
CAMPAIGN_ID="<paste-campaign-id>"

curl -X POST http://localhost:7106/api/graphql \
  -H "Content-Type: application/json" \
  -b cookies-advertiser.txt \
  -d "{
    \"query\": \"mutation { createBooking(campaignId: \\\"$CAMPAIGN_ID\\\", input: { spaceId: \\\"$SPACE_ID\\\", startDate: \\\"2026-04-01\\\", endDate: \\\"2026-04-30\\\" }) { booking { id status total } } }\"
  }" | jq .
```

Save the `booking.id`. Status should be `PENDING_APPROVAL`.

### 12d. Owner Approves the Booking

```bash
BOOKING_ID="<paste-booking-id>"

curl -X POST http://localhost:7106/api/graphql \
  -H "Content-Type: application/json" \
  -b cookies-owner.txt \
  -d "{
    \"query\": \"mutation { approveBooking(id: \\\"$BOOKING_ID\\\") { booking { id status } } }\"
  }" | jq .
```

Status should change to `ACCEPTED`.

### 12e. Create Payment Intent (as Advertiser)

```bash
curl -X POST http://localhost:7106/api/graphql \
  -H "Content-Type: application/json" \
  -b cookies-advertiser.txt \
  -d "{
    \"query\": \"mutation { createPaymentIntent(bookingId: \\\"$BOOKING_ID\\\") { clientSecret paymentIntentId amount } }\"
  }" | jq .
```

Save the `paymentIntentId`.

### 12f. Confirm Payment

> Note: In production, Stripe.js confirms the payment on the client side, then the backend
> confirms it. For local testing, you can confirm the payment intent directly via Stripe CLI
> or the confirmPayment mutation if the intent is already succeeded.

```bash
PAYMENT_INTENT_ID="<paste-payment-intent-id>"

curl -X POST http://localhost:7106/api/graphql \
  -H "Content-Type: application/json" \
  -b cookies-advertiser.txt \
  -d "{
    \"query\": \"mutation { confirmPayment(paymentIntentId: \\\"$PAYMENT_INTENT_ID\\\") { payment { id status } } }\"
  }" | jq .
```

### 12g. What to Watch For

| Service | Expected Log |
|---------|-------------|
| **Backend (Terminal 1)** | Schedule created for booking, then HTTP POST to signaling |
| **Signaling (Terminal 2)** | `Pushed schedule update to devices {"screenId":"...","devicesPushed":1}` |
| **Player (Browser)** | Transitions from idle to displaying the campaign image fullscreen |

If the payment doesn't work through Stripe (common in local dev without webhook forwarding), use the Quick Test from Step 11 to verify the signaling→player path works.

---

## Troubleshooting

### Player shows "Disconnected"
- Check signaling service is running on port 8001
- Check browser console for WebSocket connection errors
- The signaling service defaults to `ws://localhost:8001/ws`

### Pairing fails with "Invalid or expired pairing code"
- The code expires after 10 minutes — generate a new one
- Make sure you're entering exactly 6 digits

### Push returns `{"pushed":false,"reason":"no_devices_connected"}`
- The player isn't connected to the signaling service
- Check that the player is on `/display` (not `/pair`)
- The screenId in the push must match the screen the device was paired to

### Signaling auth errors
- The signaling service validates device tokens by querying the backend's `digitalSignageDeviceByToken` GraphQL query
- If the backend is down, the signaling service falls back to dev auth (accepts any token)
- Check that the device status is `ONLINE` — it's set to `ONLINE` when pairing completes

### Player shows idle but schedules were pushed
- The player filters schedules by date range and status
- Make sure `startDate` is in the past and `endDate` is in the future
- Make sure `status` is `"Active"` or `"Pending"`

### Hold Escape for 3 seconds
- On the player display screen, hold the Escape key for 3 seconds to unpair and return to the pairing screen

---

## Ports Summary

| Service | Port | URL |
|---------|------|-----|
| PostgreSQL | `$ELAVIEW_BACKEND_DATABASE_PORT` | — |
| Backend | `$ELAVIEW_BACKEND_SERVER_PORT` (usually 7106) | `http://localhost:7106/api/graphql` |
| Signaling | 8001 | `http://localhost:8001/health` |
| Player | 5173 | `http://localhost:5173` |

---

## Quick Reset

To start fresh:
```bash
# Stop everything
# Terminal 1: Ctrl+C (backend)
# Terminal 2: Ctrl+C (signaling)
# Terminal 3: Ctrl+C (player)

# Nuke the database
cd backend
docker compose down -v   # -v removes volumes (deletes all data)
docker compose up -d database
dotnet ef database update
# Restart backend — it will re-seed accounts
dotnet run --project ElaviewBackend.csproj
```

Player localStorage can be cleared by opening browser DevTools → Application → Local Storage → Clear, or hold Escape for 3 seconds on the display screen.
