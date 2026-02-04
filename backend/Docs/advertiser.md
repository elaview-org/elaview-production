# Advertiser Domain

Backend reference for the advertiser side of the Elaview platform. Covers entities, services, GraphQL operations, and
business logic for campaigns, bookings, payments, and messaging.

---

## Overview

Advertisers discover physical ad spaces, create campaigns, book spaces, pay for placements, and review proof of
installation. The advertiser domain spans multiple features:

| Feature       | Directory                 | Purpose                          |
|---------------|---------------------------|----------------------------------|
| Campaigns     | `Features/Marketplace/`   | Campaign CRUD and lifecycle      |
| Bookings      | `Features/Marketplace/`   | Booking creation and tracking    |
| Payments      | `Features/Payments/`      | Payment intents and confirmation |
| Messaging     | `Features/Notifications/` | Conversations with space owners  |
| Notifications | `Features/Notifications/` | Real-time alerts                 |
| Reviews       | `Features/Marketplace/`   | Post-completion reviews          |

---

## Entities

### AdvertiserProfile

Extends `UserProfileBase`. Created when a user selects the Advertiser role.

**File:** `Data/Entities/AdvertiserProfile.cs`

| Field                | Type                   | Constraint     | Mutable |
|----------------------|------------------------|----------------|---------|
| Id                   | Guid                   | PK             | No      |
| CreatedAt            | DateTime               | Required       | No      |
| UserId               | Guid                   | FK, Unique     | No      |
| CompanyName          | string?                | MaxLength(255) | No      |
| Industry             | string?                | MaxLength(255) | No      |
| Website              | string?                | MaxLength(500) | No      |
| OnboardingComplete   | bool                   | Default: false | Yes     |
| Campaigns            | ICollection\<Campaign> | Nav (1:N)      | No      |

Inherited from `UserProfileBase`: `StripeAccountId`, `StripeAccountStatus`, `StripeLastAccountHealthCheck`,
`StripeAccountDisconnectedAt`, `StripeAccountDisconnectedNotifiedAt`.

### Campaign

**File:** `Data/Entities/Campaign.cs`

| Field                 | Type                   | Constraint      | Mutable |
|-----------------------|------------------------|-----------------|---------|
| Id                    | Guid                   | PK              | No      |
| CreatedAt             | DateTime               | Required        | No      |
| AdvertiserProfileId   | Guid                   | FK, Indexed     | Yes     |
| Name                  | string                 | MaxLength(500)  | No      |
| Description           | string?                | MaxLength(500)  | No      |
| ImageUrl              | string                 | MaxLength(1000) | No      |
| TargetAudience        | string?                | MaxLength(50)   | No      |
| Goals                 | string?                | MaxLength(50)   | No      |
| TotalBudget           | decimal?               | -               | No      |
| Status                | CampaignStatus         | Default: Draft  | Yes     |
| StartDate             | DateTime?              | -               | No      |
| EndDate               | DateTime?              | -               | No      |
| Bookings              | ICollection\<Booking>  | Nav (1:N)       | No      |

**CampaignStatus enum** (`Data/Entities/Enums.cs`):

```
Draft → Submitted → Active → Completed
                          ↘ Cancelled
```

| Value     | Description                    |
|-----------|--------------------------------|
| Draft     | Initial state, editable        |
| Submitted | Awaiting booking confirmations |
| Active    | Has active bookings            |
| Completed | All bookings finished          |
| Cancelled | Cancelled by advertiser        |

### Booking

**File:** `Data/Entities/Booking.cs`

| Field              | Type              | Constraint       | Mutable |
|--------------------|-------------------|------------------|---------|
| Id                 | Guid              | PK               | No      |
| CreatedAt          | DateTime          | Required         | No      |
| CampaignId         | Guid              | FK, Indexed      | No      |
| SpaceId            | Guid              | FK, Indexed      | No      |
| StartDate          | DateTime          | Required         | No      |
| EndDate            | DateTime          | Required         | No      |
| TotalDays          | int               | Computed         | No      |
| PricePerDay        | decimal           | Precision(10,2)  | No      |
| InstallationFee    | decimal           | Precision(10,2)  | No      |
| SubtotalAmount     | decimal           | Precision(10,2)  | No      |
| PlatformFeePercent | decimal           | Precision(5,2)   | No      |
| PlatformFeeAmount  | decimal           | Precision(10,2)  | No      |
| TotalAmount        | decimal           | Precision(10,2)  | No      |
| OwnerPayoutAmount  | decimal           | Precision(10,2)  | No      |
| Status             | BookingStatus     | Default: Pending | Yes     |
| AdvertiserNotes    | string?           | MaxLength(2000)  | No      |
| OwnerNotes         | string?           | MaxLength(2000)  | Yes     |
| FileDownloadedAt   | DateTime?         | -                | Yes     |
| CancellationReason | string?           | MaxLength(1000)  | Yes     |
| CancelledAt        | DateTime?         | -                | Yes     |
| CancelledByUserId  | Guid?             | FK               | Yes     |
| RejectionReason    | string?           | MaxLength(1000)  | Yes     |
| RejectedAt         | DateTime?         | -                | Yes     |
| UpdatedAt          | DateTime          | Required         | Yes     |
| Proof              | BookingProof?     | Nav (1:1)        | -       |
| Dispute            | BookingDispute?   | Nav (1:1)        | -       |
| Reviews            | ICollection       | Nav (1:N)        | -       |
| Payments           | ICollection       | Nav (1:N)        | -       |
| Payouts            | ICollection       | Nav (1:N)        | -       |

**BookingStatus enum**:

```
PendingApproval → Approved → Paid → FileDownloaded → Installed → Verified → Completed
      ↓              ↓        ↓                                       ↓
   Rejected      Cancelled  Cancelled                              Disputed
```

| Value           | Description                       |
|-----------------|-----------------------------------|
| PendingApproval | Awaiting space owner approval     |
| Approved        | Owner accepted, awaiting payment  |
| Paid            | Payment confirmed                 |
| FileDownloaded  | Owner downloaded creative file    |
| Installed       | Owner marked ad as installed      |
| Verified        | Owner submitted proof photos      |
| Completed       | Proof approved or auto-approved   |
| Disputed        | Advertiser disputed proof         |
| Rejected        | Owner rejected booking request    |
| Cancelled       | Cancelled by either party         |

### Payment

**File:** `Data/Entities/Payment.cs`

| Field                  | Type          | Constraint      | Mutable |
|------------------------|---------------|-----------------|---------|
| Id                     | Guid          | PK              | No      |
| CreatedAt              | DateTime      | Required        | No      |
| BookingId              | Guid          | FK, Indexed     | No      |
| Type                   | PaymentType   | Enum            | No      |
| Amount                 | decimal       | Precision(10,2) | No      |
| StripeFee              | decimal?      | Precision(10,2) | Yes     |
| StripePaymentIntentId  | string        | MaxLength(255)  | No      |
| StripeChargeId         | string?       | MaxLength(255)  | Yes     |
| Status                 | PaymentStatus | Default: Pending| Yes     |
| PaidAt                 | DateTime?     | -               | Yes     |
| FailureReason          | string?       | MaxLength(500)  | Yes     |
| Refunds                | ICollection   | Nav (1:N)       | -       |

**PaymentType enum**: `Deposit`, `Balance`, `Full`

**PaymentStatus enum**: `Pending`, `Succeeded`, `Failed`, `Refunded`, `PartiallyRefunded`

### BookingProof

**File:** `Data/Entities/BookingProof.cs`

| Field            | Type          | Constraint      | Mutable |
|------------------|---------------|-----------------|---------|
| Id               | Guid          | PK              | No      |
| CreatedAt        | DateTime      | Required        | No      |
| BookingId        | Guid          | FK, Unique      | No      |
| Photos           | List\<string> | Required (3)    | No      |
| Status           | ProofStatus   | Default: Pending| Yes     |
| SubmittedAt      | DateTime      | Required        | No      |
| AutoApproveAt    | DateTime      | Required        | No      |
| ReviewedAt       | DateTime?     | -               | Yes     |
| ReviewedByUserId | Guid?         | FK              | Yes     |
| RejectionReason  | string?       | MaxLength(1000) | Yes     |

**ProofStatus enum**: `Pending`, `Approved`, `Disputed`, `Rejected`, `UnderReview`, `CorrectionRequested`

### BookingDispute

**File:** `Data/Entities/BookingDispute.cs`

| Field             | Type              | Constraint      | Mutable |
|-------------------|-------------------|-----------------|---------|
| Id                | Guid              | PK              | No      |
| CreatedAt         | DateTime          | Required        | No      |
| BookingId         | Guid              | FK, Unique      | No      |
| IssueType         | DisputeIssueType  | Enum            | No      |
| Reason            | string            | MaxLength(2000) | No      |
| Photos            | List\<string>     | Optional        | No      |
| DisputedByUserId  | Guid              | FK              | No      |
| DisputedAt        | DateTime          | Required        | No      |
| ResolvedByUserId  | Guid?             | FK              | Yes     |
| ResolvedAt        | DateTime?         | -               | Yes     |
| ResolutionAction  | string?           | MaxLength(100)  | Yes     |
| ResolutionNotes   | string?           | MaxLength(2000) | Yes     |

**DisputeIssueType enum**: `WrongLocation`, `PoorQuality`, `DamageToCreative`, `NotVisible`, `SafetyIssue`,
`MisleadingListing`

---

## Service Layer

### ICampaignService

**File:** `Features/Marketplace/CampaignService.cs`

| Method                            | Parameters                                          | Returns              | Description                |
|-----------------------------------|-----------------------------------------------------|----------------------|----------------------------|
| GetById                           | Guid id                                             | IQueryable\<Campaign>| Single campaign query      |
| GetByUserId                       | Guid userId                                         | IQueryable\<Campaign>| All campaigns for user     |
| GetByAdvertiserId                 | Guid advertiserProfileId                            | IQueryable\<Campaign>| Campaigns by profile       |
| GetBookingsByCampaignId           | Guid campaignId                                     | IQueryable\<Booking> | Bookings under campaign    |
| GetAdvertiserByCampaignIdAsync    | Guid campaignId, CancellationToken                  | Task\<AdvertiserProfile?> | Profile lookup         |
| CreateAsync                       | Guid userId, CreateCampaignInput, CancellationToken | Task\<Campaign>      | Create draft campaign      |
| UpdateAsync                       | Guid userId, Guid id, UpdateCampaignInput, CT       | Task\<Campaign>      | Update (Draft/Submitted)   |
| DeleteAsync                       | Guid userId, Guid id, CancellationToken             | Task\<bool>          | Delete (no active bookings)|
| SubmitAsync                       | Guid userId, Guid id, CancellationToken             | Task\<Campaign>      | Submit from Draft          |
| CancelAsync                       | Guid userId, Guid id, CancellationToken             | Task\<Campaign>      | Cancel from any status     |

**Status transition rules:**

| From      | To        | Method      | Validation                           |
|-----------|-----------|-------------|--------------------------------------|
| -         | Draft     | CreateAsync | User must have AdvertiserProfile     |
| Draft     | Submitted | SubmitAsync | Must be Draft                        |
| Any       | Cancelled | CancelAsync | Ownership check                      |
| Draft/Sub | Draft/Sub | UpdateAsync | Only mutable in Draft or Submitted   |
| Any       | (deleted) | DeleteAsync | No active bookings, ownership check  |

### IBookingService (Advertiser Operations)

**File:** `Features/Marketplace/BookingService.cs`

| Method                  | Parameters                                           | Returns             | Description                |
|-------------------------|------------------------------------------------------|---------------------|----------------------------|
| GetById                 | Guid id                                              | IQueryable\<Booking>| Single booking query       |
| GetByAdvertiserUserId   | Guid userId                                          | IQueryable\<Booking>| Advertiser's bookings      |
| GetReviewsByBookingId   | Guid bookingId                                       | IQueryable\<Review> | Reviews for booking        |
| GetPaymentsByBookingId  | Guid bookingId                                       | IQueryable\<Payment>| Payments for booking       |
| GetPayoutsByBookingId   | Guid bookingId                                       | IQueryable\<Payout> | Payouts for booking        |
| GetCampaignByBookingIdAsync | Guid bookingId, CancellationToken                | Task\<Campaign?>    | Campaign via DataLoader    |
| GetSpaceByBookingIdAsync    | Guid bookingId, CancellationToken                | Task\<Space?>       | Space via DataLoader       |
| CreateAsync             | Guid userId, Guid campaignId, CreateBookingInput, CT | Task\<Booking>      | Create booking request     |
| CancelAsync             | Guid userId, Guid id, string reason, CT              | Task\<Booking>      | Cancel booking             |

**Fee calculation** (in `CreateAsync`):

```
Subtotal        = PricePerDay * TotalDays
PlatformFee     = Subtotal * 0.10  (10%)
TotalAmount     = Subtotal + InstallationFee + PlatformFee
OwnerPayout     = Subtotal + InstallationFee
```

Platform fee constant: `private const decimal PlatformFeePercent = 0.10m`

**Create booking validation:**
1. Campaign must be owned by the calling user
2. Space must be Active
3. TotalDays = (EndDate - StartDate).Days
4. Prices snapshot from space at booking time (PricePerDay, InstallationFee)

### IPaymentService

**File:** `Features/Payments/PaymentService.cs`

| Method                   | Parameters                            | Returns                   | Description          |
|--------------------------|---------------------------------------|---------------------------|----------------------|
| GetById                  | Guid id                               | IQueryable\<Payment>      | Single payment query |
| GetByBookingId           | Guid bookingId                        | IQueryable\<Payment>      | Payments for booking |
| GetByIdAsync             | Guid id, CancellationToken            | Task\<Payment?>           | DataLoader lookup    |
| CreatePaymentIntentAsync | Guid userId, Guid bookingId, CT       | Task\<PaymentIntentResult>| Create Stripe intent |
| ConfirmPaymentAsync      | string paymentIntentId, CT            | Task\<Payment>            | Confirm payment      |

**PaymentIntentResult**: `record(string ClientSecret, string PaymentIntentId, decimal Amount)`

**Payment flow:**
1. Booking must be in `Approved` status
2. If a pending payment already exists, return it (idempotent)
3. Payment type is `Full`, amount is `booking.TotalAmount`
4. On confirmation, booking status transitions to `Paid`
5. Transaction record created

---

## GraphQL Operations

### Queries

| Query                    | Auth     | Pagination | Filtering | Sorting | File               |
|--------------------------|----------|------------|-----------|---------|--------------------|
| `campaignById(id)`       | Required | No         | No        | No      | CampaignQueries.cs |
| `myCampaigns`            | Required | Yes        | Yes       | Yes     | CampaignQueries.cs |
| `bookingById(id)`        | Required | No         | No        | No      | BookingQueries.cs  |
| `myBookingsAsAdvertiser` | Required | Yes        | Yes       | Yes     | BookingQueries.cs  |
| `paymentById(id)`        | Required | No         | No        | No      | PaymentQueries.cs  |
| `paymentsByBooking(id)`  | Required | Yes        | Yes       | Yes     | PaymentQueries.cs  |

Accessed via `me` query and extensions:

```graphql
query {
  me {
    advertiserProfile {
      companyName
      campaigns(first: 10, where: { status: { eq: ACTIVE } }) {
        nodes { id name status }
      }
    }
  }
}
```

**Example - Advertiser bookings with filtering:**

```graphql
query {
  myBookingsAsAdvertiser(
    first: 20
    where: { status: { in: [PAID, FILE_DOWNLOADED, INSTALLED] } }
    order: { startDate: DESC }
  ) {
    nodes {
      id
      status
      totalAmount
      startDate
      endDate
      space { title address }
      campaign { name }
    }
    pageInfo { hasNextPage endCursor }
  }
}
```

**Example - Campaign with bookings:**

```graphql
query {
  campaignById(id: "campaign-id") {
    id
    name
    status
    imageUrl
    totalBudget
    bookings(first: 10) {
      nodes {
        id
        status
        totalAmount
        space { title }
      }
    }
  }
}
```

### Mutations

| Mutation                         | Auth     | Errors                                            | File                |
|----------------------------------|----------|---------------------------------------------------|---------------------|
| `createCampaign(input)`          | Required | NotFoundException                                 | CampaignMutations.cs|
| `updateCampaign(id, input)`      | Required | NotFoundException, Forbidden, InvalidTransition   | CampaignMutations.cs|
| `deleteCampaign(id)`             | Required | NotFoundException, Forbidden, Conflict            | CampaignMutations.cs|
| `submitCampaign(id)`             | Required | NotFoundException, Forbidden, InvalidTransition   | CampaignMutations.cs|
| `cancelCampaign(id)`             | Required | NotFoundException, Forbidden                      | CampaignMutations.cs|
| `createBooking(campaignId, input)` | Required | NotFoundException, Validation                   | BookingMutations.cs |
| `cancelBooking(id, reason)`      | Required | NotFoundException, Forbidden, InvalidTransition   | BookingMutations.cs |
| `createPaymentIntent(bookingId)` | Required | NotFoundException, InvalidTransition              | PaymentMutations.cs |
| `confirmPayment(paymentIntentId)` | Required | NotFoundException, PaymentException              | PaymentMutations.cs |

**Example - Campaign CRUD flow:**

```graphql
mutation {
  createCampaign(input: {
    name: "Summer Storefront Campaign"
    imageUrl: "https://cdn.example.com/creative.pdf"
    description: "Downtown visibility push"
    totalBudget: 5000
    startDate: "2026-03-01"
    endDate: "2026-03-31"
  }) {
    campaign { id name status }
    errors { ... on NotFoundError { message } }
  }
}

mutation {
  submitCampaign(id: "campaign-id") {
    campaign { id status }
    errors {
      ... on InvalidStatusTransitionError { message }
    }
  }
}
```

**Example - Booking + Payment flow:**

```graphql
mutation {
  createBooking(
    campaignId: "campaign-id"
    input: {
      spaceId: "space-id"
      startDate: "2026-03-01"
      endDate: "2026-03-14"
      advertiserNotes: "Please install by 8am"
    }
  ) {
    booking { id status totalAmount platformFeeAmount }
    errors { ... on ValidationError { message } }
  }
}

mutation {
  createPaymentIntent(bookingId: "booking-id") {
    clientSecret
    paymentIntentId
    amount
    errors { ... on InvalidStatusTransitionError { message } }
  }
}

mutation {
  confirmPayment(paymentIntentId: "pi_xxx") {
    payment { id status amount paidAt }
    errors { ... on PaymentError { message } }
  }
}
```

### Subscriptions

| Subscription    | Parameters     | Payload      | File                        |
|-----------------|----------------|--------------|-----------------------------|
| `onNotification`| userId         | Notification | NotificationSubscriptions.cs|
| `onMessage`     | conversationId | Message      | NotificationSubscriptions.cs|
| `onBookingUpdate`| bookingId     | Booking      | NotificationSubscriptions.cs|
| `onProofUpdate` | bookingId      | BookingProof | NotificationSubscriptions.cs|

```graphql
subscription {
  onBookingUpdate(bookingId: "booking-id") {
    id
    status
    ownerNotes
  }
}
```

### Extensions

| Type              | Field      | Returns             | Pattern          | File                   |
|-------------------|------------|---------------------|------------------|------------------------|
| AdvertiserProfile | campaigns  | Connection\<Campaign> | Paginated IQueryable | UserExtensions.cs  |
| Campaign          | advertiser | AdvertiserProfile?  | DataLoader async | CampaignExtensions.cs  |
| Campaign          | bookings   | Connection\<Booking>| Paginated IQueryable | CampaignExtensions.cs |
| Booking           | campaign   | Campaign?           | DataLoader async | BookingExtensions.cs   |
| Booking           | space      | Space?              | DataLoader async | BookingExtensions.cs   |
| Booking           | reviews    | IQueryable\<Review> | Filtered         | BookingExtensions.cs   |
| Booking           | payments   | IQueryable\<Payment>| Filtered         | BookingExtensions.cs   |
| Booking           | payouts    | IQueryable\<Payout> | Filtered         | BookingExtensions.cs   |
| Payment           | refunds    | Connection\<Refund> | Paginated IQueryable | PaymentExtensions.cs |

---

## Business Logic

### Campaign Lifecycle

1. **Draft**: Created via `createCampaign`. All fields editable.
2. **Submitted**: Via `submitCampaign`. Advertiser can now create bookings against it. Fields still editable.
3. **Active**: Transitions when bookings become active (not yet automated).
4. **Completed**: When all associated bookings are completed (not yet automated).
5. **Cancelled**: Via `cancelCampaign`. Can cancel from any status.

Update is only allowed when status is `Draft` or `Submitted`. Delete requires no active bookings.

### Booking Flow (Advertiser Perspective)

1. **Create**: Advertiser calls `createBooking` with a campaign ID and space ID. Fees calculated from space prices.
2. **Wait for approval**: Space owner approves or rejects.
3. **Pay**: After approval, advertiser calls `createPaymentIntent` then `confirmPayment`.
4. **Track progress**: Owner downloads file, installs, uploads proof.
5. **Review proof**: Advertiser approves proof (triggers Stage 2 payout) or disputes it.
6. **Complete**: After proof approval or 48hr auto-approval, booking completes.

### Fee Structure

| Component       | Calculation                       |
|-----------------|-----------------------------------|
| Subtotal        | PricePerDay x TotalDays           |
| Platform Fee    | Subtotal x 10%                    |
| Installation    | From space listing (fixed amount) |
| Total (adv pays)| Subtotal + InstallationFee + PlatformFee |
| Owner Payout    | Subtotal + InstallationFee        |

### Two-Stage Payout

Payouts go to the space owner, but are relevant to the advertiser's booking flow:

| Stage   | Amount                                  | Trigger             |
|---------|-----------------------------------------|---------------------|
| Stage 1 | 30% of subtotal + installation fee      | File downloaded     |
| Stage 2 | 70% of subtotal                         | Proof approved/auto |

Auto-approval occurs 48 hours after proof submission if the advertiser takes no action.

### Payment Flow

1. `createPaymentIntent` → returns `clientSecret` for Stripe.js
2. Frontend uses Stripe.js to complete the card payment
3. `confirmPayment` → backend verifies with Stripe, moves booking to `Paid`
4. Transaction record created in ledger

---

## Authorization

| Operation                    | Auth           | Resource Check                                      |
|------------------------------|----------------|-----------------------------------------------------|
| Browse spaces                | None           | Public                                              |
| View own campaigns/bookings  | `[Authorize]`  | Automatic via `GetByUserId` filtering               |
| Campaign mutations           | `[Authorize]`  | AdvertiserProfile.UserId == currentUser              |
| Create booking               | `[Authorize]`  | Campaign.AdvertiserProfile.UserId == currentUser     |
| Cancel booking               | `[Authorize]`  | Advertiser or owner of booked space                  |
| Create payment intent        | `[Authorize]`  | Booking must belong to advertiser's campaign         |
| Approve/dispute proof        | `[Authorize]`  | Booking.Campaign.AdvertiserProfile.UserId == current |
| Refunds                      | Admin only     | `[Authorize(Roles = ["Admin"])]`                     |
| Payout processing            | Admin only     | `[Authorize(Roles = ["Admin"])]`                     |

---

## Input Types

**File:** `Features/Marketplace/CampaignInputs.cs`

| Input               | Required                | Optional                                                       |
|---------------------|-------------------------|----------------------------------------------------------------|
| CreateCampaignInput | name, imageUrl          | description, targetAudience, goals, totalBudget, startDate, endDate |
| UpdateCampaignInput | (none)                  | name, description, imageUrl, targetAudience, goals, totalBudget, startDate, endDate |

**File:** `Features/Marketplace/BookingInputs.cs`

| Input              | Required                    | Optional        |
|--------------------|-----------------------------|-----------------|
| CreateBookingInput | spaceId, startDate, endDate | advertiserNotes |

---

## Implementation Status

### Implemented

- Campaign CRUD (create, update, delete, submit, cancel)
- Booking creation and cancellation
- All booking status queries (by advertiser, by ID)
- Payment intent creation and confirmation
- Messaging (conversations, send message, mark read)
- Notifications (list, mark read, delete, preferences)
- Subscriptions (onNotification, onMessage, onBookingUpdate, onProofUpdate)
- Reviews (create, update, delete)
- AdvertiserProfile extensions (campaigns)
- Campaign extensions (bookings, advertiser)
- Booking extensions (campaign, space, reviews, payments, payouts)

### Not Yet Implemented

- `submitProof` mutation (owner submits verification photos)
- `approveProof` mutation (advertiser approves)
- `disputeProof` mutation (advertiser disputes)
- `resolveDispute` mutation (admin resolves)
- `updateAdvertiserProfile` mutation
- `updateCurrentUser` mutation
- Automated campaign status transitions (Draft → Active → Completed)
- Analytics aggregation queries
- Advertiser spending summary endpoint

---

## Backlog

Features referenced in frontend specs that have no backend implementation:

| Feature                      | Description                                    |
|------------------------------|------------------------------------------------|
| Advertiser analytics         | Aggregated campaign/booking metrics            |
| Spending summary             | Total spent, monthly breakdown, per-campaign   |
| Proof submission flow        | Owner uploads photos, 48hr auto-approve timer  |
| Dispute resolution           | Admin resolves disputes, triggers refund/payout|
| Profile mutations            | Update advertiser profile and user settings    |
| Saved payment methods        | Stripe customer card management                |
| Campaign performance metrics | Views, reach, completion rate                  |
| Export functionality          | CSV/PDF export for bookings and spending       |

---

**Last Updated**: 2026-02-03
