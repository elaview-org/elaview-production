# Space Owner Dashboard Implementation Guide

Comprehensive reference for implementing the Space Owner dashboard in the Elaview web client.

## Overview

The Space Owner dashboard is a parallel route (`@spaceOwner`) within the `(dashboard)` route group. It renders when a
user with `role: USER` has `activeProfileType: SPACE_OWNER`. The dashboard enables space owners to manage their
advertising spaces, handle booking requests, track earnings, and communicate with advertisers.

## Architecture

### Route Structure

```
app/(dashboard)/@spaceOwner/
├── default.ts                    # Required parallel route default
├── navigation-bar.data.ts        # Sidebar navigation configuration
├── overview/                     # Dashboard landing page
├── listings/                     # Space management
│   └── [id]/                     # Space detail view
├── bookings/                     # Booking management
│   └── [id]/                     # Booking detail view
├── earnings/                     # Financial dashboard
│   └── payouts/                  # Payout history
├── analytics/                    # Performance insights
├── calendar/                     # Availability calendar
├── messages/                     # Conversation threads
│   └── [id]/                     # Conversation detail
├── profile/                      # Public profile view
└── settings/                     # Account settings
```

### Navigation Configuration

The sidebar navigation is defined in `navigation-bar.data.ts`:

| Section      | Items                                                                             |
|--------------|-----------------------------------------------------------------------------------|
| Quick Action | New Space                                                                         |
| Main Nav     | Overview, Listings, Bookings, Earnings, Analytics, Calendar, Messages             |
| Documents    | Installation Guide, Verification Guide, Payout FAQ, Tax Documents, Platform Terms |
| Secondary    | Help & Support, Terms of Service, Privacy Policy                                  |

---

## Implementation Status

| Route     | Status        | Data Source    | Notes                                    |
|-----------|---------------|----------------|------------------------------------------|
| Overview  | ✅ Functional  | Mock JSON      | Needs GraphQL migration                  |
| Listings  | ⚠️ Partial    | GraphQL + Mock | Detail page has upload/mutation TODOs    |
| Bookings  | ⚠️ Partial    | GraphQL + Mock | Filtering disabled, mock fallback active |
| Earnings  | ✅ Functional  | GraphQL        | Fully integrated                         |
| Analytics | ⚠️ Partial    | Mock JSON      | Needs GraphQL implementation             |
| Calendar  | ⚠️ Partial    | Mock JSON      | Month/week/day views, needs GraphQL      |
| Messages  | ❌ Not Started | —              | Minimal stub component                   |
| Profile   | ✅ Functional  | GraphQL        | Fully integrated                         |
| Settings  | ✅ Functional  | GraphQL        | Profile, business, notifications tabs    |

---

## Route Specifications

### 1. Overview (`/overview`)

**Purpose:** At-a-glance dashboard showing key metrics and pending actions.

#### Implementation Checklist

**Core Components:**

- [x] Stats cards (Available Balance, Pending Payouts, This Month, Active Bookings)
- [x] Pending requests section with action cards (Accept/Decline)
- [x] Active bookings section with progress timeline
- [x] Top spaces section with performance metrics
- [x] Activity chart with time range selector
- [x] Recent activity table

**GraphQL Migration:**

- [ ] Replace mock stats with `earningsSummary` query
- [ ] Replace mock pending requests with `incomingBookingRequests` query
- [ ] Replace mock active bookings with `myBookingsAsOwner` (status filter)
- [ ] Replace mock top spaces with `mySpaces` (sorted by revenue)
- [ ] Replace mock chart data with aggregated booking/payout data
- [ ] Replace mock activity with `myNotifications` or custom activity query

**Additional Features:**

- [ ] Quick action buttons (Create Space, Withdraw Funds)
- [ ] Installation deadline warnings
- [ ] Stripe Connect status indicator
- [ ] Upcoming payouts preview
- [ ] Performance comparison vs previous period

**Data Requirements:**

```graphql
query OverviewData {
    earningsSummary {
        availableBalance
        pendingPayouts
        thisMonthEarnings
        lastMonthEarnings
    }
    incomingBookingRequests(first: 5) {
        nodes { ...PendingRequestFragment }
    }
    myBookingsAsOwner(
        first: 5
        where: { status: { in: [PAID, FILE_DOWNLOADED, INSTALLED] } }
    ) {
        nodes { ...ActiveBookingFragment }
    }
    mySpaces(first: 5, order: { totalRevenue: DESC }) {
        nodes { ...TopSpaceFragment }
    }
}
```

---

### 2. Listings (`/listings`)

**Purpose:** Manage all advertising spaces owned by the user.

#### Implementation Checklist

**Main Page (`/listings`):**

- [x] Space cards grid with responsive layout
- [x] Real GraphQL query (`mySpaces`)
- [x] Fragment masking (`SpaceCard_SpaceFragment`)
- [x] Create space modal wizard
- [x] Empty state placeholder
- [x] Loading skeleton
- [ ] Status filter tabs (Active, Inactive, Pending, Rejected)
- [ ] Search by title
- [ ] Sort options (Revenue, Rating, Bookings, Created)
- [ ] Bulk actions (Deactivate, Delete)
- [ ] Pagination

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
- [x] Fragment composition
- [ ] Photo upload to server (TODO: gallery.tsx:34)
- [ ] Photo delete from server (TODO: gallery.tsx:40)
- [ ] `updateSpace` mutation (TODO: details.tsx:43)
- [ ] Availability calendar integration
- [ ] Booking history for this space
- [ ] Reviews for this space
- [ ] Deactivate/Reactivate toggle
- [ ] Delete with confirmation

**Additional Features:**

- [ ] Duplicate space functionality
- [ ] Space analytics preview
- [ ] Competitor pricing suggestions
- [ ] Photo optimization recommendations
- [ ] SEO preview (title, description length)

**Mutations:**

| Mutation          | Status | Purpose                  |
|-------------------|--------|--------------------------|
| `createSpace`     | ❌      | Create new space         |
| `updateSpace`     | ❌      | Edit space details       |
| `deactivateSpace` | ❌      | Set space inactive       |
| `reactivateSpace` | ❌      | Reactivate space         |
| `deleteSpace`     | ❌      | Remove space permanently |

---

### 3. Bookings (`/bookings`)

**Purpose:** Manage all bookings for owned spaces.

#### Implementation Checklist

**Main Page (`/bookings`):**

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

**Mutations:**

| Mutation             | Status | Purpose                    |
|----------------------|--------|----------------------------|
| `approveBooking`     | ❌      | Accept booking request     |
| `rejectBooking`      | ❌      | Decline booking request    |
| `cancelBooking`      | ❌      | Cancel booking             |
| `markFileDownloaded` | ❌      | Record creative download   |
| `markInstalled`      | ❌      | Mark installation complete |

**Additional Features:**

- [ ] Booking calendar view toggle
- [ ] Deadline countdown timer
- [ ] Installation checklist with tips
- [ ] Photo upload with GPS validation
- [ ] Auto-save verification draft

---

### 4. Earnings (`/earnings`)

**Purpose:** Financial dashboard showing earnings and payout management.

#### Implementation Checklist

**Main Page (`/earnings`):**

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

**Additional Features:**

- [ ] Monthly earnings breakdown chart
- [ ] Revenue by space comparison
- [ ] Tax document generation (1099-K)
- [ ] Payout schedule settings
- [ ] Earning projections/forecast
- [ ] Failed payout notifications

**Mutations:**

| Mutation                     | Status | Purpose                 |
|------------------------------|--------|-------------------------|
| `connectStripeAccount`       | ❌      | Start Stripe onboarding |
| `refreshStripeAccountStatus` | ❌      | Update account health   |
| `retryPayout`                | ❌      | Retry failed payout     |

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

**GraphQL Migration:**

- [ ] Create analytics query aggregating from `mySpaces`, `myBookingsAsOwner`, `myPayouts`
- [ ] Add backend support for aggregated metrics (views, occupancy calculations)
- [ ] Implement date range filtering

**Additional Features:**

- [ ] Date range picker (custom range)
- [ ] Export reports to PDF
- [ ] Competitor benchmarking (anonymous)
- [ ] Goal setting and tracking
- [ ] Seasonal trend predictions
- [ ] Recommendations engine

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

**Data Requirements:**

```graphql
query CalendarData($start: DateTime!, $end: DateTime!) {
    mySpaces {
        nodes {
            id
            title
            bookings(where: {
                startDate: { lte: $end }
                endDate: { gte: $start }
            }) {
                nodes {
                    id
                    status
                    startDate
                    endDate
                }
            }
        }
    }
}
```

**Additional Features:**

- [ ] Sync with Google Calendar
- [ ] iCal export
- [ ] Recurring availability patterns
- [ ] Holiday markers
- [ ] Pricing calendar (dynamic pricing)

---

### 7. Messages (`/messages`)

**Purpose:** Communication with advertisers about bookings.

#### Implementation Checklist

**Conversation List:**

- [ ] List of all conversations
- [ ] Unread indicators
- [ ] Last message preview
- [ ] Booking context link
- [ ] Advertiser avatar and name
- [ ] Search conversations
- [ ] Sort by recent/unread

**Conversation Detail (`/messages/[id]`):**

- [ ] Message thread display
- [ ] Send message input
- [ ] Image attachments
- [ ] Booking reference card
- [ ] Real-time updates (subscription)
- [ ] Read receipts
- [ ] Typing indicators

**GraphQL Operations:**

```graphql
query MyConversations {
    myConversations(first: 20, order: { updatedAt: DESC }) {
        nodes {
            id
            booking { id, space { title } }
            participants { user { name, avatar } }
            messages(first: 1, order: { createdAt: DESC }) {
                nodes { content, createdAt }
            }
        }
    }
    unreadConversationsCount
}

query ConversationMessages($id: ID!) {
    messagesByConversation(conversationId: $id, first: 50) {
        nodes {
            id
            content
            attachments
            createdAt
            senderUser { id, name, avatar }
            type
        }
    }
}

mutation SendMessage($input: SendMessageInput!) {
    sendMessage(input: $input) {
        message { id, content, createdAt }
        errors { ... }
    }
}

subscription OnMessage($conversationId: ID!) {
    onMessage(conversationId: $conversationId) {
        id
        content
        createdAt
        senderUser { id, name }
    }
}
```

**Mutations:**

| Mutation                    | Status | Purpose             |
|-----------------------------|--------|---------------------|
| `sendMessage`               | ❌      | Send a message      |
| `markConversationRead`      | ❌      | Mark thread as read |
| `createBookingConversation` | ❌      | Start conversation  |

**Subscriptions:**

| Subscription | Status | Purpose            |
|--------------|--------|--------------------|
| `onMessage`  | ❌      | Real-time messages |

**Additional Features:**

- [ ] Message templates (quick replies)
- [ ] File sharing (PDFs, documents)
- [ ] Voice messages
- [ ] Message reactions
- [ ] Archive conversations

---

### 8. Profile (`/profile`)

**Purpose:** Public-facing profile page showing owner information.

#### Implementation Checklist

**Core Components:**

- [x] Profile card (avatar, name, stats)
- [x] About section (business info)
- [x] Reviews section with pagination
- [x] Real GraphQL query (`me`)
- [x] Fragment colocation pattern
- [x] Loading skeleton

**Profile Card:**

- [x] Avatar with fallback
- [x] Name display
- [x] Verification badge
- [x] Total reviews count
- [x] Average rating with stars
- [x] Years hosting

**About Section:**

- [x] Business name
- [x] Business type
- [x] Verification status
- [x] Space count

**Reviews Section:**

- [x] Paginated reviews (3 per page)
- [x] Review cards with rating, comment, date
- [x] Navigation arrows

**Additional Features:**

- [ ] Edit profile link to settings
- [ ] Share profile button
- [ ] Response rate metric
- [ ] Response time metric
- [ ] Featured spaces showcase
- [ ] Advertiser testimonials

---

### 9. Settings (`/settings`)

**Purpose:** Account and business settings management.

#### Implementation Checklist

**Profile Tab:**

- [x] Name field
- [x] Email field (read-only)
- [x] Phone field
- [x] Avatar display
- [ ] Avatar upload
- [ ] Save changes button
- [ ] `updateCurrentUser` mutation

**Business Tab:**

- [x] Business name field
- [x] Business type selector
- [x] Payout schedule selector (Weekly, Biweekly, Monthly)
- [ ] Save changes button
- [ ] `updateSpaceOwnerProfile` mutation

**Payout Tab:**

- [x] Stripe Connect status display
- [ ] Bank account info (masked)
- [ ] Connect/Reconnect Stripe button
- [ ] Disconnect Stripe button
- [ ] View Stripe Dashboard link
- [ ] `connectStripeAccount` mutation
- [ ] `refreshStripeAccountStatus` mutation

**Notifications Tab:**

- [x] Notification type toggles
- [x] In-app, Email, Push columns
- [ ] Save preferences
- [ ] `updateNotificationPreference` mutation

**Notification Types for Space Owners:**

| Type              | Description                  |
|-------------------|------------------------------|
| BOOKING_REQUESTED | New booking request received |
| BOOKING_APPROVED  | Booking was approved         |
| BOOKING_REJECTED  | Booking was rejected         |
| BOOKING_CANCELLED | Booking was cancelled        |
| PAYMENT_RECEIVED  | Payment confirmation         |
| PAYOUT_PROCESSED  | Payout completed             |
| PROOF_APPROVED    | Verification approved        |
| PROOF_DISPUTED    | Verification disputed        |
| PROOF_REJECTED    | Verification rejected        |
| DISPUTE_FILED     | Dispute opened               |
| DISPUTE_RESOLVED  | Dispute resolved             |
| MESSAGE_RECEIVED  | New message                  |
| SPACE_APPROVED    | Space listing approved       |
| SPACE_REJECTED    | Space listing rejected       |
| SPACE_SUSPENDED   | Space listing suspended      |

**Additional Features:**

- [ ] Account deletion with confirmation
- [ ] Data export (GDPR compliance)
- [ ] Two-factor authentication
- [ ] Login history
- [ ] Connected devices management

---

## GraphQL Reference

### Queries

| Query                        | Returns                           | Purpose                             | Implemented |
|------------------------------|-----------------------------------|-------------------------------------|-------------|
| `me`                         | User                              | Current user with spaceOwnerProfile | ✅           |
| `mySpaces`                   | MySpacesConnection                | Owner's spaces                      | ✅           |
| `spaceById(id)`              | Space                             | Single space details                | ✅           |
| `myBookingsAsOwner`          | MyBookingsAsOwnerConnection       | Bookings on owner's spaces          | ✅           |
| `bookingById(id)`            | Booking                           | Single booking details              | ❌           |
| `incomingBookingRequests`    | IncomingBookingRequestsConnection | Pending approval queue              | ❌           |
| `bookingsRequiringAction`    | BookingsRequiringActionConnection | Bookings needing owner action       | ❌           |
| `earningsSummary`            | EarningsSummary                   | Financial summary                   | ✅           |
| `myPayouts`                  | MyPayoutsConnection               | Payout history                      | ✅           |
| `payoutById(id)`             | Payout                            | Single payout details               | ❌           |
| `myConversations`            | MyConversationsConnection         | Message threads                     | ❌           |
| `messagesByConversation(id)` | MessagesByConversationConnection  | Messages in thread                  | ❌           |
| `unreadConversationsCount`   | Int                               | Unread message count                | ❌           |
| `myNotifications`            | MyNotificationsConnection         | User notifications                  | ❌           |
| `unreadNotificationsCount`   | Int                               | Unread notification count           | ❌           |
| `myNotificationPreferences`  | [NotificationPreference]          | Notification settings               | ❌           |
| `reviewsBySpace(spaceId)`    | ReviewsBySpaceConnection          | Reviews for a space                 | ✅           |
| `transactionsByBooking(id)`  | TransactionsByBookingConnection   | Financial transactions              | ❌           |

### Mutations

| Mutation                       | Purpose                        | Implemented |
|--------------------------------|--------------------------------|-------------|
| `createSpace`                  | Create new space               | ❌           |
| `updateSpace`                  | Edit space details             | ❌           |
| `deactivateSpace`              | Set space inactive             | ❌           |
| `reactivateSpace`              | Reactivate space               | ❌           |
| `deleteSpace`                  | Remove space                   | ❌           |
| `approveBooking`               | Accept booking request         | ❌           |
| `rejectBooking`                | Decline booking request        | ❌           |
| `cancelBooking`                | Cancel booking                 | ❌           |
| `markFileDownloaded`           | Record creative download       | ❌           |
| `markInstalled`                | Mark installation complete     | ❌           |
| `updateSpaceOwnerProfile`      | Update business info           | ❌           |
| `updateCurrentUser`            | Update profile info            | ❌           |
| `connectStripeAccount`         | Start Stripe onboarding        | ❌           |
| `refreshStripeAccountStatus`   | Update Stripe status           | ❌           |
| `retryPayout`                  | Retry failed payout            | ❌           |
| `sendMessage`                  | Send message                   | ❌           |
| `markConversationRead`         | Mark thread as read            | ❌           |
| `createBookingConversation`    | Start conversation for booking | ❌           |
| `updateNotificationPreference` | Toggle notification            | ❌           |
| `markNotificationRead`         | Mark notification as read      | ❌           |
| `markAllNotificationsRead`     | Mark all as read               | ❌           |
| `deleteNotification`           | Delete a notification          | ❌           |

### Subscriptions

| Subscription                 | Purpose                     | Implemented |
|------------------------------|-----------------------------|-------------|
| `onBookingUpdate(bookingId)` | Real-time booking changes   | ❌           |
| `onMessage(conversationId)`  | Real-time messages          | ❌           |
| `onNotification(userId)`     | Real-time notifications     | ❌           |
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

**SpaceType Enum:**

- STOREFRONT
- WINDOW_DISPLAY
- BILLBOARD
- DIGITAL_DISPLAY
- VEHICLE_WRAP
- TRANSIT
- OTHER

**SpaceStatus Enum:**

- ACTIVE
- INACTIVE
- PENDING_APPROVAL
- REJECTED
- SUSPENDED

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

**BookingStatus Enum:**

- PENDING_APPROVAL
- APPROVED
- PAID
- FILE_DOWNLOADED
- INSTALLED
- VERIFIED
- COMPLETED
- DISPUTED
- REJECTED
- CANCELLED

### Payout

| Field            | Type         | Description                             |
|------------------|--------------|-----------------------------------------|
| id               | UUID         | Unique identifier                       |
| amount           | Decimal      | Payout amount                           |
| stage            | PayoutStage  | STAGE1 (install fee) or STAGE2 (rental) |
| status           | PayoutStatus | PENDING, PROCESSING, COMPLETED, FAILED  |
| stripeTransferId | String?      | Stripe reference                        |
| processedAt      | DateTime?    | When processed                          |
| failureReason    | String?      | If failed                               |
| attemptCount     | Int          | Retry count                             |

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

Follow the established pattern in `/profile`:

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

---

## Implementation Priority

### Phase 1: Core Mutations (Critical Path)

1. Space mutations (create, update, delete)
2. Booking actions (approve, reject, mark downloaded/installed)
3. Settings mutations (profile, business)

### Phase 2: GraphQL Migration

1. Overview → Replace all mock data with real queries
2. Analytics → Build aggregation queries
3. Bookings → Enable filtering, remove mock fallback

### Phase 3: Communication

1. Messages (conversation list, thread view)
2. Real-time subscriptions
3. Notification preferences

### Phase 4: Advanced Features

1. Calendar view
2. Stripe Connect integration
3. Export functionality

### Phase 5: Polish

1. Empty states refinement
2. Error handling improvements
3. Performance optimization