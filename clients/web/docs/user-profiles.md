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

| Route     | Status       | Data Source    | Notes                                   |
|-----------|--------------|----------------|-----------------------------------------|
| Overview  | ✅ Functional | GraphQL        | Stats integrated, charts use mock       |
| Listings  | ⚠️ Partial   | GraphQL + Mock | Detail page needs mutations             |
| Bookings  | ⚠️ Partial   | GraphQL + Mock | Filtering disabled, mutations not wired |
| Earnings  | ✅ Functional | GraphQL        | Fully integrated                        |
| Analytics | ⚠️ Partial   | Mock JSON      | UI complete, needs backend query        |
| Calendar  | ⚠️ Partial   | Mock JSON      | Views implemented, needs GraphQL        |
| Profile   | ✅ Functional | GraphQL        | Real reviews from API                   |
| Settings  | ✅ Functional | GraphQL        | Stripe Connect, notifications working   |

### Advertiser Routes

| Route     | Status       | Data Source | Notes                            |
|-----------|--------------|-------------|----------------------------------|
| Overview  | ⚠️ Partial   | Mock        | Under construction               |
| Discover  | ✅ Functional | GraphQL     | Grid/Table/Map views working     |
| Campaigns | ⚠️ Partial   | GraphQL     | Query works, mutations not wired |
| Bookings  | ⚠️ Partial   | GraphQL     | Query works, mutations needed    |
| Spending  | ❌ Mock Only  | Mock        | No GraphQL integration           |
| Analytics | ❌ Mock Only  | Mock        | No GraphQL integration           |
| Profile   | ✅ Functional | GraphQL     | Real campaign data               |
| Settings  | ✅ Functional | GraphQL     | Notifications, delete working    |

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
- [ ] Typing indicators (blocked: requires backend schema changes)

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
- [ ] Response rate metric (blocked: needs `responseRate` field)
- [ ] Response time metric (blocked: needs `averageResponseTime` field)

**Advertiser Profile:**

- [x] Profile card (avatar, name, company)
- [x] About section (company info)
- [x] Campaigns section with pagination
- [x] Real GraphQL query (`me`)
- [x] Loading skeleton
- [ ] Response rate metric (blocked: needs `responseRate` field)

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
- [ ] Save changes button
- [ ] `updateSpaceOwnerProfile` / `updateAdvertiserProfile` mutation

**Payout Tab (Space Owner):**

- [x] Stripe Connect status display
- [x] Bank account info (masked)
- [x] Connect Stripe button
- [x] View Stripe Dashboard link
- [x] Refresh Status button
- [ ] Disconnect Stripe (managed via Stripe dashboard)

**Payment Tab (Advertiser):**

- [ ] Saved payment methods
- [ ] Add card (Stripe Elements)
- [ ] Set default card
- [ ] Remove card

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
- [ ] Replace mock chart data with aggregated query
- [ ] Replace mock activity with real activity feed

**Additional Features:**

- [ ] Quick action buttons (Create Space, Withdraw Funds)
- [ ] Installation deadline warnings
- [ ] Stripe Connect status indicator
- [ ] Upcoming payouts preview
- [ ] Performance comparison vs previous period

#### Backend Note

**Queries (exist in schema):**

- `earningsSummary` → `availableBalance`, `pendingPayouts`, `thisMonthEarnings`, `lastMonthEarnings`
- `incomingBookingRequests(first: 5)` - Pending approval bookings
- `myBookingsAsOwner(where: {status: {in: [PAID, FILE_DOWNLOADED, INSTALLED]}})` - Active bookings
- `me.spaceOwnerProfile.spaces(first: 5, order: {totalRevenue: DESC})` - Top spaces

**Missing:**

- `activeBookingsCount` - Use `totalCount` from connection
- `totalSpacesCount` - Use `totalCount` from connection
- Activity chart time-series - Options:
    1. Add `bookingsByDateRange(start, end)` query with daily aggregation
    2. Client-side aggregate from `myPayouts` (current workaround)
- Recent activity feed - Options:
    - Add `myActivityFeed` query returning union of events
    - Client combines `myNotifications` with entity lookups

**Frontend Status:** Stats cards work. Charts/activity mocked.

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
- [ ] Search by title
- [ ] Bulk actions (Deactivate, Delete)

**Create Space Modal:**

- [x] Step 1: Photos upload UI
- [x] Step 2: Details form (type, title, description)
- [x] Step 3: Location fields + map preview
- [x] Step 4: Pricing and duration settings
- [x] Step 5: Preview before publish
- [ ] Photo upload to server (TODO in code)
- [ ] `createSpace` mutation integration
- [ ] Validation with error messages
- [ ] Draft saving to localStorage

**Detail Page (`/listings/[id]`):**

- [x] Header with title and status badge
- [x] Photo gallery UI
- [x] Details form UI
- [x] Performance stats section
- [x] Real GraphQL query (`spaceById`)
- [ ] Photo upload to server (TODO: gallery.tsx:34)
- [ ] Photo delete from server (TODO: gallery.tsx:40)
- [ ] `updateSpace` mutation (TODO: details.tsx:43)
- [ ] Availability calendar integration
- [ ] Booking history for this space
- [ ] Reviews for this space
- [ ] Deactivate/Reactivate toggle
- [ ] Delete with confirmation

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

**Note:** All mutations exist but frontend hasn't wired them yet. Image upload handled via Cloudinary (frontend), then
URLs passed to mutations.

**Frontend Status:** Query works. Mutations not wired (TODO comments in code).

---

### 3. Bookings (`/bookings`)

**Purpose:** Manage all bookings for owned spaces.

#### Implementation Checklist

**Main Page:**

- [x] Bookings table with TanStack Table
- [x] Real GraphQL query (`myBookingsAsOwner`)
- [x] Fragment masking
- [x] Status badges with colors
- [x] Action dropdowns
- [x] Empty state placeholder
- [x] Loading skeleton
- [ ] Tab filters (Incoming, Active, Completed, All) - currently disabled
- [ ] Search by advertiser or space name
- [ ] Date range filter
- [ ] Bulk actions (Accept, Reject selected)
- [ ] Export to CSV

**Filter Tabs:**

| Tab       | Status Filter                                      |
|-----------|----------------------------------------------------|
| Incoming  | `PENDING_APPROVAL`                                 |
| Active    | `PAID`, `FILE_DOWNLOADED`, `INSTALLED`, `VERIFIED` |
| Completed | `COMPLETED`                                        |
| All       | No filter                                          |

**Detail Page (`/bookings/[id]`):**

- [ ] Header with status and dates
- [ ] Status timeline visualization
- [ ] Campaign info (advertiser, creative preview)
- [ ] Space info card
- [ ] Financial summary (price breakdown, payouts)
- [ ] Context-appropriate action buttons
- [ ] Verification photos display/upload
- [ ] Message thread link
- [ ] Dispute handling UI

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

**Subscriptions (exist in schema):**

- `onBookingUpdate(bookingId)` - Real-time status changes
- `onProofUpdate(bookingId)` - Verification status changes

**Note:** All mutations exist but frontend hasn't wired action buttons. Status filtering exists but frontend disabled
it (see bookings/page.tsx).

**Frontend Status:** Query works. Mutations not wired.

---

### 4. Earnings (`/earnings`)

**Purpose:** Financial dashboard showing earnings and payout management.

#### Implementation Checklist

**Main Page:**

- [x] Balance cards (Available, Pending, This Month, Total)
- [x] Real GraphQL query (`earningsSummary`, `myPayouts`)
- [x] Fragment masking
- [x] Earnings chart with daily aggregation
- [x] Payouts table with stage badges
- [x] Loading skeleton
- [ ] Stripe Connect status indicator
- [ ] "Withdraw" button integration
- [ ] Date range filter for chart
- [ ] Export payouts to CSV

**Payout History (`/earnings/payouts`):**

- [ ] Full payout history with pagination
- [ ] Filter by stage (Stage 1, Stage 2)
- [ ] Filter by status (Pending, Processing, Completed, Failed)
- [ ] Filter by date range
- [ ] Retry failed payout button
- [ ] Export to CSV/PDF

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
- [ ] Replace mock data with real queries

**Charts:**

- [x] Bookings over time (area chart with time range)
- [x] Status distribution (pie chart)
- [x] Revenue by space (bar chart)
- [x] Monthly revenue (bar chart with range selector)
- [x] Rating trends (composed chart with review volume)
- [x] Booking heatmap (day × hour activity)
- [x] Period comparison card
- [ ] Replace mock data with real queries

**Tables:**

- [x] Space performance table with occupancy
- [x] Top performers section
- [ ] Replace mock data with real queries

#### Backend Note

**Queries - MISSING:**

Frontend needs aggregated analytics data. Current mock includes:

- `totalBookings`, `totalRevenue`, `averageRating`, `completionRate`
- Booking trends (weekly time series)
- Status distribution (counts by status)
- Revenue by space (top performers)
- Monthly revenue trends
- Rating trends with review counts
- Booking heatmap (day × hour matrix)
- Period comparison (this month vs last)

**Recommended new query:**

```graphql
type SpaceOwnerAnalytics {
    summary: AnalyticsSummary!
    bookingTrends(range: DateRange!): [TimeSeriesPoint!]!
    statusDistribution: [StatusCount!]!
    spacePerformance(first: Int): [SpacePerformance!]!
    monthlyRevenue(months: Int): [MonthlyRevenue!]!
    ratingTrends(months: Int): [RatingTrend!]!
    bookingHeatmap: [[Int!]!]!  # 7x24 matrix
    periodComparison: PeriodComparison!
}

query spaceOwnerAnalytics(dateRange: DateRangeInput): SpaceOwnerAnalytics
```

**Frontend Status:** ❌ Entirely mocked

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
- [ ] Click to unblock dates
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

**Queries - PARTIAL:**

- `mySpaces` with nested `bookings(where: {startDate: {lte: $end}, endDate: {gte: $start}})` - Works but expensive

**Recommended optimization:**

```graphql
query calendarEvents(start: DateTime!, end: DateTime!, spaceIds: [ID!]) {
bookings: [CalendarBooking!]!  # Flattened booking data
blockedDates: [BlockedDate!]!  # Space availability blocks
}
```

**Note:** Currently no `BlockedDate` type exists - owner can't block dates for spaces.

**Frontend Status:** ⚠️ Mock data. Query possible via nested approach.

---

## Advertiser Routes

### 1. Overview (`/overview`)

**Purpose:** At-a-glance dashboard showing active campaigns, pending actions, and spending summary.

#### Implementation Checklist

**Core Components:**

- [ ] Stats cards (Active Campaigns, Pending Bookings, This Month Spending, Total Reach)
- [ ] Active campaigns section with status cards
- [ ] Pending verifications section (installations awaiting approval)
- [ ] Recent bookings table
- [ ] Spending chart with time range selector
- [ ] Quick actions (Create Campaign, Discover Spaces)

**GraphQL Migration:**

- [ ] Replace mock stats with aggregated campaign/booking data
- [ ] `myCampaigns` query for active campaigns
- [ ] `myBookingsAsAdvertiser` for pending verifications
- [ ] Aggregate payment data for spending chart

#### Backend Note

**Queries (exist in schema):**

- `myCampaigns(where: {status: {eq: ACTIVE}})` - Active campaigns
- `myBookingsAsAdvertiser(where: {status: {in: [INSTALLED, VERIFIED]}})` - Pending verifications
- `me.advertiserProfile.totalSpend` - Total spending

**Missing:**

- `activeCampaignsCount` - Use `totalCount` from connection
- `pendingBookingsCount` - Need count of PENDING_APPROVAL bookings
- Spending chart time-series - Aggregate from `myBookingsAsAdvertiser.payments`
- Consider `advertiserDashboardSummary` query for efficiency

**Frontend Status:** ❌ Entirely mocked

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

- [ ] Total bookings with trend
- [ ] Total spent with trend
- [ ] Active campaigns count
- [ ] Average booking duration
- [ ] Spaces booked count
- [ ] Completion rate

**Charts:**

- [ ] Bookings over time (area chart with time range)
- [ ] Status distribution (pie chart)
- [ ] Spending by campaign (bar chart)
- [ ] Monthly spending (bar chart with range selector)
- [ ] Booking heatmap (day × hour activity)

**Tables:**

- [ ] Campaign performance table
- [ ] Space performance table (which spaces performed best)
- [ ] Top performing locations

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

**Frontend Status:** ❌ Entirely mocked

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
| `bookingById(id)`         | Single booking details     | ❌           |
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
| `createSpace`     | Create new space   | ❌           |
| `updateSpace`     | Edit space details | ❌           |
| `deactivateSpace` | Set space inactive | ❌           |
| `reactivateSpace` | Reactivate space   | ❌           |
| `deleteSpace`     | Remove space       | ❌           |

**Booking:**

| Mutation             | Purpose                    | Implemented |
|----------------------|----------------------------|-------------|
| `approveBooking`     | Accept booking request     | ❌           |
| `rejectBooking`      | Decline booking request    | ❌           |
| `cancelBooking`      | Cancel booking             | ❌           |
| `markFileDownloaded` | Record creative download   | ❌           |
| `markInstalled`      | Mark installation complete | ❌           |

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
| `retryPayout`   | Retry failed payout | ❌           |

**Message:**

| Mutation                    | Purpose             | Implemented |
|-----------------------------|---------------------|-------------|
| `sendMessage`               | Send message        | ✅           |
| `markConversationRead`      | Mark thread as read | ✅           |
| `createBookingConversation` | Start conversation  | ❌           |

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
2. Space blocked dates management

### Missing Queries (would improve UX)

1. `spaceOwnerAnalytics` - Aggregated analytics
2. `advertiserAnalytics` - Aggregated analytics
3. `advertiserSpendingSummary` - Spending totals
4. `calendarEvents` - Optimized calendar query
5. `myActivityFeed` - Unified activity stream

Everything else exists in the schema - frontend needs to wire up the mutations.

---

## Implementation Priority

### Phase 1: Core Mutations (Critical Path)

1. Space mutations (create, update, delete)
2. Booking actions (approve, reject, mark downloaded/installed)
3. Campaign mutations (create, update, submit, cancel)
4. Payment flow (createPaymentIntent, confirmPayment)

### Phase 2: GraphQL Migration

1. Overview pages → Replace mock data with real queries
2. Analytics → Request backend aggregation queries
3. Bookings → Enable filtering, remove mock fallback

### Phase 3: Communication

1. ~~Messages (conversation list, thread view, send)~~ ✅ Done
2. ~~Notifications (list, mark read, real-time)~~ ✅ Done (except real-time)
3. Real-time subscriptions (messages done, notifications pending)

### Phase 4: Advanced Features

1. Calendar view with date blocking
2. Export functionality
3. Stripe payment methods management

### Phase 5: Polish

1. Empty states refinement
2. Error handling improvements
3. Performance optimization
