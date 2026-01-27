# Advertiser Dashboard Implementation Guide

Comprehensive reference for implementing the Advertiser dashboard in the Elaview web client.

## Overview

The Advertiser dashboard is a parallel route (`@advertiser`) within the `(dashboard)` route group. It renders when a
user with `role: USER` has `activeProfileType: ADVERTISER`. The dashboard enables advertisers to discover ad spaces,
manage campaigns, track bookings, and handle payments.

## Architecture

### Route Structure

```
app/(dashboard)/@advertiser/
├── default.ts                    # Required parallel route default
├── navigation-bar.data.ts        # Sidebar navigation configuration
├── overview/                     # Dashboard landing page
├── discover/                     # Space discovery with map/grid views
│   ├── @grid/                    # Grid view (parallel route)
│   └── @map/                     # Map view (parallel route)
├── campaigns/                    # Campaign management
│   └── [id]/                     # Campaign detail view
├── bookings/                     # Booking management
│   └── [id]/                     # Booking detail view
├── spending/                     # Financial dashboard
├── analytics/                    # Campaign performance insights
├── messages/                     # Conversation threads
│   └── [id]/                     # Conversation detail
├── notifications/                # User notifications
├── profile/                      # Public profile view
└── settings/                     # Account settings
```

### Navigation Configuration

The sidebar navigation is defined in `navigation-bar.data.ts`:

| Section      | Items                                                                   |
|--------------|-------------------------------------------------------------------------|
| Quick Action | New Campaign                                                            |
| Main Nav     | Overview, Discover, Campaigns, Bookings, Spendings, Analytics, Messages |
| Documents    | Creative Guidelines, Booking FAQ, Billing FAQ, Platform Terms           |
| Secondary    | Help & Support, Terms of Service, Privacy Policy                        |

---

## Implementation Status

| Route     | Status        | Data Source    | Notes                                      |
|-----------|---------------|----------------|--------------------------------------------|
| Overview  | ❌ Not Started | —              | Under construction placeholder             |
| Discover  | ✅ Functional  | GraphQL        | Grid and map views working                 |
| Campaigns | ❌ Not Started | —              | Route not implemented                      |
| Bookings  | ⚠️ Partial    | GraphQL + Mock | List working, detail page needs mutations  |
| Spendings | ❌ Not Started | —              | Route not implemented                      |
| Analytics | ❌ Not Started | —              | Route not implemented                      |
| Messages  | ⚠️ Partial    | GraphQL        | Basic conversation list, needs detail view |
| Profile   | ❌ Not Started | —              | Under construction placeholder             |
| Settings  | ⚠️ Partial    | GraphQL        | Basic structure, needs mutations           |

---

## Route Specifications

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

**Data Requirements:**

```graphql
query AdvertiserOverview {
    myCampaigns(first: 5, where: { status: { eq: ACTIVE } }) {
        nodes { ...ActiveCampaignFragment }
    }
    myBookingsAsAdvertiser(
        first: 5
        where: { status: { in: [INSTALLED, VERIFIED] } }
    ) {
        nodes { ...PendingVerificationFragment }
    }
}
```

---

### 2. Discover (`/discover`)

**Purpose:** Find and browse available advertising spaces.

#### Implementation Checklist

**Main Page (`/discover`):**

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

**Grid View (`/discover/@grid`):**

- [x] Space cards with images
- [x] Price per day display
- [x] Space type badge
- [ ] Quick book button
- [ ] Favorite toggle

**Map View (`/discover/@map`):**

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

**Data Requirements:**

```graphql
query DiscoverSpaces($where: SpaceFilterInput, $first: Int) {
    spaces(first: $first, where: $where) {
        nodes {
            id
            title
            address
            city
            state
            latitude
            longitude
            pricePerDay
            type
            images
            averageRating
            totalBookings
        }
    }
}
```

---

### 3. Campaigns (`/campaigns`)

**Purpose:** Manage advertising campaigns and their associated bookings.

#### Implementation Checklist

**Main Page (`/campaigns`):**

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

**Mutations:**

| Mutation         | Status | Purpose               |
|------------------|--------|-----------------------|
| `createCampaign` | ❌      | Create new campaign   |
| `updateCampaign` | ❌      | Edit campaign details |
| `submitCampaign` | ❌      | Submit for booking    |
| `cancelCampaign` | ❌      | Cancel campaign       |
| `deleteCampaign` | ❌      | Remove draft campaign |

---

### 4. Bookings (`/bookings`)

**Purpose:** Manage all bookings across campaigns.

#### Implementation Checklist

**Main Page (`/bookings`):**

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

**Mutations:**

| Mutation              | Status | Purpose                |
|-----------------------|--------|------------------------|
| `createBooking`       | ❌      | Submit booking request |
| `cancelBooking`       | ❌      | Cancel booking         |
| `createPaymentIntent` | ❌      | Initiate payment       |
| `confirmPayment`      | ❌      | Complete payment       |

---

### 5. Spendings (`/spendings`)

**Purpose:** Track payments, invoices, and financial activity.

#### Implementation Checklist

**Main Page (`/spendings`):**

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

**Data Requirements:**

```graphql
query AdvertiserSpendings {
    myBookingsAsAdvertiser {
        nodes {
            id
            totalAmount
            campaign { id, name }
            payments {
                id
                amount
                status
                paidAt
            }
        }
    }
}
```

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

**GraphQL Migration:**

- [ ] Create analytics query aggregating from `myCampaigns`, `myBookingsAsAdvertiser`
- [ ] Implement date range filtering

**Additional Features:**

- [ ] Date range picker (custom range)
- [ ] Export reports to PDF
- [ ] Compare campaigns

---

### 7. Messages (`/messages`)

**Purpose:** Communication with space owners about bookings.

#### Implementation Checklist

**Conversation List:**

- [x] List of all conversations
- [x] Basic conversation display
- [ ] Unread indicators
- [ ] Last message preview
- [ ] Booking context link
- [ ] Owner avatar and name
- [ ] Search conversations
- [ ] Sort by recent/unread

**Conversation Detail (`/messages/[id]`):**

- [ ] Message thread display
- [ ] Send message input
- [ ] Image attachments
- [ ] Booking reference card
- [ ] Real-time updates (subscription)
- [ ] Read receipts

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

mutation SendMessage($input: SendMessageInput!) {
    sendMessage(input: $input) {
        message { id, content, createdAt }
        errors { ... }
    }
}
```

**Mutations:**

| Mutation                    | Status | Purpose             |
|-----------------------------|--------|---------------------|
| `sendMessage`               | ❌      | Send a message      |
| `markConversationRead`      | ❌      | Mark thread as read |
| `createBookingConversation` | ❌      | Start conversation  |

---

### 8. Profile (`/profile`)

**Purpose:** Public-facing profile page showing advertiser information.

#### Implementation Checklist

**Core Components:**

- [ ] Profile card (avatar, name, company)
- [ ] About section (company info)
- [ ] Real GraphQL query (`me`)
- [ ] Loading skeleton

**Profile Card:**

- [ ] Avatar with fallback
- [ ] Name display
- [ ] Company name
- [ ] Industry
- [ ] Member since

**About Section:**

- [ ] Company name
- [ ] Industry
- [ ] Website link
- [ ] Campaign count

---

### 9. Settings (`/settings`)

**Purpose:** Account and company settings management.

#### Implementation Checklist

**Profile Tab:**

- [x] Name field
- [x] Email field (read-only)
- [x] Phone field
- [ ] Avatar upload
- [ ] Save changes button
- [ ] `updateCurrentUser` mutation

**Company Tab:**

- [ ] Company name field
- [ ] Industry selector
- [ ] Website field
- [ ] Save changes button
- [ ] `updateAdvertiserProfile` mutation

**Payment Tab:**

- [ ] Saved payment methods
- [ ] Add card (Stripe Elements)
- [ ] Set default card
- [ ] Remove card

**Notifications Tab:**

- [ ] Notification type toggles
- [ ] In-app, Email, Push columns
- [ ] Save preferences
- [ ] `updateNotificationPreference` mutation

**Notification Types for Advertisers:**

| Type              | Description                |
|-------------------|----------------------------|
| BOOKING_APPROVED  | Booking request accepted   |
| BOOKING_REJECTED  | Booking request declined   |
| BOOKING_CANCELLED | Booking was cancelled      |
| PAYMENT_RECEIVED  | Payment confirmation       |
| PAYMENT_REMINDER  | Payment due reminder       |
| PROOF_UPLOADED    | Verification photos ready  |
| PROOF_APPROVED    | Verification auto-approved |
| DISPUTE_FILED     | Dispute opened             |
| DISPUTE_RESOLVED  | Dispute resolved           |
| MESSAGE_RECEIVED  | New message                |
| REFUND_PROCESSED  | Refund completed           |

---

## GraphQL Reference

### Queries

| Query                        | Returns                          | Purpose                             | Implemented |
|------------------------------|----------------------------------|-------------------------------------|-------------|
| `me`                         | User                             | Current user with advertiserProfile | ✅           |
| `spaces`                     | SpacesConnection                 | Browse available spaces             | ✅           |
| `spaceById(id)`              | Space                            | Single space details                | ✅           |
| `myCampaigns`                | MyCampaignsConnection            | Advertiser's campaigns              | ❌           |
| `campaignById(id)`           | Campaign                         | Single campaign details             | ❌           |
| `myBookingsAsAdvertiser`     | MyBookingsAsAdvertiserConnection | Advertiser's bookings               | ✅           |
| `bookingById(id)`            | Booking                          | Single booking details              | ❌           |
| `myConversations`            | MyConversationsConnection        | Message threads                     | ⚠️          |
| `messagesByConversation(id)` | MessagesByConversationConnection | Messages in thread                  | ❌           |
| `unreadConversationsCount`   | Int                              | Unread message count                | ❌           |
| `myNotifications`            | MyNotificationsConnection        | User notifications                  | ❌           |
| `unreadNotificationsCount`   | Int                              | Unread notification count           | ❌           |
| `myNotificationPreferences`  | [NotificationPreference]         | Notification settings               | ❌           |
| `paymentsByBooking(id)`      | PaymentsByBookingConnection      | Payments for a booking              | ❌           |
| `transactionsByBooking(id)`  | TransactionsByBookingConnection  | Financial transactions              | ❌           |

### Mutations

| Mutation                       | Purpose                        | Implemented |
|--------------------------------|--------------------------------|-------------|
| `createCampaign`               | Create new campaign            | ❌           |
| `updateCampaign`               | Edit campaign details          | ❌           |
| `submitCampaign`               | Submit campaign for booking    | ❌           |
| `cancelCampaign`               | Cancel campaign                | ❌           |
| `deleteCampaign`               | Remove draft campaign          | ❌           |
| `createBooking`                | Submit booking request         | ❌           |
| `cancelBooking`                | Cancel booking                 | ❌           |
| `createPaymentIntent`          | Start payment                  | ❌           |
| `confirmPayment`               | Complete payment               | ❌           |
| `requestRefund`                | Request refund                 | ❌           |
| `updateAdvertiserProfile`      | Update company info            | ❌           |
| `updateCurrentUser`            | Update profile info            | ❌           |
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
| targetAudience    | String?           | Target audience description    |
| bookings          | [Booking]         | Associated bookings            |
| advertiserProfile | AdvertiserProfile | Owner profile                  |

**CampaignStatus Enum:**

- DRAFT
- SUBMITTED
- ACTIVE
- COMPLETED
- CANCELLED

### Booking (Advertiser Perspective)

| Field           | Type            | Description             |
|-----------------|-----------------|-------------------------|
| id              | UUID            | Unique identifier       |
| status          | BookingStatus   | Current lifecycle stage |
| startDate       | DateTime        | Start date              |
| endDate         | DateTime        | End date                |
| totalDays       | Int             | Duration                |
| pricePerDay     | Decimal         | Agreed rate             |
| installationFee | Decimal         | Installation cost       |
| totalAmount     | Decimal         | Total to pay            |
| advertiserNotes | String?         | Notes for owner         |
| space           | Space           | Booked space            |
| campaign        | Campaign        | Parent campaign         |
| proof           | BookingProof?   | Verification submission |
| dispute         | BookingDispute? | If disputed             |
| payments        | [Payment]       | Payment records         |

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

### AdvertiserProfile

| Field              | Type    | Description       |
|--------------------|---------|-------------------|
| id                 | UUID    | Unique identifier |
| companyName        | String? | Company name      |
| industry           | String? | Business industry |
| website            | String? | Company website   |
| onboardingComplete | Boolean | Setup finished    |

---

## Implementation Patterns

### Server Component with Fragment Colocation

Follow the established pattern from `@spaceOwner`:

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

### Payment Integration

For payment flows:

1. Create PaymentIntent via `createPaymentIntent` mutation
2. Use Stripe Elements for card input
3. Confirm payment via `confirmPayment` mutation
4. Handle success/failure states

---

## Implementation Priority

### Phase 1: Core Routes (Critical Path)

1. Overview → Basic dashboard with mock data
2. Campaigns → Create and manage campaigns
3. Spendings → Payment tracking

### Phase 2: Booking Flow

1. Discover → Add filters, space preview
2. Bookings → Complete booking actions (pay, approve, dispute)

### Phase 3: Analytics & Communication

1. Analytics → Campaign performance charts
2. Messages → Full conversation support
3. Settings → All tabs with mutations
4. Profile → Public profile view

### Phase 4: Advanced Features

1. Real-time subscriptions
2. Stripe payment integration
3. Export functionality

### Phase 5: Polish

1. Empty states refinement
2. Error handling improvements
3. Performance optimization