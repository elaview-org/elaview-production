# Space Owner Dashboard Implementation Guide

This document serves as the comprehensive reference for implementing the Space Owner dashboard in the Elaview web
client.

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
├── overview/
│   └── page.tsx                  # Dashboard landing page
├── listings/
│   ├── page.tsx                  # Space listings grid
│   ├── new/
│   │   └── page.tsx              # Create new space form
│   └── [id]/
│       ├── page.tsx              # Space detail view
│       └── edit/
│           └── page.tsx          # Edit space form
├── bookings/
│   ├── page.tsx                  # Bookings list with filters
│   └── [id]/
│       └── page.tsx              # Booking detail with timeline
├── earnings/
│   ├── page.tsx                  # Earnings dashboard
│   └── payouts/
│       └── page.tsx              # Payout history
├── analytics/
│   └── page.tsx                  # Performance analytics
├── calendar/
│   └── page.tsx                  # Availability calendar
├── messages/
│   └── page.tsx                  # Conversation threads
├── profile/
│   ├── page.tsx                  # Public profile view
│   ├── loading.tsx               # Route-level skeleton
│   ├── profile-card.tsx          # Avatar, stats card
│   ├── about-section.tsx         # Business info section
│   ├── reviews-section.tsx       # Reviews carousel
│   └── review-card.tsx           # Individual review card
└── settings/
    └── page.tsx                  # Account settings
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

## Route Specifications

### 1. Overview (`/overview`)

**Purpose:** At-a-glance dashboard showing key metrics and pending actions.

**Data Requirements:**

- `earningsSummary` - Available balance, pending payouts, monthly earnings
- `mySpaces(first: 5)` - Quick access to top spaces
- `incomingBookingRequests(first: 5)` - Pending requests requiring action
- `myBookingsAsOwner(first: 5, where: { status: { in: [PAID, FILE_DOWNLOADED, INSTALLED] } })` - Active bookings

**UI Components:**

- Section cards displaying: Total Earnings, Pending Payouts, Active Bookings, Total Spaces
- Interactive area chart showing earnings over time
- Data table with recent booking activity
- Quick action cards for pending requests

**GraphQL Queries:**

- `earningsSummary` (EarningsSummary type)
- `mySpaces` (MySpacesConnection)
- `incomingBookingRequests` (IncomingBookingRequestsConnection)

---

### 2. Listings (`/listings`)

**Purpose:** Manage all advertising spaces owned by the user.

**Files:**

```
listings/
├── page.tsx              # Grid of space cards
├── loading.tsx           # Route-level skeleton
├── toolbar.tsx           # Search, filters, "New Space" button
├── page-nav.tsx          # Pagination
├── space-card.tsx        # Card component with fragment
├── create-space.tsx      # Modal wizard for creating spaces
├── constants.ts          # STEPS, SPACE_TYPES, DIMENSION_UNITS, STATUS_INDICATORS, TYPE_LABELS
└── [id]/
    ├── page.tsx          # Space detail with inline editing
    ├── loading.tsx       # Route-level skeleton
    ├── header.tsx        # Title + status badge
    ├── gallery.tsx       # Photo grid with file picker
    ├── details.tsx       # Editable form fields
    └── performance.tsx   # Read-only stats
```

**Query:**

```graphql
query SpaceOwnerListings {
  mySpaces {
    nodes {
      id
      ...SpaceCard_SpaceFragment
    }
  }
}
```

**UI Components:**

- Toolbar with "New Space" button (opens modal)
- Grid of space cards (thumbnail, title, type, location, status indicator)
- Empty state with CTA to create first listing
- Pagination

#### 2a. Create Space (Modal)

**Purpose:** Multi-step modal wizard to create a new advertising space.

**Component:** `create-space.tsx` (client component)

**Steps:**

1. Photos - Upload 1-5 photos, first is cover
2. Details - Space type, title, description
3. Location - Address fields + map preview
4. Pricing - Daily rate, dimensions, booking duration
5. Preview - Review all fields before publishing

**Form Fields:**

| Field       | Type           | Required | Step     |
|-------------|----------------|----------|----------|
| images      | string[]       | No       | Photos   |
| type        | SpaceType enum | Yes      | Details  |
| title       | string         | Yes      | Details  |
| description | string         | No       | Details  |
| address     | string         | Yes      | Location |
| city        | string         | Yes      | Location |
| state       | string         | Yes      | Location |
| zipCode     | string         | No       | Location |
| pricePerDay | decimal        | Yes      | Pricing  |
| width       | float          | No       | Pricing  |
| height      | float          | No       | Pricing  |
| minDuration | int            | Yes      | Pricing  |
| maxDuration | int            | No       | Pricing  |

**Mutation:**

- `createSpace(input: CreateSpaceInput!)` - Returns CreateSpacePayload

#### 2b. Space Detail (`/listings/[id]`)

**Purpose:** View and edit space details inline.

**Pattern:** Server component page with client component children for interactivity.

**Query:**

```graphql
query SpaceDetail($id: ID!) {
  spaceById(id: $id) {
    id
    ...Header_SpaceFragment
    ...Gallery_SpaceFragment
    ...Details_SpaceFragment
    ...Performance_SpaceFragment
  }
}
```

**Layout:**

- Header: Back button, title, status badge
- Gallery + Performance: Side by side (2 columns on lg)
- Details: Full-width editable form

**Components:**

| Component       | Type   | Purpose                                      |
|-----------------|--------|----------------------------------------------|
| header.tsx      | Server | Title, status badge, back navigation         |
| gallery.tsx     | Client | Photo grid with file picker, add/remove      |
| details.tsx     | Client | Editable form with all space fields          |
| performance.tsx | Server | Read-only stats (bookings, revenue, rating)  |

**Editable Fields (in details.tsx):**

- type, description, address, city, state, zipCode, traffic
- pricePerDay, installationFee, width, height
- minDuration, maxDuration

**Mutation:**

- `updateSpace(id: ID!, input: UpdateSpaceInput!)` - Partial update

---

### 3. Bookings (`/bookings`)

**Purpose:** Manage all bookings for owned spaces.

**Data Requirements:**

- `myBookingsAsOwner` with pagination and status filtering
- `incomingBookingRequests` for pending approval queue

**Booking Statuses:**

| Status           | Description                | Owner Actions              |
|------------------|----------------------------|----------------------------|
| PENDING_APPROVAL | Awaiting owner decision    | Accept, Reject             |
| APPROVED         | Accepted, awaiting payment | Cancel                     |
| PAID             | Payment received           | Download File              |
| FILE_DOWNLOADED  | Creative downloaded        | Mark Installed             |
| INSTALLED        | Installation complete      | Upload Verification        |
| VERIFIED         | Proof submitted            | None (awaiting advertiser) |
| COMPLETED        | Fully complete             | None                       |
| DISPUTED         | Under dispute              | Respond to dispute         |
| REJECTED         | Owner declined             | None                       |
| CANCELLED        | Cancelled                  | None                       |

**Filter Tabs:**

- Incoming Requests (PENDING_APPROVAL)
- Active (PAID, FILE_DOWNLOADED, INSTALLED, VERIFIED)
- Completed (COMPLETED)
- All

**UI Components:**

- Booking card showing: space thumbnail, advertiser info, dates, status badge, action buttons
- Status timeline component
- Filter tabs with counts

**Mutations:**

- `approveBooking(input: ApproveBookingInput!)` - Accept request
- `rejectBooking(input: RejectBookingInput!)` - Decline with reason
- `cancelBooking(input: CancelBookingInput!)` - Cancel booking
- `markFileDownloaded(input: MarkFileDownloadedInput!)` - Record download
- `markInstalled(input: MarkInstalledInput!)` - Mark installation complete

#### 3a. Booking Detail (`/bookings/[id]`)

**Purpose:** Detailed view of a single booking with timeline and actions.

**Data Requirements:**

- `bookingById(id: ID!)` - Full booking with relations

**Sections:**

1. **Header:** Status badge, dates, space info
2. **Timeline:** Visual progress through booking lifecycle
3. **Campaign Info:** Advertiser details, campaign name, creative preview
4. **Space Info:** Quick reference to the booked space
5. **Financial Summary:** Price breakdown, payout amounts
6. **Actions:** Context-appropriate buttons based on status
7. **Verification Photos:** Display/upload verification proof
8. **Messages:** Link to conversation thread

**Status-Based Actions:**

| Status           | Primary Action      | Secondary Actions          |
|------------------|---------------------|----------------------------|
| PENDING_APPROVAL | Accept              | Reject, Message Advertiser |
| APPROVED         | None                | Cancel, Message            |
| PAID             | Download File       | Message                    |
| FILE_DOWNLOADED  | Mark Installed      | Message                    |
| INSTALLED        | Upload Verification | Message                    |
| VERIFIED         | None                | Message                    |
| DISPUTED         | Respond             | Message                    |

---

### 4. Earnings (`/earnings`)

**Purpose:** Financial dashboard showing earnings and payout management.

**Data Requirements:**

- `earningsSummary` - Aggregated financial data
- `myPayouts` - Payout history with pagination

**EarningsSummary Fields:**

- availableBalance: Funds ready for withdrawal
- pendingPayouts: Funds in escrow awaiting release
- thisMonthEarnings: Current month total
- lastMonthEarnings: Previous month total
- totalEarnings: Lifetime earnings

**Sections:**

1. **Balance Cards:** Available, Pending, This Month, Total
2. **Payout Chart:** Earnings over time (bar/line chart)
3. **Payout History Table:** List of all payouts with status
4. **Stripe Connect Status:** Account health indicator

**Payout Types:**

- STAGE1: Print + installation fee (released on file download)
- STAGE2: Rental fee (released on verification approval)

**Payout Statuses:**

- PENDING: Awaiting processing
- PROCESSING: Transfer initiated
- COMPLETED: Successfully paid
- FAILED: Transfer failed
- PARTIALLY_PAID: Partial amount transferred

**UI Components:**

- Balance summary cards
- Area/bar chart for earnings visualization
- Data table with payout history
- Stripe account status indicator with link to Stripe Dashboard

**Mutations:**

- `connectStripeAccount` - Initiate Stripe Connect onboarding
- `refreshStripeAccountStatus` - Update account health

#### 4a. Payout History (`/earnings/payouts`)

**Purpose:** Detailed transaction history with filters.

**Data Requirements:**

- `myPayouts` with filters for stage, status, date range

**Table Columns:**

- Date, Booking Reference, Space, Amount, Stage (1 or 2), Status, Actions

---

### 5. Analytics (`/analytics`)

**Purpose:** Performance insights for spaces and bookings.

**Data Requirements:**

- `mySpaces` with totalBookings, totalRevenue, averageRating per space
- Booking trends over time (aggregated from bookings)

**Metrics:**

- Total views per listing (requires backend support)
- Booking conversion rate
- Average booking duration
- Revenue by space
- Revenue by month
- Rating trends

**Charts:**

- Line chart: Bookings over time
- Bar chart: Revenue by space
- Pie chart: Booking status distribution
- Heatmap: Popular booking periods

---

### 6. Calendar (`/calendar`)

**Purpose:** Visual availability and booking management.

**Data Requirements:**

- `mySpaces` - All spaces for multi-calendar view
- `myBookingsAsOwner` - All bookings to display on calendar

**Features:**

- Month/week/day views
- Color-coded by space or status
- Click to view booking details
- Drag to block dates (availability management)
- Filter by space

**Calendar Events:**

- Booked periods (by status color)
- Blocked dates (owner unavailability)
- Installation deadlines

---

### 7. Messages (`/messages`)

**Purpose:** Communication with advertisers about bookings.

**Data Requirements:**

- `myConversations` - All conversation threads
- `messagesByConversation(conversationId: ID!)` - Messages in a thread
- `unreadConversationsCount` - Badge count

**Features:**

- Conversation list with unread indicators
- Real-time updates via subscription
- Attach images to messages
- Link conversations to specific bookings

**Mutations:**

- `sendMessage(input: SendMessageInput!)` - Send a message
- `markConversationRead(input: MarkConversationReadInput!)` - Clear unread

**Subscriptions:**

- `onMessage(conversationId: ID!)` - Real-time message updates

---

### 8. Profile (`/profile`)

**Purpose:** Public-facing profile page showing owner information.

**Current Implementation:** Complete with fragment colocation pattern.

**Sections:**

1. **Profile Card:** Avatar, name, verification badge, stats (reviews, rating, years hosting)
2. **About Section:** Business name, business type, verification status, space count
3. **Reviews Section:** Paginated reviews from advertisers

**Fragments:**

- `ProfileCard_UserFragment`
- `AboutSection_UserFragment`
- `ReviewsSection_UserFragment`
- `ReviewCard_ReviewFragment`

---

### 9. Settings (`/settings`)

**Purpose:** Account and business settings management.

**Tabs:**

#### Profile Tab

- Name, email, phone, avatar
- Uses `updateCurrentUser(input: UpdateCurrentUserInput!)`

#### Business Tab

- Business name, business type, payout schedule
- Uses `updateSpaceOwnerProfile(input: UpdateSpaceOwnerProfileInput!)`

**SpaceOwnerProfile Editable Fields:**

- businessName: string
- businessType: string
- payoutSchedule: WEEKLY | BIWEEKLY | MONTHLY

#### Payout Tab

- Stripe Connect account status
- Bank account information (via Stripe)
- Connect/disconnect Stripe account

#### Notifications Tab

- `myNotificationPreferences` - Current preferences
- `updateNotificationPreference(input: UpdateNotificationPreferenceInput!)` - Toggle preferences

**Notification Types for Space Owners:**

- BOOKING_REQUESTED - New booking request
- PAYMENT_RECEIVED - Payment confirmation
- PROOF_APPROVED - Verification approved
- PROOF_DISPUTED - Verification disputed
- PROOF_REJECTED - Verification rejected
- DISPUTE_FILED - Dispute opened
- DISPUTE_RESOLVED - Dispute resolved
- MESSAGE_RECEIVED - New message
- PAYOUT_PROCESSED - Payout completed

---

## GraphQL Reference

### Queries for Space Owners

| Query                        | Returns                           | Purpose                             |
|------------------------------|-----------------------------------|-------------------------------------|
| `me`                         | User                              | Current user with spaceOwnerProfile |
| `mySpaces`                   | MySpacesConnection                | Owner's spaces                      |
| `spaceById(id)`              | Space                             | Single space details                |
| `myBookingsAsOwner`          | MyBookingsAsOwnerConnection       | Bookings on owner's spaces          |
| `bookingById(id)`            | Booking                           | Single booking details              |
| `incomingBookingRequests`    | IncomingBookingRequestsConnection | Pending approval queue              |
| `earningsSummary`            | EarningsSummary                   | Financial summary                   |
| `myPayouts`                  | MyPayoutsConnection               | Payout history                      |
| `myConversations`            | MyConversationsConnection         | Message threads                     |
| `messagesByConversation(id)` | MessagesByConversationConnection  | Messages in thread                  |
| `myNotificationPreferences`  | [NotificationPreference]          | Notification settings               |
| `reviewsBySpace(spaceId)`    | ReviewsBySpaceConnection          | Reviews for a space                 |

### Mutations for Space Owners

| Mutation                       | Purpose                    |
|--------------------------------|----------------------------|
| `createSpace`                  | Create new space           |
| `updateSpace`                  | Edit space details         |
| `deactivateSpace`              | Set space inactive         |
| `reactivateSpace`              | Reactivate space           |
| `deleteSpace`                  | Remove space               |
| `approveBooking`               | Accept booking request     |
| `rejectBooking`                | Decline booking request    |
| `cancelBooking`                | Cancel booking             |
| `markFileDownloaded`           | Record creative download   |
| `markInstalled`                | Mark installation complete |
| `updateSpaceOwnerProfile`      | Update business info       |
| `updateCurrentUser`            | Update profile info        |
| `connectStripeAccount`         | Start Stripe onboarding    |
| `refreshStripeAccountStatus`   | Update Stripe status       |
| `sendMessage`                  | Send message               |
| `markConversationRead`         | Mark thread as read        |
| `updateNotificationPreference` | Toggle notification        |

### Subscriptions

| Subscription                 | Purpose                     |
|------------------------------|-----------------------------|
| `onBookingUpdate(bookingId)` | Real-time booking changes   |
| `onMessage(conversationId)`  | Real-time messages          |
| `onNotification(userId)`     | Real-time notifications     |
| `onProofUpdate(bookingId)`   | Verification status changes |

---

## Data Types Reference

### Space

| Field                         | Type        | Description                                             |
|-------------------------------|-------------|---------------------------------------------------------|
| id                            | UUID        | Unique identifier                                       |
| title                         | String      | Display name                                            |
| description                   | String?     | Detailed description                                    |
| type                          | SpaceType   | STOREFRONT, WINDOW_DISPLAY, etc.                        |
| status                        | SpaceStatus | ACTIVE, INACTIVE, PENDING_APPROVAL, REJECTED, SUSPENDED |
| address, city, state, zipCode | String      | Location                                                |
| latitude, longitude           | Float       | Coordinates                                             |
| pricePerDay                   | Decimal     | Daily rate                                              |
| installationFee               | Decimal?    | Custom installation fee                                 |
| minDuration, maxDuration      | Int         | Booking duration limits                                 |
| availableFrom, availableTo    | DateTime?   | Availability window                                     |
| dimensions, dimensionsText    | String?     | Size specifications                                     |
| width, height                 | Float?      | Dimensions in inches                                    |
| traffic                       | String?     | Foot traffic info                                       |
| images                        | [String]    | Image URLs                                              |
| averageRating                 | Float?      | Computed rating                                         |
| totalBookings                 | Int         | Booking count                                           |
| totalRevenue                  | Decimal     | Lifetime revenue                                        |
| rejectionReason               | String?     | If rejected by admin                                    |

### Booking

| Field              | Type            | Description             |
|--------------------|-----------------|-------------------------|
| id                 | UUID            | Unique identifier       |
| status             | BookingStatus   | Current lifecycle stage |
| startDate, endDate | DateTime        | Booking period          |
| totalDays          | Int             | Duration                |
| pricePerDay        | Decimal         | Agreed rate             |
| installationFee    | Decimal         | Installation cost       |
| subtotalAmount     | Decimal         | Before fees             |
| platformFeeAmount  | Decimal         | Platform cut            |
| platformFeePercent | Decimal         | Fee percentage          |
| ownerPayoutAmount  | Decimal         | Owner's total           |
| totalAmount        | Decimal         | Advertiser pays         |
| advertiserNotes    | String?         | From advertiser         |
| ownerNotes         | String?         | From owner              |
| fileDownloadedAt   | DateTime?       | When downloaded         |
| rejectedAt         | DateTime?       | When rejected           |
| rejectionReason    | String?         | Why rejected            |
| cancelledAt        | DateTime?       | When cancelled          |
| cancellationReason | String?         | Why cancelled           |
| space              | Space           | Booked space            |
| campaign           | Campaign        | Advertiser's campaign   |
| proof              | BookingProof?   | Verification submission |
| dispute            | BookingDispute? | If disputed             |
| payments           | [Payment]       | Payment records         |
| payouts            | [Payout]        | Payout records          |
| reviews            | [Review]        | Associated reviews      |

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

| Field               | Type             | Description               |
|---------------------|------------------|---------------------------|
| id                  | UUID             | Unique identifier         |
| businessName        | String?          | Business name             |
| businessType        | String?          | Type of business          |
| payoutSchedule      | PayoutSchedule   | WEEKLY, BIWEEKLY, MONTHLY |
| onboardingComplete  | Boolean          | Setup finished            |
| stripeAccountId     | String?          | Stripe Connect ID         |
| stripeAccountStatus | String?          | Account health            |
| spaces              | SpacesConnection | Owner's spaces            |
| payouts             | [Payout]         | All payouts               |

---

## Implementation Patterns

### Server Component with Fragment Colocation

Follow the established pattern in `/profile`:

1. Define fragments in child components
2. Parent page composes fragments into single query
3. Pass fragment-typed data to children
4. Children unmask with `getFragmentData()`

### Query File Pattern

For complex pages, create a separate queries file:

```
feature/
├── page.tsx
├── feature-queries.ts    # Export async query functions
├── feature-content.tsx   # Main content component
└── sub-component.tsx     # Child components
```

### Client Components

Only use `"use client"` when necessary:

- useState, useEffect, useContext hooks
- Event handlers (onClick, onChange)
- Browser APIs
- Third-party client libraries

### Loading States

Create `loading.tsx` files for route-level skeletons. Export skeleton components from the same file as the component for
reuse.

### Error Handling

Use try/catch with redirect to `/logout` for auth errors. Display inline errors for form submissions using ActionState
pattern.

---

## Implementation Priority

### Phase 1: Core Functionality

1. Listings (create, edit, view, manage)
2. Bookings (list, detail, accept/reject)
3. Settings (profile, business, notifications)

### Phase 2: Financial

1. Earnings dashboard
2. Payout history
3. Stripe Connect integration

### Phase 3: Communication

1. Messages (conversation list, thread view)
2. Real-time subscriptions

### Phase 4: Insights

1. Analytics
2. Calendar view

### Phase 5: Polish

1. Overview dashboard with real data
2. Empty states and loading skeletons
3. Error handling refinement