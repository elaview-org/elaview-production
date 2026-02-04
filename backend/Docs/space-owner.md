# Space Owner Backend Implementation Guide

Backend implementation reference for all Space Owner features: entities, services, repositories, GraphQL operations, and remaining work.

## Overview

Space Owner features span three feature directories:

| Directory | Domains |
|-----------|---------|
| `Features/Marketplace/` | Spaces, Bookings, Reviews, Campaigns |
| `Features/Payments/` | Payouts, Stripe Connect, Payments, Refunds, Transactions |
| `Features/Notifications/` | Notifications, Messages, Conversations |
| `Features/Users/` | User profiles, `me` query, profile mutations |

---

## Implementation Status

| Domain | Entity | Service | Repository | Queries | Mutations | Extensions |
|--------|--------|---------|------------|---------|-----------|------------|
| Spaces | x | x | x | x | x | x |
| Bookings | x | x | x | x | x | x |
| Proof & Disputes | x | - | - | - | - | - |
| Earnings & Payouts | x | x | x | x | x | x |
| Stripe Connect | - | x | x | - | x | - |
| Reviews | x | x | x | x | x | - |
| Conversations | x | x | x | x | x | x |
| Messages | x | x | x | x | x | - |
| Notifications | x | x | x | x | x | - |
| User Profile | x | x | x | x | x | x |

`x` = implemented, `-` = not implemented

---

## Spaces

### File Paths

| Layer | File |
|-------|------|
| Entity | `Data/Entities/Space.cs` |
| Service | `Features/Marketplace/SpaceService.cs` |
| Repository | `Features/Marketplace/SpaceRepository.cs` |
| Queries | `Features/Marketplace/SpaceQueries.cs` |
| Mutations | `Features/Marketplace/SpaceMutations.cs` |
| Extensions | `Features/Marketplace/SpaceExtensions.cs` |
| Inputs | `Features/Marketplace/SpaceInputs.cs` |
| Payloads | `Features/Marketplace/SpacePayloads.cs` |

### Entity: Space

Table: `spaces`

| Field | Type | Modifiers |
|-------|------|-----------|
| SpaceOwnerProfileId | `Guid` | FK |
| Title | `string` | `[MaxLength(500)]` |
| Description | `string?` | `[MaxLength(500)]` |
| Type | `SpaceType` | enum |
| Status | `SpaceStatus` | default `Active` |
| Address | `string` | `[MaxLength(500)]` |
| City | `string` | `[MaxLength(100)]` |
| State | `string` | `[MaxLength(100)]` |
| ZipCode | `string?` | `[MaxLength(20)]` |
| Latitude | `double` | |
| Longitude | `double` | |
| Width | `double?` | |
| Height | `double?` | |
| Dimensions | `string?` | `[MaxLength(100)]` |
| DimensionsText | `string?` | `[MaxLength(100)]` |
| PricePerDay | `decimal` | |
| InstallationFee | `decimal?` | |
| MinDuration | `int` | default `1` |
| MaxDuration | `int?` | |
| Images | `List<string>` | |
| AvailableFrom | `DateTime?` | |
| AvailableTo | `DateTime?` | |
| TotalBookings | `int` | mutable |
| TotalRevenue | `decimal` | mutable |
| AverageRating | `double?` | mutable |
| RejectionReason | `string?` | `[MaxLength(500)]` |
| Traffic | `string?` | `[MaxLength(500)]` |

Navigation: `SpaceOwnerProfile`, `Bookings`, `Reviews`

**SpaceType**: Billboard, Storefront, Transit, DigitalDisplay, WindowDisplay, VehicleWrap, Other

**SpaceStatus**: Active, Inactive, PendingApproval, Suspended, Rejected

### Service Interface: ISpaceService

```
IQueryable<Space> GetAll()
IQueryable<Space> GetAllExcludingUser(Guid? userId)
IQueryable<Space> GetById(Guid id)
IQueryable<Space> GetByUserId(Guid userId)
IQueryable<Space> GetByOwnerId(Guid ownerProfileId)
IQueryable<Booking> GetBookingsBySpaceId(Guid spaceId)
IQueryable<Review> GetReviewsBySpaceId(Guid spaceId)
Task<SpaceOwnerProfile?> GetSpaceOwnerBySpaceIdAsync(Guid spaceId, CancellationToken ct)
Task<Space> CreateAsync(Guid userId, CreateSpaceInput input, CancellationToken ct)
Task<Space> UpdateAsync(Guid userId, Guid id, UpdateSpaceInput input, CancellationToken ct)
Task<bool> DeleteAsync(Guid userId, Guid id, CancellationToken ct)
Task<Space> DeactivateAsync(Guid userId, Guid id, CancellationToken ct)
Task<Space> ReactivateAsync(Guid userId, Guid id, CancellationToken ct)
```

### Queries

| Method | Middleware | Auth | Description |
|--------|-----------|------|-------------|
| `GetSpaceById([ID] Guid id)` | `[UseFirstOrDefault] [UseProjection]` | `[Authorize]` | Single space by ID |
| `GetSpaces()` | `[UsePaging] [UseProjection] [UseFiltering] [UseSorting]` | None | Public marketplace listing, excludes current user's spaces |
| `GetMySpaces()` | `[UsePaging] [UseProjection] [UseFiltering] [UseSorting]` | `[Authorize]` | Current user's spaces |

### Mutations

| Method | Errors | Description |
|--------|--------|-------------|
| `CreateSpace(CreateSpaceInput)` | `NotFoundException` | Create new space for current user |
| `UpdateSpace([ID] Guid id, UpdateSpaceInput)` | `NotFoundException, ForbiddenException` | Update owned space |
| `DeleteSpace([ID] Guid id)` | `NotFoundException, ForbiddenException, ConflictException` | Delete owned space (fails if active bookings) |
| `DeactivateSpace([ID] Guid id)` | `NotFoundException, ForbiddenException` | Set space status to Inactive |
| `ReactivateSpace([ID] Guid id)` | `NotFoundException, ForbiddenException` | Set space status to Active |

All mutations require `[Authorize]`.

### Inputs

**CreateSpaceInput**: Title, Description?, Type, Address, City, State, ZipCode?, Latitude, Longitude, Width?, Height?, Dimensions?, PricePerDay, InstallationFee?, MinDuration, MaxDuration?, Images?, AvailableFrom?, AvailableTo?, DimensionsText?, Traffic?

**UpdateSpaceInput**: Title?, Description?, PricePerDay?, InstallationFee?, MinDuration?, MaxDuration?, Images?, AvailableFrom?, AvailableTo?, Traffic?

### Extensions (SpaceExtensions)

| Field | Return | Middleware | Description |
|-------|--------|-----------|-------------|
| `owner` | `SpaceOwnerProfile?` | `[Authorize]` | Space owner via DataLoader |
| `bookings` | `IQueryable<Booking>` | `[UsePaging] [UseProjection] [UseFiltering] [UseSorting]` | Bookings for this space |
| `reviews` | `IQueryable<Review>` | `[UsePaging] [UseProjection] [UseFiltering] [UseSorting]` | Reviews for this space |

### Extensions (SpaceOwnerProfileExtensions)

File: `Features/Users/UserExtensions.cs`

| Field | Return | Middleware | Description |
|-------|--------|-----------|-------------|
| `spaces` | `IQueryable<Space>` | `[UsePaging] [UseProjection] [UseFiltering] [UseSorting]` | All spaces for this owner profile |

Access pattern via `me` query:

```graphql
query {
  me {
    spaceOwnerProfile {
      spaces(first: 10) { nodes { id title status } }
    }
  }
}
```

---

## Bookings (Owner Perspective)

### File Paths

| Layer | File |
|-------|------|
| Entity | `Data/Entities/Booking.cs` |
| Service | `Features/Marketplace/BookingService.cs` |
| Repository | `Features/Marketplace/BookingRepository.cs` |
| Queries | `Features/Marketplace/BookingQueries.cs` |
| Mutations | `Features/Marketplace/BookingMutations.cs` |
| Extensions | `Features/Marketplace/BookingExtensions.cs` |
| Inputs | `Features/Marketplace/BookingInputs.cs` |
| Payloads | `Features/Marketplace/BookingPayloads.cs` |

### Entity: Booking

Table: `bookings`

| Field | Type | Modifiers |
|-------|------|-----------|
| CampaignId | `Guid` | FK, init |
| SpaceId | `Guid` | FK, init |
| StartDate | `DateTime` | init |
| EndDate | `DateTime` | init |
| TotalDays | `int` | init |
| PricePerDay | `decimal` | `[Precision(10,2)]`, init |
| InstallationFee | `decimal` | `[Precision(10,2)]`, init |
| SubtotalAmount | `decimal` | `[Precision(10,2)]`, init |
| PlatformFeePercent | `decimal` | `[Precision(5,2)]`, init |
| PlatformFeeAmount | `decimal` | `[Precision(10,2)]`, init |
| TotalAmount | `decimal` | `[Precision(10,2)]`, init |
| OwnerPayoutAmount | `decimal` | `[Precision(10,2)]`, init |
| Status | `BookingStatus` | default `PendingApproval` |
| AdvertiserNotes | `string?` | `[MaxLength(2000)]`, init |
| OwnerNotes | `string?` | `[MaxLength(2000)]`, mutable |
| FileDownloadedAt | `DateTime?` | mutable |
| CancellationReason | `string?` | `[MaxLength(1000)]` |
| CancelledAt | `DateTime?` | |
| CancelledByUserId | `Guid?` | |
| RejectionReason | `string?` | `[MaxLength(1000)]` |
| RejectedAt | `DateTime?` | |
| UpdatedAt | `DateTime` | mutable |

Navigation: `Campaign`, `Space`, `Proof?`, `Dispute?`, `Reviews`, `Payments`, `Payouts`, `CancelledByUser?`

**BookingStatus**: PendingApproval, Approved, Paid, FileDownloaded, Installed, Verified, Completed, Cancelled, Rejected, Disputed

### Status State Machine

```
PENDING_APPROVAL ──→ APPROVED ──→ PAID ──→ FILE_DOWNLOADED ──→ INSTALLED ──→ VERIFIED ──→ COMPLETED
       │                │          │
       ↓                ↓          ↓
   REJECTED         CANCELLED  CANCELLED
                                                                    ↓
                                                                DISPUTED
```

Owner-triggered transitions:

| From | To | Method | Validation |
|------|----|--------|------------|
| PendingApproval | Approved | `ApproveAsync` | Owner of space |
| PendingApproval | Rejected | `RejectAsync` | Owner of space |
| PendingApproval/Approved/Paid | Cancelled | `CancelAsync` | Owner or advertiser |
| Paid | FileDownloaded | `MarkFileDownloadedAsync` | Owner of space |
| FileDownloaded | Installed | `MarkInstalledAsync` | Owner of space |

### Business Rules

- **Platform fee**: 10% (`PlatformFeePercent = 0.10m`) applied to subtotal
- **TotalAmount** = SubtotalAmount + InstallationFee + PlatformFeeAmount
- **OwnerPayoutAmount** = SubtotalAmount + InstallationFee (owner receives full subtotal + install fee; platform fee is separate)
- **Cancellation**: allowed from PendingApproval, Approved, or Paid status by either party

### Service Interface: IBookingService

```
IQueryable<Booking> GetById(Guid id)
IQueryable<Booking> GetByAdvertiserUserId(Guid userId)
IQueryable<Booking> GetByOwnerUserId(Guid userId)
IQueryable<Booking> GetPendingByOwnerUserId(Guid userId)
IQueryable<Booking> GetRequiringActionByUserId(Guid userId)
IQueryable<Review> GetReviewsByBookingId(Guid bookingId)
IQueryable<Payment> GetPaymentsByBookingId(Guid bookingId)
IQueryable<Payout> GetPayoutsByBookingId(Guid bookingId)
Task<Campaign?> GetCampaignByBookingIdAsync(Guid bookingId, CancellationToken ct)
Task<Space?> GetSpaceByBookingIdAsync(Guid bookingId, CancellationToken ct)
Task<Booking> CreateAsync(Guid userId, Guid campaignId, CreateBookingInput input, CancellationToken ct)
Task<Booking> ApproveAsync(Guid userId, Guid id, string? ownerNotes, CancellationToken ct)
Task<Booking> RejectAsync(Guid userId, Guid id, string reason, CancellationToken ct)
Task<Booking> CancelAsync(Guid userId, Guid id, string reason, CancellationToken ct)
Task<Booking> MarkFileDownloadedAsync(Guid userId, Guid id, CancellationToken ct)
Task<Booking> MarkInstalledAsync(Guid userId, Guid id, CancellationToken ct)
```

### Queries (Owner-Scoped)

| Method | Middleware | Description |
|--------|-----------|-------------|
| `GetBookingById([ID] Guid id)` | `[UseFirstOrDefault] [UseProjection]` | Single booking |
| `GetMyBookingsAsOwner()` | `[UsePaging] [UseProjection] [UseFiltering] [UseSorting]` | All bookings on owner's spaces |
| `GetIncomingBookingRequests()` | `[UsePaging] [UseProjection] [UseSorting]` | PendingApproval bookings only |
| `GetBookingsRequiringAction()` | `[UsePaging] [UseProjection]` | Bookings needing owner action |

All require `[Authorize]`.

### Mutations (Owner Actions)

| Method | Errors | Description |
|--------|--------|-------------|
| `ApproveBooking([ID] Guid id, string? ownerNotes)` | `NotFoundException, ForbiddenException, InvalidStatusTransitionException` | Accept booking request |
| `RejectBooking([ID] Guid id, string reason)` | `NotFoundException, ForbiddenException, InvalidStatusTransitionException` | Decline booking request |
| `CancelBooking([ID] Guid id, string reason)` | `NotFoundException, ForbiddenException, InvalidStatusTransitionException` | Cancel booking |
| `MarkFileDownloaded([ID] Guid id)` | `NotFoundException, ForbiddenException, InvalidStatusTransitionException` | Record creative file download |
| `MarkInstalled([ID] Guid id)` | `NotFoundException, ForbiddenException, InvalidStatusTransitionException` | Mark ad as physically installed |

### Extensions (BookingExtensions)

| Field | Return | Pattern | Description |
|-------|--------|---------|-------------|
| `campaign` | `Campaign?` | DataLoader | Campaign via `GetCampaignByBookingIdAsync` |
| `space` | `Space?` | DataLoader | Space via `GetSpaceByBookingIdAsync` |
| `reviews` | `IQueryable<Review>` | `[UseProjection] [UseFiltering] [UseSorting]` | Reviews for this booking |
| `payments` | `IQueryable<Payment>` | `[UseProjection] [UseFiltering] [UseSorting]` | Payments for this booking |
| `payouts` | `IQueryable<Payout>` | `[UseProjection] [UseFiltering] [UseSorting]` | Payouts for this booking |

---

## Proof & Disputes

### Entity: BookingProof

File: `Data/Entities/BookingProof.cs` | Table: `booking_proofs`

| Field | Type | Modifiers |
|-------|------|-----------|
| BookingId | `Guid` | FK, init |
| Photos | `List<string>` | init |
| Status | `ProofStatus` | default `Pending` |
| SubmittedAt | `DateTime` | init |
| AutoApproveAt | `DateTime` | init |
| ReviewedAt | `DateTime?` | |
| ReviewedByUserId | `Guid?` | |
| RejectionReason | `string?` | `[MaxLength(1000)]` |

Navigation: `Booking`, `ReviewedByUser?`

**ProofStatus**: Pending, Approved, Disputed, Rejected, UnderReview, CorrectionRequested

### Entity: BookingDispute

File: `Data/Entities/BookingDispute.cs` | Table: `booking_disputes`

| Field | Type | Modifiers |
|-------|------|-----------|
| BookingId | `Guid` | FK, init |
| IssueType | `DisputeIssueType` | init |
| Reason | `string` | `[MaxLength(2000)]`, init |
| Photos | `List<string>` | init |
| DisputedByUserId | `Guid` | init |
| DisputedAt | `DateTime` | init |
| ResolvedByUserId | `Guid?` | |
| ResolvedAt | `DateTime?` | |
| ResolutionAction | `string?` | `[MaxLength(100)]` |
| ResolutionNotes | `string?` | `[MaxLength(2000)]` |

Navigation: `Booking`, `DisputedByUser`, `ResolvedByUser?`

**DisputeIssueType**: WrongLocation, PoorQuality, DamageToCreative, NotVisible, SafetyIssue, MisleadingListing

### Current State

Entities and EF configurations exist. DataLoaders for `BookingProof` and `BookingDispute` are referenced in BookingExtensions (via `Booking.Proof` and `Booking.Dispute` navigation properties). No dedicated service, repository, queries, or mutations exist yet.

### Remaining Work

- [ ] `ProofService` and `ProofRepository` with submit, approve, reject, request-correction methods
- [ ] `DisputeService` and `DisputeRepository` with file, resolve methods
- [ ] Proof mutations: `SubmitProof`, `ApproveProof`, `RejectProof`, `RequestProofCorrection`
- [ ] Dispute mutations: `FileDispute`, `ResolveDispute`
- [ ] Auto-approve logic (check `AutoApproveAt` field, 48-hour window)
- [ ] Wire `SendBookingNotificationAsync` for proof/dispute events
- [ ] `OnProofUpdate` subscription event publishing

---

## Earnings & Payouts

### File Paths

| Layer | File |
|-------|------|
| Entity | `Data/Entities/Payout.cs` |
| Service | `Features/Payments/PayoutService.cs` |
| Repository | `Features/Payments/PayoutRepository.cs` |
| Queries | `Features/Payments/PayoutQueries.cs` |
| Mutations | `Features/Payments/PayoutMutations.cs` |
| Extensions | `Features/Payments/PayoutExtensions.cs` |
| Payloads | `Features/Payments/PayoutPayloads.cs` |

### Entity: Payout

Table: `payouts`

| Field | Type | Modifiers |
|-------|------|-----------|
| BookingId | `Guid` | FK, init |
| SpaceOwnerProfileId | `Guid` | FK, init |
| Stage | `PayoutStage` | init |
| Amount | `decimal` | `[Precision(10,2)]`, init |
| StripeTransferId | `string?` | `[MaxLength(255)]` |
| Status | `PayoutStatus` | default `Pending` |
| ProcessedAt | `DateTime?` | |
| FailureReason | `string?` | `[MaxLength(500)]` |
| AttemptCount | `int` | |
| LastAttemptAt | `DateTime?` | |

Navigation: `Booking`, `SpaceOwnerProfile`

**PayoutStage**: Stage1, Stage2

**PayoutStatus**: Pending, Processing, PartiallyPaid, Completed, Failed

### Two-Stage Payout Model

| Stage | Amount Calculation | Trigger |
|-------|-------------------|---------|
| Stage1 | InstallationFee + (SubtotalAmount * 30%) | File downloaded by owner |
| Stage2 | SubtotalAmount * 70% | Verification approved |

Constant: `Stage1PayoutPercent = 0.30m`

### EarningsSummary Record

```csharp
public record EarningsSummary(
    decimal TotalEarnings,
    decimal PendingPayouts,
    decimal AvailableBalance,
    decimal ThisMonthEarnings,
    decimal LastMonthEarnings
);
```

Computed at query time from the owner's payout history. `AvailableBalance` currently equals `TotalEarnings` (no withdrawal tracking yet).

### Service Interface: IPayoutService

```
IQueryable<Payout> GetByUserId(Guid userId)
IQueryable<Payout> GetById(Guid id)
Task<Payout?> GetByIdAsync(Guid id, CancellationToken ct)
Task<EarningsSummary> GetEarningsSummaryAsync(Guid userId, CancellationToken ct)
Task<Payout> ProcessPayoutAsync(Guid bookingId, PayoutStage stage, CancellationToken ct)
Task<Payout> RetryPayoutAsync(Guid payoutId, CancellationToken ct)
```

### Queries (Owner)

| Method | Middleware | Description |
|--------|-----------|-------------|
| `GetMyPayouts()` | `[UsePaging] [UseProjection] [UseFiltering] [UseSorting]` | Current user's payout history |
| `GetPayoutById([ID] Guid id)` | `[UseFirstOrDefault] [UseProjection]` | Single payout |
| `GetEarningsSummary()` | None (returns record) | Financial summary for current user |

All require `[Authorize]`.

### Mutations (Admin Only)

| Method | Auth | Errors | Description |
|--------|------|--------|-------------|
| `ProcessPayout([ID] Guid bookingId, PayoutStage stage)` | `[Authorize(Roles = ["Admin"])]` | `NotFoundException, ConflictException, PaymentException` | Create and execute Stripe transfer |
| `RetryPayout([ID] Guid payoutId)` | `[Authorize(Roles = ["Admin"])]` | `NotFoundException, InvalidStatusTransitionException, PaymentException` | Retry a failed payout |

### Stripe Transfer Logic

`ProcessPayoutAsync` creates a Stripe `Transfer` to the owner's connected account:

1. Validate booking exists and owner has `StripeAccountId`
2. Calculate amount based on stage
3. Create `Payout` entity with `Pending` status
4. Call `Stripe.TransferService.CreateAsync` with amount, destination, metadata
5. On success: update status to `Completed`, record `StripeTransferId`, create `Transaction` record
6. On failure: update status to `Failed`, record `FailureReason`, throw `PaymentException`

### Extensions (EarningsSummaryExtensions)

File: `Features/Payments/PayoutExtensions.cs`

Exposes `EarningsSummary` fields with explicit `[GraphQLType(typeof(DecimalType))]` for correct GraphQL decimal serialization: `totalEarnings`, `pendingPayouts`, `availableBalance`, `thisMonthEarnings`, `lastMonthEarnings`.

---

## Stripe Connect

### File Paths

| Layer | File |
|-------|------|
| Service | `Features/Payments/StripeConnectService.cs` |
| Repository | `Features/Payments/StripeConnectRepository.cs` |
| Mutations | `Features/Payments/StripeConnectMutations.cs` |
| Payloads | `Features/Payments/StripeConnectPayloads.cs` |

### Service Interface: IStripeConnectService

```
Task<StripeConnectResult> CreateConnectAccountAsync(Guid userId, CancellationToken ct)
Task<SpaceOwnerProfile> RefreshAccountStatusAsync(Guid userId, CancellationToken ct)
```

### Mutations

| Method | Errors | Description |
|--------|--------|-------------|
| `ConnectStripeAccount()` | `NotFoundException, PaymentException` | Creates Stripe Express account (or returns existing onboarding link) and returns `{ accountId, onboardingUrl }` |
| `RefreshStripeAccountStatus()` | `NotFoundException, ValidationException, PaymentException` | Fetches account from Stripe API, updates `StripeAccountStatus` field |

Both require `[Authorize]` and inject `IUserService` for principal extraction.

### Account Status Logic

Status is derived from the Stripe Account object:

| Condition | Status |
|-----------|--------|
| `ChargesEnabled == true` | `"active"` |
| `DetailsSubmitted == true` | `"pending"` |
| Neither | `"incomplete"` |

### UserProfileBase Stripe Fields

Defined in `Data/Entities/Bases.cs` (inherited by `SpaceOwnerProfile` and `AdvertiserProfile`):

| Field | Type | Description |
|-------|------|-------------|
| StripeAccountId | `string?` | Stripe Connect account ID |
| StripeAccountStatus | `string?` | `"active"`, `"pending"`, or `"incomplete"` |
| StripeLastAccountHealthCheck | `DateTime?` | Last status refresh |
| StripeAccountDisconnectedAt | `DateTime?` | When account was disconnected |
| StripeAccountDisconnectedNotifiedAt | `DateTime?` | When disconnect notification was sent |

---

## Reviews

### File Paths

| Layer | File |
|-------|------|
| Entity | `Data/Entities/Review.cs` |
| Service | `Features/Marketplace/ReviewService.cs` |
| Repository | `Features/Marketplace/ReviewRepository.cs` |
| Queries | `Features/Marketplace/ReviewQueries.cs` |
| Mutations | `Features/Marketplace/ReviewMutations.cs` |
| Inputs | `Features/Marketplace/ReviewInputs.cs` |
| Payloads | `Features/Marketplace/ReviewPayloads.cs` |

### Entity: Review

Table: `reviews`

| Field | Type | Modifiers |
|-------|------|-----------|
| BookingId | `Guid` | FK, init |
| SpaceId | `Guid` | FK, init |
| ReviewerType | `ReviewerType` | init |
| ReviewerProfileId | `Guid` | init |
| Rating | `int` | `[Range(1, 5)]`, init |
| Comment | `string?` | `[MaxLength(2000)]`, init |

Navigation: `Booking`, `Space`

**ReviewerType**: Advertiser, SpaceOwner

Unique constraint: `BookingId` + `ReviewerType` (one review per party per booking).

### Service Interface: IReviewService

```
IQueryable<Review> GetBySpaceId(Guid spaceId)
IQueryable<Review> GetByBookingIdAndType(Guid bookingId, ReviewerType reviewerType)
IQueryable<Review> GetByUserId(Guid userId)
Task<Review?> GetByIdAsync(Guid id, CancellationToken ct)
Task<Booking?> GetBookingByReviewIdAsync(Guid reviewId, CancellationToken ct)
Task<Space?> GetSpaceByReviewIdAsync(Guid reviewId, CancellationToken ct)
Task<Review> CreateAsync(Guid userId, Guid bookingId, CreateReviewInput input, CancellationToken ct)
Task<Review> UpdateAsync(Guid userId, Guid id, UpdateReviewInput input, CancellationToken ct)
Task<bool> DeleteAsync(Guid id, CancellationToken ct)
```

### Business Rules

- Both advertiser and owner can review the same booking (different `ReviewerType`)
- Duplicate check: `ExistsAsync(bookingId, reviewerType)` throws `ConflictException`
- 24-hour edit window: `UpdateAsync` throws `ValidationException` if `> 24 hours` since creation
- When an advertiser creates a review, `Space.AverageRating` is recalculated via `UpdateSpaceAverageRatingAsync`
- `DeleteAsync` is admin-only (no userId check in service; mutation has `[Authorize(Roles = ["Admin"])]`)

### Queries

| Method | Middleware | Auth | Description |
|--------|-----------|------|-------------|
| `GetReviewsBySpace([ID] Guid spaceId)` | `[UsePaging] [UseProjection] [UseSorting]` | None | Public reviews for a space |
| `GetReviewByBooking([ID] Guid bookingId, ReviewerType)` | `[UseFirstOrDefault] [UseProjection]` | `[Authorize]` | Single review by booking + type |
| `GetMyReviews()` | `[UsePaging] [UseProjection] [UseSorting]` | `[Authorize]` | Current user's reviews |

### Mutations

| Method | Errors | Description |
|--------|--------|-------------|
| `CreateReview([ID] Guid bookingId, CreateReviewInput)` | `NotFoundException, ForbiddenException, ConflictException` | Create review (auto-detects reviewer type) |
| `UpdateReview([ID] Guid id, UpdateReviewInput)` | `NotFoundException, ForbiddenException, ValidationException` | Update within 24-hour window |
| `DeleteReview([ID] Guid id)` | None | Admin-only delete |

### Inputs

**CreateReviewInput**: Rating (`int`), Comment (`string?`)

**UpdateReviewInput**: Rating (`int?`), Comment (`string?`)

---

## Conversations & Messages

### File Paths

| Layer | File |
|-------|------|
| Conversation Entity | `Data/Entities/Conversation.cs` |
| Participant Entity | `Data/Entities/ConversationParticipant.cs` |
| Message Entity | `Data/Entities/Message.cs` |
| Conversation Service | `Features/Notifications/ConversationService.cs` |
| Conversation Repository | `Features/Notifications/ConversationRepository.cs` |
| Message Service | `Features/Notifications/MessageService.cs` |
| Message Repository | `Features/Notifications/MessageRepository.cs` |
| Conversation Queries | `Features/Notifications/ConversationQueries.cs` |
| Message Queries | `Features/Notifications/MessageQueries.cs` |
| Conversation Mutations | `Features/Notifications/ConversationMutations.cs` |
| Message Mutations | `Features/Notifications/MessageMutations.cs` |
| Extensions | `Features/Notifications/NotificationExtensions.cs` |
| Inputs | `Features/Notifications/NotificationInputs.cs` |
| Payloads | `Features/Notifications/ConversationPayloads.cs`, `Features/Notifications/MessagePayloads.cs` |

### Entity: Conversation

Table: `conversations`

| Field | Type |
|-------|------|
| BookingId | `Guid?` |
| UpdatedAt | `DateTime` |

Navigation: `Booking?`, `Participants`, `Messages`

### Entity: ConversationParticipant

Table: `conversation_participants`

| Field | Type |
|-------|------|
| ConversationId | `Guid` |
| UserId | `Guid` |
| JoinedAt | `DateTime` |
| LastReadAt | `DateTime?` |

### Entity: Message

Table: `messages`

| Field | Type | Modifiers |
|-------|------|-----------|
| ConversationId | `Guid` | FK |
| SenderUserId | `Guid` | FK |
| Type | `MessageType` | default `Text` |
| Content | `string` | `[MaxLength(5000)]` |
| Attachments | `List<string>?` | |

**MessageType**: Text, ProofSubmission, ProofApproved, ProofDisputed, System, ProofRejected, CorrectionRequest, QualityConcern

### Service Interfaces

**IConversationService**:
```
IQueryable<Conversation> GetByUserId(Guid userId)
IQueryable<ConversationParticipant> GetParticipantsByConversationId(Guid conversationId)
Task<Conversation?> GetByIdAsync(Guid id, CancellationToken ct)
Task<Conversation> GetOrCreateBookingConversationAsync(Guid bookingId, CancellationToken ct)
Task<ConversationParticipant> MarkConversationReadAsync(Guid userId, Guid conversationId, CancellationToken ct)
Task<int> GetUnreadCountAsync(Guid userId, CancellationToken ct)
```

**IMessageService**:
```
IQueryable<Message> GetByConversationId(Guid conversationId)
Task<Message> SendMessageAsync(Guid userId, Guid conversationId, string content, MessageType type, List<string>? attachments, CancellationToken ct)
```

### Queries

| Method | Middleware | Description |
|--------|-----------|-------------|
| `GetMyConversations()` | `[UsePaging] [UseProjection] [UseFiltering] [UseSorting]` | Current user's conversations ordered by `UpdatedAt` desc |
| `GetUnreadConversationsCount()` | None (returns `int`) | Count of conversations with unread messages |
| `GetMessagesByConversation([ID] Guid conversationId)` | `[UsePaging] [UseProjection] [UseFiltering] [UseSorting]` | Messages ordered by `CreatedAt` desc |

### Mutations

| Method | Errors | Description |
|--------|--------|-------------|
| `CreateBookingConversation([ID] Guid bookingId)` | `NotFoundException` | Get or create conversation for a booking (adds both parties as participants) |
| `MarkConversationRead([ID] Guid conversationId)` | `ForbiddenException` | Update `LastReadAt` for current user |
| `SendMessage([ID] Guid conversationId, string content, MessageType? type, List<string>? attachments)` | `ForbiddenException` | Send message (validates participant, updates conversation timestamp, sends notification to other participants) |

### Extensions (ConversationExtensions)

File: `Features/Notifications/NotificationExtensions.cs`

| Field | Return | Middleware | Description |
|-------|--------|-----------|-------------|
| `messages` | `IQueryable<Message>` | `[UsePaging] [UseProjection] [UseFiltering] [UseSorting]` | Messages in conversation |
| `participants` | `IQueryable<ConversationParticipant>` | `[UseProjection]` | Participants in conversation |

### Subscription

```csharp
[Subscribe]
[Topic("messages:{conversationId}")]
public static Message OnMessage([ID] Guid conversationId, [EventMessage] Message message)
```

Published by `MessageService.SendMessageAsync` via `ITopicEventSender.SendAsync`.

---

## Notifications

### File Paths

| Layer | File |
|-------|------|
| Entity | `Data/Entities/Notification.cs` |
| Preference Entity | `Data/Entities/NotificationPreference.cs` |
| Service | `Features/Notifications/NotificationService.cs` |
| Repository | `Features/Notifications/NotificationRepository.cs` |
| Queries | `Features/Notifications/NotificationQueries.cs` |
| Mutations | `Features/Notifications/NotificationMutations.cs` |
| Inputs | `Features/Notifications/NotificationInputs.cs` |
| Payloads | `Features/Notifications/NotificationPayloads.cs` |
| Subscriptions | `Features/Notifications/NotificationSubscriptions.cs` |

### Entity: Notification

Table: `notifications`

| Field | Type | Modifiers |
|-------|------|-----------|
| UserId | `Guid` | FK |
| Type | `NotificationType` | |
| Title | `string` | `[MaxLength(200)]` |
| Body | `string` | `[MaxLength(1000)]` |
| EntityType | `string?` | `[MaxLength(50)]` |
| EntityId | `Guid?` | |
| IsRead | `bool` | default `false` |
| ReadAt | `DateTime?` | |

### NotificationType Enum (Owner-Relevant)

| Type | Owner Receives | Description |
|------|---------------|-------------|
| BookingRequested | x | New booking request on owner's space |
| BookingApproved | | Sent to advertiser |
| BookingRejected | | Sent to advertiser |
| BookingCancelled | x | Both parties |
| PaymentReceived | x | Payment confirmed for booking |
| PayoutProcessed | x | Payout completed |
| ProofUploaded | | Sent to advertiser |
| ProofApproved | x | Proof approved |
| ProofDisputed | x | Proof disputed |
| ProofRejected | x | Proof rejected |
| DisputeFiled | x | Dispute opened on owner's booking |
| DisputeResolved | x | Both parties |
| MessageReceived | x | New message in conversation |
| SpaceApproved | x | Space listing approved by admin |
| SpaceRejected | x | Space listing rejected by admin |
| SpaceSuspended | x | Space listing suspended |
| SpaceReactivated | x | Space reactivated |
| SystemUpdate | x | Platform-wide announcements |
| SessionExpired | x | Auth session expired |
| PaymentFailed | | Sent to advertiser |
| PaymentReminder | | Sent to advertiser |
| RefundProcessed | | Sent to advertiser |

### Entity: NotificationPreference

Table: `notification_preferences`

| Field | Type |
|-------|------|
| UserId | `Guid` |
| NotificationType | `NotificationType` |
| EmailEnabled | `bool` (default `true`) |
| PushEnabled | `bool` (default `true`) |
| InAppEnabled | `bool` (default `true`) |

### Service Interface: INotificationService

```
IQueryable<Notification> GetByUserId(Guid userId)
Task<Notification?> GetByIdAsync(Guid id, CancellationToken ct)
Task<int> GetUnreadCountAsync(Guid userId, CancellationToken ct)
Task<Notification> MarkAsReadAsync(Guid userId, Guid id, CancellationToken ct)
Task<int> MarkAllAsReadAsync(Guid userId, CancellationToken ct)
Task<bool> DeleteAsync(Guid userId, Guid id, CancellationToken ct)
Task<IReadOnlyList<NotificationPreference>> GetPreferencesByUserIdAsync(Guid userId, CancellationToken ct)
Task<NotificationPreference> UpdatePreferenceAsync(Guid userId, UpdateNotificationPreferenceInput input, CancellationToken ct)
Task SendNotificationAsync(Guid userId, NotificationType type, string title, string body, string? entityType, Guid? entityId, CancellationToken ct)
Task SendBookingNotificationAsync(Guid bookingId, NotificationType type, string title, string body, CancellationToken ct)
```

`SendBookingNotificationAsync` routes notifications to the correct party (owner or advertiser) based on `NotificationType` using a `switch` expression. It also publishes to the `notifications:{userId}` subscription topic.

### Queries

| Method | Middleware | Description |
|--------|-----------|-------------|
| `GetMyNotifications()` | `[UsePaging] [UseProjection] [UseFiltering] [UseSorting]` | Current user's notifications |
| `GetUnreadNotificationsCount()` | None (returns `int`) | Unread count |
| `GetMyNotificationPreferences()` | None (returns `IReadOnlyList`) | Current user's preferences |

### Mutations

| Method | Errors | Description |
|--------|--------|-------------|
| `MarkNotificationRead([ID] Guid id)` | `NotFoundException` | Mark single notification read |
| `MarkAllNotificationsRead()` | None | Bulk mark all read (returns affected count) |
| `DeleteNotification([ID] Guid id)` | None | Delete notification |
| `UpdateNotificationPreference(UpdateNotificationPreferenceInput)` | None | Create or update preference for a notification type |

### Subscriptions

File: `Features/Notifications/NotificationSubscriptions.cs`

| Subscription | Topic Pattern | Event Type | Description |
|-------------|--------------|------------|-------------|
| `OnNotification([ID] Guid userId)` | `notifications:{userId}` | `Notification` | Real-time notifications |
| `OnMessage([ID] Guid conversationId)` | `messages:{conversationId}` | `Message` | Real-time messages |
| `OnBookingUpdate([ID] Guid bookingId)` | `booking:{bookingId}:updates` | `Booking` | Real-time booking changes |
| `OnProofUpdate([ID] Guid bookingId)` | `booking:{bookingId}:proof` | `BookingProof` | Verification status changes |

Currently, `OnNotification` and `OnMessage` are wired (published by `NotificationService` and `MessageService`). `OnBookingUpdate` and `OnProofUpdate` topics are defined but not yet published by any service.

---

## User Profile

### File Paths

| Layer | File |
|-------|------|
| Entity | `Data/Entities/SpaceOwnerProfile.cs`, `Data/Entities/Bases.cs` |
| Service | `Features/Users/UserService.cs` |
| Repository | `Features/Users/UserRepository.cs` |
| Queries | `Features/Users/UserQueries.cs` |
| Mutations | `Features/Users/UserMutations.cs` |
| Extensions | `Features/Users/UserExtensions.cs` |
| Inputs | `Features/Users/UserInputs.cs` |

### Entity: SpaceOwnerProfile

Table: `space_owner_profiles` (extends `UserProfileBase`)

| Field | Type | Source |
|-------|------|--------|
| UserId | `Guid` | `UserProfileBase` |
| OnboardingComplete | `bool` | `UserProfileBase` |
| StripeAccountId | `string?` | `UserProfileBase` |
| StripeAccountStatus | `string?` | `UserProfileBase` |
| StripeLastAccountHealthCheck | `DateTime?` | `UserProfileBase` |
| StripeAccountDisconnectedAt | `DateTime?` | `UserProfileBase` |
| StripeAccountDisconnectedNotifiedAt | `DateTime?` | `UserProfileBase` |
| BusinessName | `string?` | `SpaceOwnerProfile` |
| BusinessType | `string?` | `SpaceOwnerProfile` |
| PayoutSchedule | `PayoutSchedule` | `SpaceOwnerProfile` (default `Weekly`) |

Navigation: `User`, `Spaces`, `Payouts`

**PayoutSchedule**: Weekly, Biweekly, Monthly

### Mutations

| Method | Errors | Description |
|--------|--------|-------------|
| `UpdateCurrentUser(UpdateUserInput)` | `NotFoundException` | Update name, phone, avatar, activeProfileType |
| `UpdateSpaceOwnerProfile(UpdateSpaceOwnerProfileInput)` | `NotFoundException` | Update businessName, businessType, payoutSchedule |

### Inputs

**UpdateUserInput**: Name?, Phone?, Avatar?, ActiveProfileType?

**UpdateSpaceOwnerProfileInput**: BusinessName?, BusinessType?, PayoutSchedule?

### `me` Query Access Pattern

```graphql
query {
  me {
    id
    name
    email
    spaceOwnerProfile {
      businessName
      businessType
      payoutSchedule
      stripeAccountId
      stripeAccountStatus
      onboardingComplete
      spaces(first: 10) {
        nodes { id title status pricePerDay }
      }
    }
  }
}
```

`me` resolves via `UserQueries.Me()` -> `IUserService.GetCurrentUser()` -> `IQueryable<User>`. Profile fields are accessed through navigation properties. `spaces` is resolved by `SpaceOwnerProfileExtensions.GetSpaces()` which calls `ISpaceService.GetByOwnerId()`.

---

## Remaining Work

### Phase 1: Proof & Dispute Mutations

- [ ] `ProofService` + `ProofRepository`
- [ ] `SubmitProof` mutation (owner uploads verification photos)
- [ ] `ApproveProof` mutation (advertiser approves, triggers Stage 2 payout)
- [ ] `RejectProof` mutation (advertiser rejects with reason)
- [ ] `RequestProofCorrection` mutation (advertiser requests new photos)
- [ ] `FileDispute` mutation (advertiser files dispute)
- [ ] `ResolveDispute` mutation (admin resolves)
- [ ] Auto-approve background job (48-hour window via `AutoApproveAt`)

### Phase 2: Event Publishing

- [ ] Wire `OnBookingUpdate` subscription (publish from `BookingService` on status changes)
- [ ] Wire `OnProofUpdate` subscription (publish from `ProofService` on proof status changes)
- [ ] Wire `SendBookingNotificationAsync` calls in `BookingService` mutations (approve, reject, cancel, etc.)

### Phase 3: Analytics

- [ ] Backend aggregation queries for owner dashboard metrics
- [ ] Views/impressions tracking
- [ ] Occupancy rate calculation
- [ ] Revenue by space aggregation
- [ ] Booking trend data endpoints

### Phase 4: Infrastructure

- [ ] Availability calendar blocking (block/unblock date ranges per space)
- [ ] Image upload to Cloudflare R2 (currently `Images` is `List<string>` URLs)
- [ ] Admin space approval workflow (PendingApproval -> Active/Rejected)
- [ ] Withdrawal request system (owner-initiated payouts vs admin-triggered)
- [ ] Tax document generation support
