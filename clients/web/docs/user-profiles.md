# User Profiles Implementation Guide

Comprehensive reference for implementing Space Owner and Advertiser dashboards in the Elaview web client.

## Overview

Elaview uses a dual-profile system where users can have both Space Owner and Advertiser profiles. The dashboard renders
different parallel routes based on `activeProfileType`:

- `@spaceOwner` - When `activeProfileType: SPACE_OWNER`
- `@advertiser` - When `activeProfileType: ADVERTISER`

Users switch profiles via the sidebar profile switcher, which calls `switchProfile()` server action.

## Architecture

### Route Structure

```
src/app/(dashboard)/
├── @spaceOwner/
│   ├── overview/           # Dashboard landing
│   ├── listings/           # Space management
│   │   └── [id]/           # Space detail
│   ├── bookings/           # Booking management
│   │   └── [id]/           # Booking detail
│   ├── earnings/           # Financial dashboard
│   │   └── payouts/        # Payout history
│   ├── analytics/          # Performance insights
│   └── calendar/           # Availability calendar
│
├── @advertiser/
│   ├── overview/           # Dashboard landing
│   ├── discover/           # Space discovery
│   │   ├── @grid/          # Grid view
│   │   └── @map/           # Map view
│   ├── campaigns/          # Campaign management
│   │   └── [id]/           # Campaign detail
│   ├── bookings/           # Booking management
│   │   └── [id]/           # Booking detail
│   ├── spending/           # Financial dashboard
│   └── analytics/          # Campaign insights
│
├── messages/           # Conversations
│   └── [id]/           # Thread detail
├── notifications/      # Notifications
├── profile/            # Public profile
└── settings/           # Account settings
```

### Navigation Configuration

Each profile has its own `navigation-bar.data.ts`:

**Space Owner:**
| Section | Items |
|---------|-------|
| Quick Action | New Space |
| Main Nav | Overview, Listings, Bookings, Earnings, Analytics, Calendar, Messages |
| Documents | Installation Guide, Verification Guide, Payout FAQ, Tax Documents |

**Advertiser:**
| Section | Items |
|---------|-------|
| Quick Action | New Campaign |
| Main Nav | Overview, Discover, Campaigns, Bookings, Spending, Analytics, Messages |
| Documents | Creative Guidelines, Booking FAQ, Billing FAQ |

---

## Implementation Status

### Space Owner Routes

| Route     | Status       | Data Source | Notes                                 |
|-----------|--------------|-------------|---------------------------------------|
| Overview  | ✅ Functional | GraphQL     | Fully integrated                      |
| Listings  | ✅ Functional | GraphQL     | Fully integrated with mutations       |
| Bookings  | ✅ Functional | GraphQL     | Filtering, actions, detail page wired |
| Earnings  | ✅ Functional | GraphQL     | Fully integrated                      |
| Analytics | ✅ Functional | GraphQL     | Fully integrated                      |
| Calendar  | ⚠️ Partial   | Mock JSON   | Views implemented, needs GraphQL      |
| Profile   | ✅ Functional | GraphQL     | Real reviews from API                 |
| Settings  | ✅ Functional | GraphQL     | Stripe Connect, notifications working |

### Advertiser Routes

| Route     | Status       | Data Source | Notes                              |
|-----------|--------------|-------------|------------------------------------|
| Overview  | ✅ Functional | GraphQL     | Parallel routes, all sections live |
| Discover  | ✅ Functional | GraphQL     | Grid/Table/Map views working       |
| Campaigns | ⚠️ Partial   | GraphQL     | Query works, mutations not wired   |
| Bookings  | ⚠️ Partial   | GraphQL     | Query works, mutations needed      |
| Spending  | ❌ Mock Only  | Mock        | No GraphQL integration             |
| Analytics | ✅ Functional | GraphQL     | Parallel routes, reach chart mocked|
| Profile   | ✅ Functional | GraphQL     | Real campaign data                 |
| Settings  | ✅ Functional | GraphQL     | Notifications, delete working      |

---

## Shared Routes

These routes exist in both `@spaceOwner` and `@advertiser` with similar implementations.

### 1. Messages

**Purpose:** Communication between space owners and advertisers about bookings.

#### Implementation Checklist

**Conversation List:**

- [x] List of all conversations (`myConversations` query)
- [x] Unread indicators (comparing `lastReadAt` vs message timestamp)
- [x] Last message preview (fetching `messages(first: 1)`)
- [x] Booking context link (booking ID badge)
- [x] Participant avatar and name
- [x] Loading skeleton
- [x] Empty state placeholder
- [x] Search conversations
- [x] Sort by recent/unread

**Conversation Detail (`/messages/[id]`):**

- [x] Message thread display (`messagesByConversation` query)
- [x] Send message input (`sendMessage` mutation)
- [x] Image attachments (PDF, PNG, JPG supported)
- [x] Real-time updates (`onMessage` subscription)
- [x] Mark conversation as read (`markConversationRead` mutation)
- [x] Date grouping for messages
- [x] Auto-scroll to latest message
- [x] Disabled messaging for completed/cancelled bookings
- [x] Loading skeleton
- [x] Error boundary
- [x] Booking reference card in thread header
- [x] Read receipts (conversation-level)
- [x] Pagination (load more messages)
- [x] Typing indicators

#### Backend Note

**Queries (exist in schema):**

- `myConversations` - List conversations with pagination, filtering, sorting
- `messagesByConversation(conversationId)` - Messages in a thread
- `unreadConversationsCount` - Badge count

**Mutations (exist in schema):**

- `sendMessage(input: {conversationId, content, attachments, type})` - Send message
- `markConversationRead(input: {conversationId})` - Mark as read
- `createBookingConversation(input: {bookingId})` - Start conversation

**Subscriptions (exist in schema):**

- `onMessage(conversationId)` - Real-time message updates

**Frontend Status:** ✅ Fully functional (typing indicators blocked on backend)

---

### 2. Notifications

**Purpose:** User notification management.

#### Implementation Checklist

**Notification List:**

- [x] Paginated notifications list (first 50)
- [x] Filter by read/unread (tab filter)
- [x] Filter by notification type (dropdown)
- [x] Mark as read (individual)
- [x] Mark all as read
- [x] Delete notification
- [x] Optimistic updates for all mutations
- [x] Date grouping (Today, Yesterday, This Week, Older)
- [x] Notification type icons
- [x] Deep links to bookings/messages
- [x] Loading skeleton
- [x] Empty state placeholder
- [x] Error boundary
- [x] Real-time updates (`onNotification` subscription)
- [x] Pagination (load more)

**Notification Preferences:**

- [x] Notification type toggles
- [x] In-app, Email, Push columns
- [x] Individual toggle saves
- [x] Optimistic UI updates

#### Backend Note

**Queries (exist in schema):**

- `myNotifications` - Paginated notifications with filtering by `isRead`, `type`
- `myNotificationPreferences` - User's notification settings
- `unreadNotificationsCount` - Badge count

**Mutations (exist in schema):**

- `markNotificationRead(input: {id})` - Mark single as read
- `markAllNotificationsRead` - Mark all as read
- `deleteNotification(input: {id})` - Delete notification
- `updateNotificationPreference(input: {notificationType, inAppEnabled, emailEnabled, pushEnabled})`

**Subscriptions (exist in schema):**

- `onNotification(userId)` - Real-time notifications

**Frontend Status:** ✅ Fully functional

---

### 3. Profile

**Purpose:** Public-facing profile page.

#### Implementation Checklist

**Space Owner Profile:**

- [x] Profile card (avatar, name, stats)
- [x] About section (business info)
- [x] Reviews section with pagination
- [x] Real GraphQL query (`me`)
- [x] Fragment colocation pattern
- [x] Loading skeleton
- [x] Response rate metric
- [x] Response time metric

**Advertiser Profile:**

- [x] Profile card (avatar, name, company)
- [x] About section (company info)
- [x] Campaigns section with pagination
- [x] Real GraphQL query (`me`)
- [x] Loading skeleton

#### Backend Note

**Queries (exist in schema):**

- `me` - Current user with `spaceOwnerProfile` or `advertiserProfile`
- `spaceOwnerProfile.reviews` - Reviews for space owner
- `advertiserProfile.campaigns` - Campaigns for advertiser

**Frontend Status:** ✅ Fully functional

---

### 4. Settings

**Purpose:** Account and business settings management.

#### Implementation Checklist

**Profile Tab:**

- [x] Name field
- [x] Email field (read-only)
- [x] Phone field
- [x] Avatar upload (Cloudinary signed upload)
- [x] Save changes button
- [x] `updateCurrentUser` mutation

**Business/Company Tab:**

- [x] Business name / Company name field
- [x] Business type / Industry selector
- [x] Payout schedule selector (Space Owner only)
- [x] Website field (Advertiser only)
- [x] Save changes button
- [x] `updateSpaceOwnerProfile` / `updateAdvertiserProfile` mutation

**Payout Tab (Space Owner):**

- [x] Stripe Connect status display
- [x] Bank account info (masked)
- [x] Connect Stripe button
- [x] View Stripe Dashboard link
- [x] Refresh Status button
- [x] Disconnect Stripe

**Payment Tab (Advertiser):**

- [x] Saved payment methods
- [x] Add card (Stripe Elements)
- [x] Set default card
- [x] Remove card

**Notifications Tab:**

- [x] Notification type toggles
- [x] In-app, Email, Push columns
- [x] `updateNotificationPreference` mutation
- [x] Optimistic UI updates

**Account Tab:**

- [x] Account info display
- [x] Delete account with confirmation
- [x] `deleteMyAccount` mutation
- [x] Change password
- [x] Avatar upload

#### Backend Note

**Queries (exist in schema):**

- `me` - User profile data
- `myNotificationPreferences` - Notification settings

**Mutations (exist in schema):**

- `updateCurrentUser(input: {name, phone, avatar, activeProfileType})`
- `updateSpaceOwnerProfile(input: {businessName, businessType, payoutSchedule})`
- `updateAdvertiserProfile(input: {companyName, industry, website})`
- `changePassword(input: {currentPassword, newPassword})`
- `deleteMyAccount(input: {password})`
- `connectStripeAccount` - Returns `onboardingUrl`
- `disconnectStripeAccount`
- `refreshStripeAccountStatus`

**Frontend Status:** ✅ Fully functional

---

## Space Owner Routes

### 1. Overview (`/overview`)

**Purpose:** At-a-glance dashboard showing key metrics and pending actions.

#### Implementation Checklist

**Core Components:**

- [x] Stats cards (Available Balance, Pending Payouts, This Month, Active Bookings)
- [x] Pending requests section with action cards
- [x] Active bookings section with progress timeline
- [x] Top spaces section with performance metrics
- [x] Activity chart with time range selector
- [x] Recent activity table

**GraphQL Migration:**

- [x] `earningsSummary` query for stats
- [x] `incomingBookingRequests` for pending requests
- [x] `myBookingsAsOwner` (status filter) for active bookings
- [x] `mySpaces` (sorted by revenue) for top spaces
- [x] `myBookingsAsOwner.totalCount` for active bookings count
- [x] `mySpaces.totalCount` for total spaces count
- [x] `myPayouts` aggregated by date for activity chart
- [x] `myNotifications` for recent activity feed

**Additional Features:**

- [x] Stripe Connect status indicator (badge on Available Balance card)
- [x] Installation deadline warnings (dedicated slot with urgency badges)
- [x] Upcoming payouts preview (dedicated slot showing pending/processing payouts)
- [x] Performance comparison vs previous period (trend badge on This Month card)

#### Backend Note

**Queries (exist in schema):**

- `earningsSummary` → `availableBalance`, `pendingPayouts`, `thisMonthEarnings`, `lastMonthEarnings`
- `incomingBookingRequests(first: 5)` - Pending approval bookings
- `myBookingsAsOwner(where: {status: {in: [PAID, FILE_DOWNLOADED, INSTALLED]}})` - Active bookings
- `mySpaces(first: 5, order: {totalRevenue: DESC})` - Top spaces

**Implementation Notes:**

- Activity chart: Client-side aggregation from `myPayouts` (grouped by processedAt date)
- Recent activity: Uses `myNotifications` directly as activity feed

**Frontend Status:** ✅ Fully functional (parallel routes, all sections live)

---

### 2. Listings (`/listings`)

**Purpose:** Manage all advertising spaces owned by the user.

#### Implementation Checklist

**Main Page:**

- [x] Space cards grid with responsive layout
- [x] Real GraphQL query (`mySpaces`)
- [x] Fragment masking (`SpaceCard_SpaceFragment`)
- [x] Create space modal wizard
- [x] Empty state placeholder
- [x] Loading skeleton
- [x] Status filter tabs (Active, Inactive, Pending, Rejected)
- [x] Sort options (Revenue, Rating, Bookings, Created)
- [x] Pagination
- [x] Search by title (debounced URL sync)
- [x] Bulk actions - Deactivate/Delete selected (table view only)

**Create Space Modal:**

- [x] Step 1: Photos upload UI
- [x] Step 2: Details form (type, title, description)
- [x] Step 3: Location fields + map preview
- [x] Step 4: Pricing and duration settings
- [x] Step 5: Preview before publish
- [x] Photo upload to Cloudinary (signed URLs)
- [x] `createSpace` mutation integration
- [x] Per-step Zod validation with error messages
- [x] Draft saving to localStorage (auto-save, discard button)

**Detail Page (`/listings/[id]`):**

- [x] Header with title and status badge
- [x] Photo gallery UI
- [x] Details form UI
- [x] Performance stats section
- [x] Real GraphQL query (`spaceById`)
- [x] Photo upload to Cloudinary
- [x] Photo delete with `updateSpaceImages` mutation
- [x] `updateSpace` mutation with toast notifications
- [x] Availability calendar with block/unblock dates
- [x] Booking history for this space
- [x] Reviews for this space
- [x] Deactivate/Reactivate toggle in dropdown
- [x] Delete with confirmation dialog (requires title match)

#### Backend Note

**Queries (exist in schema):**

- `mySpaces` - Paginated with filtering (`status`), sorting (`totalRevenue`, `createdAt`, etc.)
- `spaceById(id)` - Single space details

**Mutations (exist in schema):**

- `createSpace(input: {...})` - All fields supported
-

`updateSpace(id, input: {title, description, pricePerDay, installationFee, minDuration, maxDuration, images, traffic, availableFrom, availableTo})`

- `deactivateSpace(input: {id})`
- `reactivateSpace(input: {id})`
- `deleteSpace(input: {id})`

**Note:** All mutations wired. Image upload handled via Cloudinary signed URLs.

**Frontend Status:** ✅ Fully functional (queries + mutations wired)

---

### 3. Bookings (`/bookings`)

**Purpose:** Manage all bookings for owned spaces.

#### Implementation Checklist

**Main Page:**

- [x] Bookings table with TanStack Table
- [x] Real GraphQL query (`myBookingsAsOwner`)
- [x] Fragment masking
- [x] Status badges with colors
- [x] Action dropdowns (wired to mutations)
- [x] Empty state placeholder
- [x] Loading skeleton
- [x] Tab filters (Incoming, Active, Completed, All)
- [x] Search by advertiser or space name (`searchText` param)
- [x] Sorting (startDate, endDate, createdAt, ownerPayoutAmount)
- [x] Pagination
- [x] Bulk actions (Accept, Reject selected with reason dialog)
- [x] Date range filter
- [x] Export to CSV

**Filter Tabs:**

| Tab       | Status Filter                                                  |
|-----------|----------------------------------------------------------------|
| Incoming  | `PENDING_APPROVAL`                                             |
| Active    | `APPROVED`, `PAID`, `FILE_DOWNLOADED`, `INSTALLED`, `VERIFIED` |
| Completed | `COMPLETED`                                                    |
| All       | No filter                                                      |

**Detail Page (`/bookings/[id]`):**

- [x] Header with status and dates
- [x] Status timeline visualization (7-step progress or terminal state)
- [x] Campaign info (advertiser, creative preview)
- [x] Space info card
- [x] Financial summary (price breakdown, payouts by stage)
- [x] Context-appropriate action buttons (sticky bottom bar)
- [x] Verification photos display
- [x] Message thread link (creates conversation on demand)
- [x] Dispute handling UI
- [x] Verification photos upload

**Status-Based Actions:**

| Status           | Primary Action      | Secondary Actions          |
|------------------|---------------------|----------------------------|
| PENDING_APPROVAL | Accept              | Reject, Message Advertiser |
| APPROVED         | —                   | Cancel, Message            |
| PAID             | Download File       | Message                    |
| FILE_DOWNLOADED  | Mark Installed      | Message                    |
| INSTALLED        | Upload Verification | Message                    |
| VERIFIED         | —                   | Message                    |
| DISPUTED         | Respond             | Message                    |

#### Backend Note

**Queries (exist in schema):**

- `myBookingsAsOwner` - Paginated with filtering (`status`), sorting
- `bookingById(id)` - Single booking with `proof`, `dispute`, `payments`, `payouts`
- `incomingBookingRequests` - Pending approval only
- `bookingsRequiringAction` - Bookings needing owner action

**Mutations (exist in schema):**

- `approveBooking(input: {id, ownerNotes?})`
- `rejectBooking(input: {id, reason})`
- `cancelBooking(input: {id, reason})`
- `markFileDownloaded(input: {id})` - Owner downloaded creative
- `markInstalled(input: {id})` - Owner completed installation
- `submitProof(input: {bookingId, photoUrls})` - Upload verification photos
- `createBookingConversation(input: {bookingId})` - Start/get conversation with advertiser

**Subscriptions (exist in schema):**

- `onBookingUpdate(bookingId)` - Real-time status changes
- `onProofUpdate(bookingId)` - Verification status changes

**Note:** All mutations wired. Status filtering enabled with URL param sync.

**Frontend Status:** ✅ Fully functional (queries + mutations wired, detail page complete)

---

### 4. Earnings (`/earnings`)

**Purpose:** Financial dashboard showing earnings and payout management.

#### Implementation Checklist

**Main Page:**

- [x] Balance cards (Available, Pending, This Month, Total)
- [x] Real GraphQL query (`earningsSummary`, `myPayouts`, `me.spaceOwnerProfile.stripeAccountStatus`)
- [x] Fragment masking
- [x] Earnings chart with daily aggregation
- [x] Payouts table with stage badges
- [x] Loading skeleton
- [x] Stripe Connect status indicator (badge on Available Balance card)
- [x] "Withdraw" button integration (`requestManualPayout` mutation)
- [x] Date range filter for chart
- [x] Export payouts to CSV

**Payout History (`/earnings/payouts`):**

- [x] Full payout history with pagination
- [x] Filter by stage (Stage 1, Stage 2)
- [x] Filter by status (Pending, Processing, Completed, Failed)
- [x] Filter by date range
- [x] Retry failed payout button (`retryPayout` mutation)
- [x] Export to CSV/PDF (dropdown with both options)

**Payout Types:**

| Stage  | Description                       | Trigger               |
|--------|-----------------------------------|-----------------------|
| STAGE1 | Print + installation fee ($10-35) | File downloaded       |
| STAGE2 | Rental fee (remainder)            | Verification approved |

**Payout Statuses:**

| Status         | Description         | Actions |
|----------------|---------------------|---------|
| PENDING        | Awaiting processing | —       |
| PROCESSING     | Transfer initiated  | —       |
| COMPLETED      | Successfully paid   | —       |
| FAILED         | Transfer failed     | Retry   |
| PARTIALLY_PAID | Partial amount sent | —       |

#### Backend Note

**Queries (exist in schema):**

- `earningsSummary` → `availableBalance`, `pendingPayouts`, `thisMonthEarnings`, `lastMonthEarnings`, `totalEarnings`
- `myPayouts` - Paginated with filtering (`stage`, `status`), sorting

**Mutations (exist in schema):**

- `retryPayout(input: {payoutId})` - Retry failed payout

**Note:** Chart data derived client-side by aggregating `myPayouts` by date. Consider adding
`earningsByDateRange(start, end, granularity: DAY|WEEK|MONTH)` for better performance.

**Frontend Status:** ✅ Fully functional

---

### 5. Analytics (`/analytics`)

**Purpose:** Performance insights for spaces and bookings.

#### Implementation Checklist

**Summary Cards:**

- [x] Total bookings with trend
- [x] Total revenue with trend
- [x] Average rating with trend
- [x] Completion rate
- [x] Average booking duration
- [x] Occupancy rate
- [x] Repeat advertisers rate
- [x] Revenue forecast
- [x] Real GraphQL query integration

**Charts:**

- [x] Bookings over time (area chart with time range)
- [x] Status distribution (pie chart)
- [x] Revenue by space (bar chart)
- [x] Monthly revenue (bar chart with range selector)
- [x] Rating trends (composed chart with review volume)
- [x] Booking heatmap (day × hour activity)
- [x] Period comparison card
- [x] Real GraphQL query integration

**Tables:**

- [x] Space performance table with occupancy
- [x] Top performers section
- [x] Real GraphQL query integration

#### Backend Note

**Queries (exist in schema):**

- `spaceOwnerAnalytics(startDate, endDate)` - Aggregated analytics data
  - `summary` - All 8 metrics with previous period values
  - `statusDistribution` - Counts by booking status
  - `spacePerformance(first)` - Top spaces by revenue
  - `monthlyStats(months)` - Monthly revenue trends
  - `ratingTrends(months)` - Rating trends with review volume
  - `bookingHeatmap` - 7×24 matrix for activity heatmap
  - `periodComparison` - This period vs previous period
  - `topPerformers` - Top space, best rated, most booked
- `spaceOwnerDailyStats(startDate, endDate)` - Daily stats for bookings trend chart

**Frontend Status:** ✅ Fully functional

---

### 6. Calendar (`/calendar`)

**Purpose:** Visual availability and booking management.

#### Implementation Checklist

**Core Features:**

- [x] Month view calendar
- [x] Week view calendar
- [x] Day view calendar
- [x] Multi-space color coding
- [x] Booking events display
- [x] Blocked dates display
- [x] Installation deadlines markers
- [x] Click to view booking details

**Interactivity:**

- [ ] Drag to block dates
- [x] Click to block/unblock dates (implemented in /listings/[id] calendar)
- [x] Filter by space
- [ ] Filter by booking status
- [ ] Bulk block date ranges

**Additional Features:**

- [ ] Sync with Google Calendar
- [ ] iCal export
- [ ] Recurring availability patterns
- [ ] Holiday markers
- [ ] Pricing calendar (dynamic pricing)

#### Backend Note

**Queries:**

- `mySpaces` with nested `bookings(where: {startDate: {lte: $end}, endDate: {gte: $start}})` - Works but expensive
- `blockedDatesBySpace(spaceId, first)` - Blocked dates for a space ✅

**Mutations:**

- `blockDates(input: {spaceId, dates, reason})` - Block dates ✅
- `unblockDates(input: {spaceId, dates})` - Unblock dates ✅

**Note:** Space-specific calendar with block/unblock is implemented in `/listings/[id]`. Global calendar route still
uses mock data.

**Frontend Status:** ⚠️ Global calendar uses mock. Space-specific calendar in /listings/[id] is functional.

---

## Advertiser Routes

### 1. Overview (`/overview`)

**Purpose:** At-a-glance dashboard showing active campaigns, pending actions, and spending summary.

#### Implementation Checklist

**Core Components:**

- [x] Stats cards (Total Spend, Active Campaigns, Active Bookings, Pending Approvals)
- [x] Pending approvals section with verification cards
- [x] Active campaigns section with status cards
- [x] Top spaces section with performance ranking
- [x] Spending chart with time range selector
- [x] Recent activity table (via notifications)

**Additional Features:**

- [x] Payment method status indicator (badge on Total Spend card)
- [x] Approval deadline warnings (dedicated slot for VERIFIED bookings with 48hr countdown)
- [x] Pending payments preview (dedicated slot showing APPROVED bookings awaiting payment)
- [x] Performance comparison vs previous period (This Month card with spending trend)

**GraphQL Migration:**

- [x] `me.advertiserProfile.totalSpend` for total spend stat
- [x] `myCampaigns` (count nodes) for active campaigns count
- [x] `myBookingsAsAdvertiser.totalCount` for active/pending bookings
- [x] `myBookingsAsAdvertiser` for pending approvals list
- [x] `myCampaigns` for active campaigns list
- [x] `myBookingsAsAdvertiser` aggregated by space for top spaces
- [x] `myBookingsAsAdvertiser.payments` aggregated for spending chart
- [x] `myNotifications` for recent activity feed

#### Backend Note

**Queries (used):**

- `me.advertiserProfile.totalSpend` - Total lifetime spending
- `myCampaigns(where: {status: {in: [ACTIVE, SUBMITTED]}})` - Active campaigns
- `myBookingsAsAdvertiser(where: {status: {eq: VERIFIED}})` - Pending approvals
- `myBookingsAsAdvertiser(where: {status: {in: [...]}})` - For top spaces and stats
- `myBookingsAsAdvertiser.payments` - For spending chart (client-side aggregation)
- `myNotifications` - For recent activity feed

**Patterns Used:**

- Parallel routes for independent streaming of each section
- Fragment reader pattern with `createFragmentReader`
- Client-side aggregation for top spaces (group by space, sum amounts)
- Client-side aggregation for spending chart (group by date)

**Frontend Status:** ✅ Fully functional (parallel routes, all sections live)

---

### 2. Discover (`/discover`)

**Purpose:** Find and browse available advertising spaces.

#### Implementation Checklist

**Main Page:**

- [x] Parallel routes for grid and map views
- [x] Real GraphQL query (`spaces`)
- [x] Grid view with space cards
- [x] Map view with markers
- [x] View toggle (grid/map)
- [x] Loading skeleton
- [ ] Filter panel (location, price, space type, availability)
- [ ] Search by location with autocomplete
- [ ] Sort options (Price, Rating, Distance)
- [ ] Save to favorites
- [ ] Pagination/infinite scroll

**Grid View:**

- [x] Space cards with images
- [x] Price per day display
- [x] Space type badge
- [ ] Quick book button
- [ ] Favorite toggle

**Map View:**

- [x] Interactive map with markers
- [x] Price badges on markers
- [ ] Marker clustering
- [ ] Click to preview space
- [ ] Geolocation button

**Space Detail (Modal or Page):**

- [ ] Photo gallery carousel
- [ ] Space specifications
- [ ] Owner info card with rating
- [ ] Availability calendar preview
- [ ] Price calculator
- [ ] "Request Booking" CTA
- [ ] Share functionality

#### Backend Note

**Queries (exist in schema):**

- `spaces` - Paginated with extensive filtering and sorting
- `spaceById(id)` - Space details with owner info

**Space fields available:** `id`, `title`, `description`, `address`, `city`, `state`, `zipCode`, `latitude`,
`longitude`, `pricePerDay`, `type`, `images`, `averageRating`, `totalBookings`, `width`, `height`, `minDuration`,
`maxDuration`, `installationFee`, `owner`

**Frontend Status:** ✅ Fully functional

---

### 3. Campaigns (`/campaigns`)

**Purpose:** Manage advertising campaigns and their associated bookings.

#### Implementation Checklist

**Main Page:**

- [ ] Campaign cards grid with status badges
- [ ] Real GraphQL query (`myCampaigns`)
- [ ] Fragment masking pattern
- [ ] Create campaign modal/wizard
- [ ] Empty state placeholder
- [ ] Loading skeleton
- [ ] Status filter tabs (Draft, Active, Completed, Cancelled)
- [ ] Search by campaign name
- [ ] Sort options (Name, Date, Budget)

**Create Campaign Modal:**

- [ ] Step 1: Campaign details (name, description, goals)
- [ ] Step 2: Target audience
- [ ] Step 3: Budget and dates
- [ ] Step 4: Creative upload (PDF/PNG/JPG)
- [ ] Step 5: Preview before creation
- [ ] File validation (type, size, dimensions)
- [ ] `createCampaign` mutation

**Detail Page (`/campaigns/[id]`):**

- [ ] Header with campaign name and status
- [ ] Campaign info section
- [ ] Creative preview/download
- [ ] Associated bookings list
- [ ] Budget vs spent display
- [ ] Performance metrics (if available)
- [ ] Edit campaign button
- [ ] Cancel campaign button

**Campaign Statuses:**

| Status    | Description                    |
|-----------|--------------------------------|
| DRAFT     | Not yet submitted              |
| SUBMITTED | Awaiting booking confirmations |
| ACTIVE    | Has active bookings            |
| COMPLETED | All bookings completed         |
| CANCELLED | Campaign cancelled             |

#### Backend Note

**Queries (exist in schema):**

- `myCampaigns` - Paginated with filtering (`status`), sorting
- `campaignById(id)` - Single campaign with nested `bookings`

**Mutations (exist in schema):**

- `createCampaign(input: {name, description, imageUrl, startDate, endDate, totalBudget, goals, targetAudience})`
- `updateCampaign(id, input: {...})`
- `submitCampaign(input: {id})` - Submit DRAFT for booking
- `cancelCampaign(input: {id})`
- `deleteCampaign(input: {id})` - Delete DRAFT only

**Campaign fields:** `id`, `name`, `description`, `status`, `imageUrl`, `startDate`, `endDate`, `totalBudget`, `goals`,
`targetAudience`, `spacesCount`, `totalSpend`, `bookings`

**Frontend Status:** Query works. Mutations not wired.

---

### 4. Bookings (`/bookings`)

**Purpose:** Manage all bookings across campaigns.

#### Implementation Checklist

**Main Page:**

- [x] Bookings list/table with TanStack Table
- [x] Real GraphQL query (`myBookingsAsAdvertiser`)
- [x] Status badges with colors
- [x] Loading skeleton
- [ ] Tab filters (Pending, Active, Completed, All)
- [ ] Search by space or campaign
- [ ] Date range filter
- [ ] Sort options

**Filter Tabs:**

| Tab       | Status Filter                                      |
|-----------|----------------------------------------------------|
| Pending   | `PENDING_APPROVAL`, `APPROVED`                     |
| Active    | `PAID`, `FILE_DOWNLOADED`, `INSTALLED`, `VERIFIED` |
| Completed | `COMPLETED`                                        |
| All       | No filter                                          |

**Detail Page (`/bookings/[id]`):**

- [x] Status timeline visualization
- [x] Space info card
- [x] Payment summary
- [x] Approve installation button
- [x] Open dispute button
- [x] Dispute modal with reason selection
- [ ] Header with booking dates
- [ ] Campaign info card
- [ ] Creative preview
- [ ] Verification photos display
- [ ] Message thread link
- [ ] Real GraphQL query (`bookingById`)
- [ ] Mutation integration

**Status-Based Actions:**

| Status           | Primary Action    | Secondary Actions     |
|------------------|-------------------|-----------------------|
| PENDING_APPROVAL | —                 | Cancel, Message Owner |
| APPROVED         | Pay Now           | Cancel, Message       |
| PAID             | —                 | Message               |
| FILE_DOWNLOADED  | —                 | Message               |
| INSTALLED        | —                 | Message               |
| VERIFIED         | Approve / Dispute | Message               |
| DISPUTED         | View Dispute      | Message               |

#### Backend Note

**Queries (exist in schema):**

- `myBookingsAsAdvertiser` - Paginated with filtering, sorting
- `bookingById(id)` - With `proof`, `dispute`, `payments`

**Mutations (exist in schema):**

- `createBooking(campaignId, input: {spaceId, startDate, endDate, advertiserNotes?})`
- `cancelBooking(input: {id, reason})`
- `createPaymentIntent(input: {bookingId})` → Returns `clientSecret` for Stripe
- `confirmPayment(input: {paymentIntentId})`

**Missing for verification approval:**

- No mutation for advertiser to approve/dispute installation proof
- Recommended: `approveProof(input: {bookingId})` and `disputeProof(input: {bookingId, issueType, reason, photos})`
- `BookingDispute` type exists but no mutation to create from advertiser side

**Subscriptions (exist in schema):**

- `onBookingUpdate(bookingId)`
- `onProofUpdate(bookingId)`

**Frontend Status:** Query works. Payment flow and proof approval mutations not wired.

---

### 5. Spending (`/spending`)

**Purpose:** Track payments, invoices, and financial activity.

#### Implementation Checklist

**Main Page:**

- [ ] Summary cards (Total Spent, This Month, Pending Payments, Active Campaigns)
- [ ] Spending chart with daily/monthly aggregation
- [ ] Transactions table
- [ ] Filter by date range
- [ ] Filter by campaign
- [ ] Export to CSV

**Payment History:**

- [ ] Payment list with pagination
- [ ] Filter by status (Succeeded, Pending, Failed, Refunded)
- [ ] Payment detail modal
- [ ] Associated booking link
- [ ] Receipt download

**Payment Methods:**

- [ ] Saved cards list
- [ ] Add new card (Stripe Elements)
- [ ] Set default card
- [ ] Remove card

#### Backend Note

**Queries (exist in schema):**

- `myBookingsAsAdvertiser` with nested `payments` - Can aggregate client-side
- `paymentsByBooking(bookingId)` - Payment history for specific booking

**Missing:**

- `advertiserSpendingSummary` - Aggregated totals
- `myPayments` query for advertiser (like `myPayouts` for owner)

**Mutations (exist in schema):**

- `requestRefund(input: {paymentId, amount, reason})`

**Frontend Status:** ❌ Entirely mocked

---

### 6. Analytics (`/analytics`)

**Purpose:** Campaign performance insights and metrics.

#### Implementation Checklist

**Summary Cards:**

- [x] Total bookings with trend
- [x] Total spent with trend
- [x] Active campaigns count (mapped to totalBookings)
- [x] Average cost per impression (avgCostPerImpression)
- [x] Spaces booked count (reach)
- [x] Completion rate

**Charts:**

- [x] Spending over time (area chart with time range)
- [x] Status distribution (pie chart)
- [x] Monthly performance (bar chart with range selector)
- [x] Reach & impressions (area chart - mock data, no backend)

**Tables:**

- [x] Space performance table (which spaces performed best)
- [x] Top performing locations
- [x] Period comparison

#### Backend Note

**Queries - MISSING:**

Similar to Space Owner analytics, frontend needs:

- Total spend, bookings, campaigns
- Spending trends time series
- Campaign performance comparison
- Space performance (which spaces delivered best ROI)

**Recommended new query:**

```graphql
type AdvertiserAnalytics {
    summary: AnalyticsSummary!
    spendingTrends(range: DateRange!): [TimeSeriesPoint!]!
    statusDistribution: [StatusCount!]!
    campaignPerformance(first: Int): [CampaignPerformance!]!
    monthlySpending(months: Int): [MonthlySpending!]!
    spacePerformance(first: Int): [SpacePerformance!]!
    bookingHeatmap: [[Int!]!]!
    periodComparison: PeriodComparison!
}

query advertiserAnalytics(dateRange: DateRangeInput): AdvertiserAnalytics
```

**Frontend Status:** ✅ Functional (reach chart uses mock data pending backend support)

---

## GraphQL Reference

### Queries

**User:**

| Query | Purpose                    | Implemented |
|-------|----------------------------|-------------|
| `me`  | Current user with profiles | ✅           |

**Space Owner:**

| Query                     | Purpose                    | Implemented |
|---------------------------|----------------------------|-------------|
| `mySpaces`                | Owner's spaces             | ✅           |
| `spaceById(id)`           | Single space details       | ✅           |
| `myBookingsAsOwner`       | Bookings on owner's spaces | ✅           |
| `bookingById(id)`         | Single booking details     | ✅           |
| `incomingBookingRequests` | Pending approval queue     | ❌           |
| `bookingsRequiringAction` | Bookings needing action    | ❌           |
| `earningsSummary`         | Financial summary          | ✅           |
| `myPayouts`               | Payout history             | ✅           |
| `payoutById(id)`          | Single payout details      | ❌           |
| `myReviews`               | Reviews for owner          | ✅           |

**Advertiser:**

| Query                    | Purpose                 | Implemented |
|--------------------------|-------------------------|-------------|
| `spaces`                 | Browse available spaces | ✅           |
| `myCampaigns`            | Advertiser's campaigns  | ⚠️          |
| `campaignById(id)`       | Single campaign details | ❌           |
| `myBookingsAsAdvertiser` | Advertiser's bookings   | ✅           |
| `paymentsByBooking(id)`  | Payments for booking    | ❌           |

**Shared:**

| Query                        | Purpose                   | Implemented |
|------------------------------|---------------------------|-------------|
| `myConversations`            | Message threads           | ✅           |
| `messagesByConversation(id)` | Messages in thread        | ✅           |
| `unreadConversationsCount`   | Unread message count      | ✅           |
| `myNotifications`            | User notifications        | ✅           |
| `unreadNotificationsCount`   | Unread notification count | ✅           |
| `myNotificationPreferences`  | Notification settings     | ✅           |
| `reviewsBySpace(spaceId)`    | Reviews for a space       | ✅           |
| `reviewByBooking(bookingId)` | Review for booking        | ❌           |
| `transactionsByBooking(id)`  | Financial transactions    | ❌           |

### Mutations

**Space:**

| Mutation          | Purpose            | Implemented |
|-------------------|--------------------|-------------|
| `createSpace`     | Create new space   | ✅           |
| `updateSpace`     | Edit space details | ✅           |
| `deactivateSpace` | Set space inactive | ✅           |
| `reactivateSpace` | Reactivate space   | ✅           |
| `deleteSpace`     | Remove space       | ✅           |

**Booking:**

| Mutation             | Purpose                    | Implemented |
|----------------------|----------------------------|-------------|
| `approveBooking`     | Accept booking request     | ✅           |
| `rejectBooking`      | Decline booking request    | ✅           |
| `cancelBooking`      | Cancel booking             | ✅           |
| `markFileDownloaded` | Record creative download   | ✅           |
| `markInstalled`      | Mark installation complete | ✅           |
| `submitProof`        | Upload verification photos | ✅           |

**Campaign:**

| Mutation         | Purpose               | Implemented |
|------------------|-----------------------|-------------|
| `createCampaign` | Create new campaign   | ❌           |
| `updateCampaign` | Edit campaign details | ❌           |
| `submitCampaign` | Submit for booking    | ❌           |
| `cancelCampaign` | Cancel campaign       | ❌           |
| `deleteCampaign` | Remove draft campaign | ❌           |

**Payment:**

| Mutation              | Purpose          | Implemented |
|-----------------------|------------------|-------------|
| `createPaymentIntent` | Initiate payment | ❌           |
| `confirmPayment`      | Complete payment | ❌           |
| `requestRefund`       | Request refund   | ❌           |

**Payout:**

| Mutation        | Purpose             | Implemented |
|-----------------|---------------------|-------------|
| `processPayout` | Process payout      | ❌           |
| `retryPayout`   | Retry failed payout | ✅           |

**Message:**

| Mutation                    | Purpose             | Implemented |
|-----------------------------|---------------------|-------------|
| `sendMessage`               | Send message        | ✅           |
| `markConversationRead`      | Mark thread as read | ✅           |
| `createBookingConversation` | Start conversation  | ✅           |

**Notification:**

| Mutation                       | Purpose             | Implemented |
|--------------------------------|---------------------|-------------|
| `markNotificationRead`         | Mark as read        | ✅           |
| `markAllNotificationsRead`     | Mark all as read    | ✅           |
| `deleteNotification`           | Delete notification | ✅           |
| `updateNotificationPreference` | Toggle notification | ✅           |

**Review:**

| Mutation       | Purpose       | Implemented |
|----------------|---------------|-------------|
| `createReview` | Create review | ❌           |
| `updateReview` | Edit review   | ❌           |
| `deleteReview` | Delete review | ❌           |

**Profile:**

| Mutation                  | Purpose              | Implemented |
|---------------------------|----------------------|-------------|
| `updateCurrentUser`       | Update profile       | ✅           |
| `updateSpaceOwnerProfile` | Update business info | ✅           |
| `updateAdvertiserProfile` | Update company info  | ✅           |
| `changePassword`          | Change password      | ✅           |
| `deleteMyAccount`         | Delete account       | ✅           |

**Stripe:**

| Mutation                     | Purpose                 | Implemented |
|------------------------------|-------------------------|-------------|
| `connectStripeAccount`       | Start Stripe onboarding | ✅           |
| `disconnectStripeAccount`    | Disconnect Stripe       | ❌           |
| `refreshStripeAccountStatus` | Update account status   | ✅           |

### Subscriptions

| Subscription                 | Purpose                     | Implemented |
|------------------------------|-----------------------------|-------------|
| `onBookingUpdate(bookingId)` | Real-time booking changes   | ❌           |
| `onMessage(conversationId)`  | Real-time messages          | ✅           |
| `onNotification(userId)`     | Real-time notifications     | ✅           |
| `onProofUpdate(bookingId)`   | Verification status changes | ❌           |

---

## Data Types Reference

### Space

| Field           | Type        | Description                      |
|-----------------|-------------|----------------------------------|
| id              | UUID        | Unique identifier                |
| title           | String      | Display name                     |
| description     | String?     | Detailed description             |
| type            | SpaceType   | STOREFRONT, WINDOW_DISPLAY, etc. |
| status          | SpaceStatus | ACTIVE, INACTIVE, PENDING, etc.  |
| address         | String      | Street address                   |
| city            | String      | City                             |
| state           | String      | State                            |
| zipCode         | String?     | ZIP code                         |
| latitude        | Float       | Coordinate                       |
| longitude       | Float       | Coordinate                       |
| pricePerDay     | Decimal     | Daily rate                       |
| installationFee | Decimal?    | Custom installation fee          |
| minDuration     | Int         | Minimum booking days             |
| maxDuration     | Int?        | Maximum booking days             |
| width           | Float?      | Width in inches                  |
| height          | Float?      | Height in inches                 |
| images          | [String]    | Image URLs                       |
| averageRating   | Float?      | Computed rating                  |
| totalBookings   | Int         | Booking count                    |
| totalRevenue    | Decimal     | Lifetime revenue                 |

**SpaceType Enum:** STOREFRONT, WINDOW_DISPLAY, BILLBOARD, DIGITAL_DISPLAY, VEHICLE_WRAP, TRANSIT, OTHER

**SpaceStatus Enum:** ACTIVE, INACTIVE, PENDING_APPROVAL, REJECTED, SUSPENDED

### Booking

| Field             | Type            | Description             |
|-------------------|-----------------|-------------------------|
| id                | UUID            | Unique identifier       |
| status            | BookingStatus   | Current lifecycle stage |
| startDate         | DateTime        | Start date              |
| endDate           | DateTime        | End date                |
| totalDays         | Int             | Duration                |
| pricePerDay       | Decimal         | Agreed rate             |
| installationFee   | Decimal         | Installation cost       |
| subtotalAmount    | Decimal         | Before fees             |
| platformFeeAmount | Decimal         | Platform cut            |
| ownerPayoutAmount | Decimal         | Owner's total           |
| totalAmount       | Decimal         | Advertiser pays         |
| advertiserNotes   | String?         | From advertiser         |
| ownerNotes        | String?         | From owner              |
| fileDownloadedAt  | DateTime?       | When file downloaded    |
| space             | Space           | Booked space            |
| campaign          | Campaign        | Advertiser's campaign   |
| proof             | BookingProof?   | Verification submission |
| dispute           | BookingDispute? | If disputed             |
| payments          | [Payment]       | Payment records         |
| payouts           | [Payout]        | Payout records          |

**BookingStatus Enum:** PENDING_APPROVAL, APPROVED, PAID, FILE_DOWNLOADED, INSTALLED, VERIFIED, COMPLETED, DISPUTED,
REJECTED, CANCELLED

### Campaign

| Field             | Type              | Description                    |
|-------------------|-------------------|--------------------------------|
| id                | UUID              | Unique identifier              |
| name              | String            | Campaign name                  |
| description       | String?           | Campaign description           |
| status            | CampaignStatus    | DRAFT, SUBMITTED, ACTIVE, etc. |
| imageUrl          | String            | Creative file URL              |
| startDate         | DateTime?         | Campaign start                 |
| endDate           | DateTime?         | Campaign end                   |
| totalBudget       | Decimal?          | Budget allocation              |
| goals             | String?           | Campaign goals                 |
| targetAudience    | String?           | Target audience                |
| bookings          | [Booking]         | Associated bookings            |
| advertiserProfile | AdvertiserProfile | Owner profile                  |

**CampaignStatus Enum:** DRAFT, SUBMITTED, ACTIVE, COMPLETED, CANCELLED

### Payout

| Field            | Type         | Description               |
|------------------|--------------|---------------------------|
| id               | UUID         | Unique identifier         |
| amount           | Decimal      | Payout amount             |
| stage            | PayoutStage  | STAGE1 or STAGE2          |
| status           | PayoutStatus | PENDING, PROCESSING, etc. |
| stripeTransferId | String?      | Stripe reference          |
| processedAt      | DateTime?    | When processed            |
| failureReason    | String?      | If failed                 |
| attemptCount     | Int          | Retry count               |

**PayoutStage Enum:** STAGE1 (install fee), STAGE2 (rental)

**PayoutStatus Enum:** PENDING, PROCESSING, COMPLETED, FAILED, PARTIALLY_PAID

### Payment

| Field                 | Type          | Description              |
|-----------------------|---------------|--------------------------|
| id                    | UUID          | Unique identifier        |
| amount                | Decimal       | Payment amount           |
| status                | PaymentStatus | PENDING, SUCCEEDED, etc. |
| type                  | PaymentType   | FULL, DEPOSIT, BALANCE   |
| paidAt                | DateTime?     | When paid                |
| stripePaymentIntentId | String        | Stripe reference         |
| failureReason         | String?       | If failed                |
| refunds               | [Refund]      | Associated refunds       |

### SpaceOwnerProfile

| Field               | Type           | Description               |
|---------------------|----------------|---------------------------|
| id                  | UUID           | Unique identifier         |
| businessName        | String?        | Business name             |
| businessType        | String?        | Type of business          |
| payoutSchedule      | PayoutSchedule | WEEKLY, BIWEEKLY, MONTHLY |
| onboardingComplete  | Boolean        | Setup finished            |
| stripeAccountId     | String?        | Stripe Connect ID         |
| stripeAccountStatus | String?        | Account health            |

### AdvertiserProfile

| Field              | Type    | Description       |
|--------------------|---------|-------------------|
| id                 | UUID    | Unique identifier |
| companyName        | String? | Company name      |
| industry           | String? | Business industry |
| website            | String? | Company website   |
| onboardingComplete | Boolean | Setup finished    |

### EarningsSummary

| Field             | Type    | Description          |
|-------------------|---------|----------------------|
| availableBalance  | Decimal | Ready to withdraw    |
| pendingPayouts    | Decimal | In escrow            |
| thisMonthEarnings | Decimal | Current month total  |
| lastMonthEarnings | Decimal | Previous month total |
| totalEarnings     | Decimal | Lifetime earnings    |

---

## Implementation Patterns

### Server Component with Fragment Colocation

1. Define fragments in child components
2. Parent page composes fragments into single query
3. Pass fragment-typed data to children
4. Children unmask with `getFragmentData()`

### Loading States

Create `loading.tsx` files for route-level skeletons. Export skeleton components from the same file as the component for
reuse.

### Error Handling

Use try/catch with redirect to `/logout` for auth errors. Display inline errors for form submissions using ActionState
pattern.

### Mock Data Pattern

For development, use `mock.json` files with realistic data. Structure should match expected GraphQL response shape.

### Payment Integration

For payment flows:

1. Create PaymentIntent via `createPaymentIntent` mutation
2. Use Stripe Elements for card input
3. Confirm payment via `confirmPayment` mutation
4. Handle success/failure states

---

## Backend Gaps Summary

### Missing Mutations (blocking features)

1. `approveProof` / `disputeProof` - Advertiser verification approval

### Missing Queries (would improve UX)

1. `advertiserAnalytics` - Aggregated analytics for advertiser analytics page
2. `advertiserSpendingSummary` - Spending totals for spending page
3. `calendarEvents` - Optimized calendar query

Note: Activity feeds on overview pages use `myNotifications`, charts use client-side aggregation from `myPayouts`/
`myBookingsAsAdvertiser.payments`.

Everything else exists in the schema - frontend needs to wire up the mutations.
