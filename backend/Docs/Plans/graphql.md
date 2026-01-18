# GraphQL API Specification

Complete specification for Elaview's GraphQL API including queries, mutations, subscriptions, service layer
architecture, and DataLoaders.

---

## Architecture Overview

### Directory Structure

```
Features/
├── Users/                       # Reference implementation
│   ├── UserService.cs           # IUserService + UserService (same file)
│   ├── UserRepository.cs        # IUserRepository + UserRepository (same file)
│   ├── UserQueries.cs           # GraphQL queries
│   ├── UserExtensions.cs        # Profile extensions (SpaceOwnerProfileExtensions, AdvertiserExtensions)
│   └── *Mutations.cs            # GraphQL mutations (when needed)
├── Marketplace/
│   ├── Spaces/
│   ├── Campaigns/
│   ├── Bookings/
│   └── Reviews/
├── Payments/
└── Notifications/
    ├── Messaging/
    └── Preferences/
```

### Layer Architecture

```
Resolver → Service → Repository → Database
                         ↓
                    DataLoader (mutations only)
```

| Layer      | Responsibility                                  | Returns                                    |
|------------|-------------------------------------------------|--------------------------------------------|
| Resolver   | HotChocolate middleware, delegate to Service    | `IQueryable<T>` or `Task<T>`               |
| Service    | Business logic, authorization, orchestration    | `IQueryable<T>` (reads), `Task<T>` (writes)|
| Repository | Data access via `IQueryable`, DataLoaders       | `IQueryable<T>` or `Task<T>`               |
| DataLoader | Batch fetching for mutation scenarios           | `IReadOnlyDictionary` or `ILookup`         |

**Key Rules**:

- **Resolvers**:
  - NEVER access Repository or AppDbContext directly
  - Resolvers are thin wrappers that delegate to services
  - Resolvers select which services they need and call their methods
  - For mutations: inject `IUserService` to get userId, pass it to domain service
  - Extensions inject the service that owns the RETURNED type
  - NEVER handle exceptions in resolvers - services throw domain exceptions

- **Services**:
  - NEVER inject `AppDbContext` - all data access through Repository only
  - Only `IUserService` has `GetPrincipalId()` and `GetPrincipalIdOrNull()`
  - Domain services receive `userId` as a parameter when authorization checks are needed
  - Throw domain exceptions (`NotFoundException`, `ForbiddenException`, etc.) - NEVER `GraphQLException`
  - Return `IQueryable<T>` for reads, `Task<T>` for writes
  - Services do NOT duplicate `IHttpContextAccessor` logic

- **Repositories**:
  - Only layer that injects `AppDbContext`
  - Provide `IQueryable<T>` for projection-based queries
  - DataLoaders used only for fetching entities in mutations
  - Never throw business exceptions (return null or empty)

- **Principal Extraction**:
  - Centralized in `IUserService.GetPrincipalId()` and `GetPrincipalIdOrNull()`
  - Resolvers call `userService.GetPrincipalId()` and pass userId to domain services
  - Domain services receive userId as a method parameter, not via IHttpContextAccessor
  - "My*" queries handled via extensions on User's profile types (not top-level queries)

- Interface + implementation live in same file (reduces file sprawl)

### Return Type Rules

| Operation Type             | Service Returns | Resolver Returns | Why                               |
|----------------------------|-----------------|------------------|-----------------------------------|
| Paginated/filtered queries | IQueryable<T>   | IQueryable<T>    | Preserves HotChocolate middleware |
| Single entity by ID        | IQueryable<T>   | IQueryable<T>    | UseFirstOrDefault + UseProjection |
| Mutations                  | Task<T>         | Task<T>          | Single entity after write         |
| Extensions (1:1 relation)  | -               | T?               | [BindMember] + navigation prop    |
| Extensions (1:N relation)  | IQueryable<T>   | IQueryable<T>    | Preserves pagination/filtering    |

### Service Layer Pattern

**UserService Responsibilities (THE ONLY service with principal access):**

- Extracts current user ID from `IHttpContextAccessor`
- Provides `GetPrincipalId()` and `GetPrincipalIdOrNull()` methods
- Returns user queries via repository

**Domain Service Responsibilities:**

- Business logic and validation
- Database operations via Repository only (NEVER inject AppDbContext)
- Receives `userId` as a parameter when authorization checks are needed
- Throws domain exceptions (`NotFoundException`, `ForbiddenException`, etc.) - NEVER `GraphQLException`
- Cross-cutting concerns (notifications, payments)

**Repository Responsibilities:**

- Only layer that injects `AppDbContext`
- Wraps DataLoaders for batched fetching
- Provides IQueryable for filtered/paginated queries
- CRUD operations via AppDbContext
- Never throws business exceptions (return null or empty)

**Resolver Responsibilities:**

- Thin wrappers that delegate to services
- For mutations: inject `IUserService` to get userId, pass it to domain service
- Declare `[Error<T>]` attributes for each domain exception the service might throw
- HotChocolate middleware application (Authorize, Paging, Filtering, etc.)
- NEVER access Repository or AppDbContext directly
- NEVER handle exceptions - let services throw domain exceptions

**Example - UserService (owns principal extraction):**

```csharp
public interface IUserService {
    Guid GetPrincipalId();
    Guid? GetPrincipalIdOrNull();
    IQueryable<User> GetCurrentUser();
}

public sealed class UserService(
    IUserRepository repository,
    IHttpContextAccessor httpContextAccessor
) : IUserService {
    public Guid GetPrincipalId()
        => GetPrincipalIdOrNull()
           ?? throw new ForbiddenException("access this resource");

    public Guid? GetPrincipalIdOrNull()
        => httpContextAccessor.HttpContext?.User
            .FindFirstValue(ClaimTypes.NameIdentifier) is { } id
            ? Guid.Parse(id) : null;

    public IQueryable<User> GetCurrentUser()
        => repository.GetById(GetPrincipalId());
}
```

**Example - Domain Service (receives userId as parameter, NO AppDbContext):**

```csharp
public interface ISpaceService {
    IQueryable<Space> GetAll();
    IQueryable<Space> GetById(Guid id);
    IQueryable<Space> GetByOwnerId(Guid ownerProfileId);
    Task<Space> CreateAsync(Guid userId, CreateSpaceInput input, CancellationToken ct);
    Task<Space> UpdateAsync(Guid userId, Guid id, UpdateSpaceInput input, CancellationToken ct);
    Task<bool> DeleteAsync(Guid userId, Guid id, CancellationToken ct);
}

public sealed class SpaceService(ISpaceRepository repository) : ISpaceService {
    public IQueryable<Space> GetAll()
        => repository.GetAll();

    public IQueryable<Space> GetById(Guid id)
        => repository.GetById(id);

    public async Task<Space> CreateAsync(
        Guid userId, CreateSpaceInput input, CancellationToken ct
    ) {
        var profile = await repository.GetSpaceOwnerProfileByUserIdAsync(userId, ct)
            ?? throw new NotFoundException("SpaceOwnerProfile", userId);

        var space = new Space {
            SpaceOwnerProfileId = profile.Id,
            Title = input.Title,
            ...
        };

        return await repository.AddAsync(space, ct);
    }

    public async Task<Space> UpdateAsync(
        Guid userId, Guid id, UpdateSpaceInput input, CancellationToken ct
    ) {
        var space = await repository.GetByIdAsync(id, ct)
            ?? throw new NotFoundException("Space", id);

        if (space.SpaceOwnerProfile.UserId != userId)
            throw new ForbiddenException("update this space");

        return await repository.UpdateAsync(space, input, ct);
    }
}
```

**Example - Mutation Resolver (passes userId from UserService to domain service):**

```csharp
[MutationType]
public static class SpaceMutations {
    [Authorize]
    [Error<NotFoundException>]
    [Error<ForbiddenException>]
    public static async Task<Space> CreateSpace(
        CreateSpaceInput input,
        IUserService userService,
        ISpaceService spaceService,
        CancellationToken ct
    ) => await spaceService.CreateAsync(userService.GetPrincipalId(), input, ct);

    [Authorize]
    [Error<NotFoundException>]
    [Error<ForbiddenException>]
    public static async Task<Space> UpdateSpace(
        [ID] Guid id,
        UpdateSpaceInput input,
        IUserService userService,
        ISpaceService spaceService,
        CancellationToken ct
    ) => await spaceService.UpdateAsync(userService.GetPrincipalId(), id, input, ct);
}
```

**Example - Repository (only layer with AppDbContext):**

```csharp
public interface ISpaceRepository {
    IQueryable<Space> GetAll();
    IQueryable<Space> GetById(Guid id);
    IQueryable<Space> GetByOwnerId(Guid ownerProfileId);
    Task<Space?> GetByIdAsync(Guid id, CancellationToken ct);
    Task<SpaceOwnerProfile?> GetSpaceOwnerProfileByUserIdAsync(Guid userId, CancellationToken ct);
    Task<Space> AddAsync(Space space, CancellationToken ct);
    Task<Space> UpdateAsync(Space space, UpdateSpaceInput input, CancellationToken ct);
}

public sealed class SpaceRepository(
    AppDbContext context,
    ISpaceByIdDataLoader spaceByIdLoader
) : ISpaceRepository {
    public IQueryable<Space> GetAll()
        => context.Spaces;

    public IQueryable<Space> GetById(Guid id)
        => context.Spaces.Where(s => s.Id == id);

    public IQueryable<Space> GetByOwnerId(Guid ownerProfileId)
        => context.Spaces.Where(s => s.SpaceOwnerProfileId == ownerProfileId);

    public async Task<Space?> GetByIdAsync(Guid id, CancellationToken ct)
        => await spaceByIdLoader.LoadAsync(id, ct);

    public async Task<Space> AddAsync(Space space, CancellationToken ct) {
        context.Spaces.Add(space);
        await context.SaveChangesAsync(ct);
        return space;
    }
}
```

**Key Rule**: Repositories NEVER expose a raw `Query()` method. Instead, provide specific filtered IQueryable methods like `GetById()`, `GetByOwnerId()`, etc. This maintains encapsulation and prevents services from building arbitrary queries.

**Example - DI Registration:**

```csharp
services.AddScoped<IUserRepository, UserRepository>();
services.AddScoped<IUserService, UserService>();
services.AddScoped<ISpaceRepository, SpaceRepository>();
services.AddScoped<ISpaceService, SpaceService>();
services.AddScoped<IBookingRepository, BookingRepository>();
services.AddScoped<IBookingService, BookingService>();
```

---

## DataLoaders

### Purpose

DataLoaders solve the N+1 query problem by batching multiple individual requests into a single database query. They are
request-scoped, meaning all requests within a single GraphQL operation are batched together.

### Complete DataLoader Inventory

| Feature           | DataLoader                             | Key  | Returns                          | Description                      |
|-------------------|----------------------------------------|------|----------------------------------|----------------------------------|
| **Users**         | GetUserByIdAsync                       | Guid | User                             | Single user lookup               |
|                   | GetAdvertiserProfileByUserIdAsync      | Guid | AdvertiserProfile                | Profile by user                  |
|                   | GetSpaceOwnerProfileByUserIdAsync      | Guid | SpaceOwnerProfile                | Profile by user                  |
|                   | GetSpaceOwnerProfileByIdAsync          | Guid | SpaceOwnerProfile                | Profile by profile ID            |
| **Spaces**        | GetSpaceByIdAsync                      | Guid | Space                            | Single space lookup              |
|                   | GetSpacesByOwnerProfileIdAsync         | Guid | ILookup<Space>                   | All spaces for owner             |
| **Campaigns**     | GetCampaignByIdAsync                   | Guid | Campaign                         | Single campaign lookup           |
|                   | GetCampaignsByAdvertiserProfileIdAsync | Guid | ILookup<Campaign>                | All campaigns for advertiser     |
| **Bookings**      | GetBookingByIdAsync                    | Guid | Booking                          | Single booking lookup            |
|                   | GetBookingsByCampaignIdAsync           | Guid | ILookup<Booking>                 | All bookings for campaign        |
|                   | GetBookingsBySpaceIdAsync              | Guid | ILookup<Booking>                 | All bookings for space           |
|                   | GetProofByBookingIdAsync               | Guid | BookingProof                     | Proof for booking (1:1)          |
|                   | GetDisputeByBookingIdAsync             | Guid | BookingDispute                   | Dispute for booking (1:1)        |
| **Payments**      | GetPaymentByIdAsync                    | Guid | Payment                          | Single payment lookup            |
|                   | GetPaymentsByBookingIdAsync            | Guid | ILookup<Payment>                 | All payments for booking         |
|                   | GetRefundsByPaymentIdAsync             | Guid | ILookup<Refund>                  | All refunds for payment          |
| **Payouts**       | GetPayoutByIdAsync                     | Guid | Payout                           | Single payout lookup             |
|                   | GetPayoutsByBookingIdAsync             | Guid | ILookup<Payout>                  | All payouts for booking          |
|                   | GetPayoutsByOwnerProfileIdAsync        | Guid | ILookup<Payout>                  | All payouts for owner            |
| **Reviews**       | GetReviewByIdAsync                     | Guid | Review                           | Single review lookup             |
|                   | GetReviewsByBookingIdAsync             | Guid | ILookup<Review>                  | All reviews for booking          |
|                   | GetReviewsBySpaceIdAsync               | Guid | ILookup<Review>                  | All reviews for space            |
| **Notifications** | GetNotificationByIdAsync               | Guid | Notification                     | Single notification lookup       |
|                   | GetNotificationsByUserIdAsync          | Guid | ILookup<Notification>            | All notifications for user       |
| **Preferences**   | GetPreferencesByUserIdAsync            | Guid | ILookup<NotificationPreference>  | All preferences for user         |
| **Conversations** | GetConversationByIdAsync               | Guid | Conversation                     | Single conversation lookup       |
|                   | GetConversationsByUserIdAsync          | Guid | ILookup<Conversation>            | All conversations for user       |
| **Messages**      | GetMessagesByConversationIdAsync       | Guid | ILookup<Message>                 | All messages in conversation     |
| **Participants**  | GetParticipantsByConversationIdAsync   | Guid | ILookup<ConversationParticipant> | All participants in conversation |
| **Transactions**  | GetTransactionsByBookingIdAsync        | Guid | ILookup<Transaction>             | All transactions for booking     |

### DataLoader Return Types

| Pattern                        | Use Case                          | Example                                             |
|--------------------------------|-----------------------------------|-----------------------------------------------------|
| `IReadOnlyDictionary<Guid, T>` | 1:1 relationships, single lookups | GetUserByIdAsync, GetProofByBookingIdAsync          |
| `ILookup<Guid, T>`             | 1:N relationships                 | GetBookingsBySpaceIdAsync, GetReviewsBySpaceIdAsync |

**Example - 1:1 DataLoader (Dictionary):**

```csharp
internal static class BookingDataLoaders {
    [DataLoader]
    public static async Task<IReadOnlyDictionary<Guid, BookingProof>> GetProofByBookingIdAsync(
        IReadOnlyList<Guid> bookingIds,
        AppDbContext context,
        CancellationToken ct
    ) => await context.BookingProofs
        .Where(p => bookingIds.Contains(p.BookingId))
        .ToDictionaryAsync(p => p.BookingId, ct);
}
```

**Example - 1:N DataLoader (Lookup):**

```csharp
[DataLoader]
public static async Task<ILookup<Guid, Booking>> GetBookingsBySpaceIdAsync(
    IReadOnlyList<Guid> spaceIds,
    AppDbContext context,
    CancellationToken ct
) => (await context.Bookings
    .Where(b => spaceIds.Contains(b.SpaceId))
    .ToListAsync(ct))
    .ToLookup(b => b.SpaceId);
```

**Example - Using DataLoader in Extension:**

```csharp
[ExtendObjectType<Space>]
public static class SpaceExtensions {
    public static async Task<IEnumerable<Booking>> GetBookings(
        [Parent] Space space,
        IBookingsBySpaceIdDataLoader loader
    ) => await loader.LoadAsync(space.Id);
}
```

---

## Queries

### Users Feature

| Query | Auth     | Pagination | Filtering | Sorting | Status | File |
|-------|----------|------------|-----------|---------|--------|------|
| `me`  | Required | No         | No        | No      | ✅ Implemented | UserQueries.cs |

**Example - GraphQL Usage:**

```graphql
query {
  me {
    id
    email
    name
    advertiserProfile {
      companyName
      campaigns { nodes { name } }
    }
    spaceOwnerProfile {
      businessName
      spaces { nodes { title } }
    }
  }
}
```

### Spaces Feature

| Query              | Auth     | Pagination | Filtering | Sorting | Status | File |
|--------------------|----------|------------|-----------|---------|--------|------|
| `spaceById(id)`    | Required | No         | No        | No      | ✅ Implemented | SpaceQueries.cs |
| `spaces`           | None     | Yes        | Yes       | Yes     | ✅ Implemented | SpaceQueries.cs |
| `mySpaces`         | Required | Yes        | Yes       | Yes     | ✅ Implemented | SpaceQueries.cs |

**Note:** `spaces` excludes current user's own spaces (via `GetSpacesExcludingCurrentUserQuery`).

**Example - GraphQL Usage:**

```graphql
query {
  spaces(first: 20, where: { type: { eq: STOREFRONT } }, order: { createdAt: DESC }) {
    nodes { id title pricePerDay }
    pageInfo { hasNextPage }
  }
}

query {
  mySpaces(first: 10) {
    nodes { id title status }
  }
}
```

### Campaigns Feature

| Query              | Auth     | Pagination | Filtering | Sorting | Status | File |
|--------------------|----------|------------|-----------|---------|--------|------|
| `campaignById(id)` | Required | No         | No        | No      | ✅ Implemented | CampaignQueries.cs |
| `myCampaigns`      | Required | Yes        | Yes       | Yes     | ✅ Implemented | CampaignQueries.cs |

**Example - GraphQL Usage:**

```graphql
query {
  myCampaigns(where: { status: { in: [DRAFT, SUBMITTED] } }) {
    nodes {
      id
      name
      status
      bookings { totalCount }
    }
  }
}
```

### Bookings Feature

| Query                     | Auth     | Pagination | Filtering | Sorting | Status | File |
|---------------------------|----------|------------|-----------|---------|--------|------|
| `bookingById(id)`         | Required | No         | No        | No      | ✅ Implemented | BookingQueries.cs |
| `myBookingsAsAdvertiser`  | Required | Yes        | Yes       | Yes     | ✅ Implemented | BookingQueries.cs |
| `myBookingsAsOwner`       | Required | Yes        | Yes       | Yes     | ✅ Implemented | BookingQueries.cs |
| `incomingBookingRequests` | Required | Yes        | No        | Yes     | ✅ Implemented | BookingQueries.cs |
| `bookingsRequiringAction` | Required | Yes        | No        | No      | ✅ Implemented | BookingQueries.cs |

**Example - GraphQL Usage:**

```graphql
query {
  myBookingsAsAdvertiser(where: { status: { in: [PAID, VERIFIED] } }, order: { startDate: ASC }) {
    nodes {
      id
      status
      totalAmount
      space { title }
    }
  }
}
```

### Payments Feature

| Query                              | Auth     | Pagination | Filtering | Sorting | Status | File |
|------------------------------------|----------|------------|-----------|---------|--------|------|
| `paymentById(id)`                  | Required | No         | No        | No      | ✅ Implemented | PaymentQueries.cs |
| `paymentsByBooking(bookingId)`     | Required | Yes        | Yes       | Yes     | ✅ Implemented | PaymentQueries.cs |
| `myPayouts`                        | Required | Yes        | Yes       | Yes     | ✅ Implemented | PayoutQueries.cs |
| `payoutById(id)`                   | Required | No         | No        | No      | ✅ Implemented | PayoutQueries.cs |
| `earningsSummary`                  | Required | No         | No        | No      | ✅ Implemented | PayoutQueries.cs |
| `transactionsByBooking(bookingId)` | Admin    | Yes        | Yes       | Yes     | ✅ Implemented | TransactionQueries.cs |

**Example - GraphQL Usage:**

```graphql
query {
  earningsSummary {
    totalEarnings
    pendingPayouts
    thisMonthEarnings
  }
}

query {
  myPayouts(first: 10, order: { processedAt: DESC }) {
    nodes { id amount stage status }
  }
}
```

### Reviews Feature

| Query                                      | Auth     | Pagination | Filtering | Sorting | Status | File |
|--------------------------------------------|----------|------------|-----------|---------|--------|------|
| `reviewsBySpace(spaceId)`                  | None     | Yes        | No        | Yes     | ✅ Implemented | ReviewQueries.cs |
| `reviewByBooking(bookingId, reviewerType)` | Required | No         | No        | No      | ✅ Implemented | ReviewQueries.cs |
| `myReviews`                                | Required | Yes        | No        | Yes     | ✅ Implemented | ReviewQueries.cs |

**Example - GraphQL Usage:**

```graphql
query {
  reviewsBySpace(spaceId: "xxx", first: 5, order: { createdAt: DESC }) {
    nodes { rating comment createdAt }
  }
}
```

### Notifications Feature

| Query                        | Auth     | Pagination | Filtering | Sorting | Status | File |
|------------------------------|----------|------------|-----------|---------|--------|------|
| `myNotifications`            | Required | Yes        | Yes       | Yes     | ✅ Implemented | NotificationQueries.cs |
| `notificationById(id)`       | Required | No         | No        | No      | ✅ Implemented | NotificationQueries.cs |
| `unreadNotificationsCount`   | Required | No         | No        | No      | ✅ Implemented | NotificationQueries.cs |
| `myNotificationPreferences`  | Required | No         | No        | No      | ✅ Implemented | NotificationQueries.cs |

**Example - GraphQL Usage:**

```graphql
query {
  myNotifications(where: { isRead: { eq: false } }, first: 10) {
    nodes { id type title body createdAt }
  }
  unreadNotificationsCount
}
```

### Messaging Feature

| Query                                    | Auth     | Pagination | Filtering | Sorting | Status | File |
|------------------------------------------|----------|------------|-----------|---------|--------|------|
| `conversationById(id)`                   | Required | No         | No        | No      | ✅ Implemented | ConversationQueries.cs |
| `myConversations`                        | Required | Yes        | Yes       | Yes     | ✅ Implemented | ConversationQueries.cs |
| `unreadConversationsCount`               | Required | No         | No        | No      | ✅ Implemented | ConversationQueries.cs |
| `messagesByConversation(conversationId)` | Required | Yes        | Yes       | Yes     | ✅ Implemented | MessageQueries.cs |

**Example - GraphQL Usage:**

```graphql
query {
  myConversations(first: 20) {
    nodes {
      id
      updatedAt
      participants { user { name } }
      messages(first: 1) { nodes { content } }
    }
  }
}
```

---

## Mutations

### Users Feature

| Mutation | Auth | Status | File |
|----------|------|--------|------|
| *(all commented out)* | - | ❌ Not implemented | UserMutations.cs |

**Planned mutations (from spec):**
- `updateCurrentUser(input)` - Update name, phone, avatar
- `switchProfileType(type)` - Switch between Advertiser/SpaceOwner
- `updateAdvertiserProfile(input)` - Update company info
- `updateSpaceOwnerProfile(input)` - Update business info, payout schedule
- `completeOnboarding(profileType)` - Mark onboarding complete
- `deleteUser(id)` - Admin: Soft delete user

### Spaces Feature

| Mutation                 | Auth     | Status | File |
|--------------------------|----------|--------|------|
| `createSpace(input)`     | Required | ✅ Implemented | SpaceMutations.cs |
| `updateSpace(id, input)` | Required | ✅ Implemented | SpaceMutations.cs |
| `deleteSpace(id)`        | Required | ✅ Implemented | SpaceMutations.cs |
| `deactivateSpace(id)`    | Required | ✅ Implemented | SpaceMutations.cs |
| `reactivateSpace(id)`    | Required | ✅ Implemented | SpaceMutations.cs |

**Planned mutations (not yet implemented):**
- `approveSpace(id)` - Admin: Approve pending listing
- `rejectSpace(id, reason)` - Admin: Reject listing
- `suspendSpace(id, reason)` - Admin: Suspend active listing

### Campaigns Feature

| Mutation                    | Auth     | Status | File |
|-----------------------------|----------|--------|------|
| `createCampaign(input)`     | Required | ✅ Implemented | CampaignMutations.cs |
| `updateCampaign(id, input)` | Required | ✅ Implemented | CampaignMutations.cs |
| `deleteCampaign(id)`        | Required | ✅ Implemented | CampaignMutations.cs |
| `submitCampaign(id)`        | Required | ✅ Implemented | CampaignMutations.cs |
| `cancelCampaign(id)`        | Required | ✅ Implemented | CampaignMutations.cs |

### Bookings Feature

| Mutation                           | Auth     | Status | File |
|------------------------------------|----------|--------|------|
| `createBooking(campaignId, input)` | Required | ✅ Implemented | BookingMutations.cs |
| `approveBooking(id, ownerNotes?)`  | Required | ✅ Implemented | BookingMutations.cs |
| `rejectBooking(id, reason)`        | Required | ✅ Implemented | BookingMutations.cs |
| `cancelBooking(id, reason)`        | Required | ✅ Implemented | BookingMutations.cs |
| `markFileDownloaded(id)`           | Required | ✅ Implemented | BookingMutations.cs |
| `markInstalled(id)`                | Required | ✅ Implemented | BookingMutations.cs |

**Planned mutations (not yet implemented):**
- `submitProof(id, input)` - Upload verification photos
- `approveProof(id)` - Advertiser approves proof
- `disputeProof(id, input)` - Advertiser disputes proof
- `resolveDispute(id, input)` - Admin: Resolve dispute

**Booking Status Transition Rules:**

| From            | Allowed To      | Trigger                                 |
|-----------------|-----------------|-----------------------------------------|
| -               | PendingApproval | createBooking                           |
| PendingApproval | Approved        | approveBooking                          |
| PendingApproval | Rejected        | rejectBooking                           |
| Approved        | Paid            | Payment confirmed (webhook)             |
| Approved        | Cancelled       | cancelBooking                           |
| Paid            | FileDownloaded  | markFileDownloaded                      |
| Paid            | Cancelled       | cancelBooking                           |
| FileDownloaded  | Installed       | markInstalled                           |
| Installed       | Verified        | submitProof                             |
| Verified        | Completed       | approveProof or auto-approve            |
| Verified        | Disputed        | disputeProof                            |
| Disputed        | Completed       | resolveDispute (in favor of owner)      |
| Disputed        | Cancelled       | resolveDispute (in favor of advertiser) |

**Example - Booking Flow:**

```graphql
# 1. Advertiser creates booking
mutation {
  createBooking(
    campaignId: "campaign-id"
    input: {
      spaceId: "space-id"
      startDate: "2026-02-01"
      endDate: "2026-02-14"
      advertiserNotes: "Please install by morning"
    }
  ) {
    id
    status
    totalAmount
  }
}

# 2. Owner approves
mutation {
  approveBooking(id: "booking-id", ownerNotes: "Will install Feb 1st") {
    id
    status
  }
}

# 3. Owner submits proof after installation
mutation {
  submitProof(
    id: "booking-id"
    input: {
      photos: [
        "https://cdn.example.com/proof-wide.jpg"
        "https://cdn.example.com/proof-closeup.jpg"
        "https://cdn.example.com/proof-angle.jpg"
      ]
    }
  ) {
    id
    status
    proof {
      autoApproveAt
    }
  }
}

# 4. Advertiser approves (or wait 48hr for auto-approve)
mutation {
  approveProof(id: "booking-id") {
    id
    status
  }
}
```

### Payments Feature

| Mutation                                   | Auth     | Status | File |
|--------------------------------------------|----------|--------|------|
| `createPaymentIntent(bookingId)`           | Required | ✅ Implemented | PaymentMutations.cs |
| `confirmPayment(paymentIntentId)`          | Required | ✅ Implemented | PaymentMutations.cs |
| `requestRefund(paymentId, amount, reason)` | Admin    | ✅ Implemented | RefundMutations.cs |
| `processPayout(bookingId, stage)`          | Admin    | ✅ Implemented | PayoutMutations.cs |
| `retryPayout(payoutId)`                    | Admin    | ✅ Implemented | PayoutMutations.cs |
| `connectStripeAccount`                     | Required | ✅ Implemented | StripeConnectMutations.cs |
| `refreshStripeAccountStatus`               | Required | ✅ Implemented | StripeConnectMutations.cs |

**Example - Payment Flow:**

```graphql
# 1. Create payment intent
mutation {
  createPaymentIntent(bookingId: "booking-id") {
    clientSecret
    paymentIntentId
    amount
  }
}

# 2. After Stripe.js confirms on frontend, confirm backend
mutation {
  confirmPayment(paymentIntentId: "pi_xxx") {
    id
    status
    amount
  }
}
```

### Reviews Feature

| Mutation                         | Auth     | Status | File |
|----------------------------------|----------|--------|------|
| `createReview(bookingId, input)` | Required | ✅ Implemented | ReviewMutations.cs |
| `updateReview(id, input)`        | Required | ✅ Implemented | ReviewMutations.cs |
| `deleteReview(id)`               | Admin    | ✅ Implemented | ReviewMutations.cs |

**Review Rules:**

- Only one review per booking per reviewer type
- Booking must be Completed status
- Rating: 1-5 integer
- Both parties can review (Advertiser reviews space, Owner reviews advertiser)

**Example - GraphQL Usage:**

```graphql
mutation {
  createReview(
    bookingId: "booking-id"
    input: { rating: 5, comment: "Great location, easy to work with!" }
  ) {
    id
    rating
    comment
  }
}
```

### Notifications Feature

| Mutation                                    | Auth     | Status | File |
|---------------------------------------------|----------|--------|------|
| `markNotificationRead(id)`                  | Required | ✅ Implemented | NotificationMutations.cs |
| `markAllNotificationsRead`                  | Required | ✅ Implemented | NotificationMutations.cs |
| `deleteNotification(id)`                    | Required | ✅ Implemented | NotificationMutations.cs |
| `updateNotificationPreference(type, input)` | Required | ✅ Implemented | NotificationMutations.cs |

**Planned mutations (not yet implemented):**
- `registerDeviceToken(token, platform)` - Register for push notifications
- `unregisterDeviceToken(token)` - Remove device from push

**Example - GraphQL Usage:**

```graphql
mutation {
  markAllNotificationsRead
}

mutation {
  updateNotificationPreference(
    type: BOOKING_REQUESTED
    input: { emailEnabled: true, pushEnabled: true, inAppEnabled: true }
  ) {
    notificationType
    emailEnabled
    pushEnabled
  }
}
```

### Messaging Feature

| Mutation                                  | Auth     | Status | File |
|-------------------------------------------|----------|--------|------|
| `createBookingConversation(bookingId)`    | Required | ✅ Implemented | ConversationMutations.cs |
| `sendMessage(conversationId, content, type?, attachments?)` | Required | ✅ Implemented | MessageMutations.cs |
| `markConversationRead(id)`                | Required | ✅ Implemented | ConversationMutations.cs |

**Example - GraphQL Usage:**

```graphql
mutation {
  sendMessage(
    conversationId: "conv-id"
    input: { content: "Hi, I have a question about the installation." }
  ) {
    id
    content
    createdAt
  }
}
```

---

## Subscriptions

### Implementation Approach

- **Transport**: WebSocket (graphql-ws protocol)
- **Pub/Sub Backend**: In-memory for development, Redis for production
- **Scope**: Request-scoped (per-connection)

### All Subscriptions

| Subscription      | Parameters     | Payload      | Status | File |
|-------------------|----------------|--------------|--------|------|
| `onNotification`  | userId         | Notification | ✅ Implemented | NotificationSubscriptions.cs |
| `onMessage`       | conversationId | Message      | ✅ Implemented | NotificationSubscriptions.cs |
| `onBookingUpdate` | bookingId      | Booking      | ✅ Implemented | NotificationSubscriptions.cs |
| `onProofUpdate`   | bookingId      | BookingProof | ✅ Implemented | NotificationSubscriptions.cs |

**Planned subscriptions (not yet implemented):**
- `onPaymentUpdate(paymentId)` - Payment status changed
- `onPayoutUpdate(payoutId)` - Payout status changed
- `onSpaceUpdate(spaceId)` - Space status changed (admin actions)

### Topic Naming Convention

```
{entityId}:{eventType}
```

Examples:

- `{userId}:notifications` - User's notification stream
- `{conversationId}:messages` - Conversation message stream
- `{bookingId}:updates` - Booking status updates
- `{bookingId}:proof` - Proof submission/review events

### Event Publishing Points

| Event         | Published When                    | Services Responsible         |
|---------------|-----------------------------------|------------------------------|
| Notification  | Any notification created          | NotificationService          |
| Message       | Message sent                      | MessagingService             |
| BookingUpdate | Status transition                 | BookingService               |
| ProofUpdate   | Proof submitted/approved/rejected | BookingService               |
| PaymentUpdate | Payment confirmed/failed/refunded | PaymentService (via webhook) |
| PayoutUpdate  | Payout processed/failed           | PaymentService               |
| SpaceUpdate   | Admin approve/reject/suspend      | SpaceService                 |

**Example - Subscription Definition:**

```csharp
[SubscriptionType]
public static partial class NotificationSubscriptions {
    [Authorize]
    [Subscribe]
    [Topic("{userId}:notifications")]
    public static Notification OnNotification(
        Guid userId,
        [EventMessage] Notification notification
    ) => notification;
}
```

**Example - Publishing Event from Service:**

```csharp
public async Task<Notification> SendAsync(
    Guid userId,
    NotificationType type,
    string title,
    string body,
    CancellationToken ct
) {
    var notification = new Notification { /* ... */ };
    context.Notifications.Add(notification);
    await context.SaveChangesAsync(ct);

    await eventSender.SendAsync(
        $"{userId}:notifications",
        notification,
        ct
    );

    return notification;
}
```

**Example - GraphQL Usage:**

```graphql
subscription {
  onNotification(userId: "user-id") {
    id
    type
    title
    body
  }
}

subscription {
  onMessage(conversationId: "conv-id") {
    id
    content
    senderUser {
      name
    }
  }
}
```

---

## Service Interfaces

### IUserService

| Method                       | Parameters                                      | Returns           | Description               |
|------------------------------|-------------------------------------------------|-------------------|---------------------------|
| UpdateAsync                  | UpdateUserInput, CancellationToken              | User              | Update current user       |
| SwitchProfileTypeAsync       | ProfileType, CancellationToken                  | User              | Change active profile     |
| UpdateAdvertiserProfileAsync | UpdateAdvertiserProfileInput, CancellationToken | AdvertiserProfile | Update advertiser details |
| UpdateSpaceOwnerProfileAsync | UpdateSpaceOwnerProfileInput, CancellationToken | SpaceOwnerProfile | Update owner details      |
| CompleteOnboardingAsync      | ProfileType, CancellationToken                  | User              | Mark onboarding done      |
| DeleteAsync                  | Guid, CancellationToken                         | bool              | Delete user (admin)       |

### ISpaceService

| Method          | Parameters                                | Returns | Description    |
|-----------------|-------------------------------------------|---------|----------------|
| CreateAsync     | CreateSpaceInput, CancellationToken       | Space   | Create listing |
| UpdateAsync     | Guid, UpdateSpaceInput, CancellationToken | Space   | Update listing |
| DeleteAsync     | Guid, CancellationToken                   | bool    | Hard delete    |
| DeactivateAsync | Guid, CancellationToken                   | Space   | Soft delete    |
| ReactivateAsync | Guid, CancellationToken                   | Space   | Restore        |
| ApproveAsync    | Guid, CancellationToken                   | Space   | Admin approve  |
| RejectAsync     | Guid, string, CancellationToken           | Space   | Admin reject   |
| SuspendAsync    | Guid, string, CancellationToken           | Space   | Admin suspend  |

### ICampaignService

| Method      | Parameters                                   | Returns  | Description        |
|-------------|----------------------------------------------|----------|--------------------|
| CreateAsync | CreateCampaignInput, CancellationToken       | Campaign | Create draft       |
| UpdateAsync | Guid, UpdateCampaignInput, CancellationToken | Campaign | Update campaign    |
| DeleteAsync | Guid, CancellationToken                      | bool     | Delete campaign    |
| SubmitAsync | Guid, CancellationToken                      | Campaign | Submit for booking |
| CancelAsync | Guid, CancellationToken                      | Campaign | Cancel campaign    |

### IBookingService

| Method                        | Parameters                                   | Returns | Description               |
|-------------------------------|----------------------------------------------|---------|---------------------------|
| CreateAsync                   | CreateBookingInput, Guid, CancellationToken  | Booking | Create request            |
| ApproveAsync                  | Guid, string?, CancellationToken             | Booking | Accept request            |
| RejectAsync                   | Guid, string, CancellationToken              | Booking | Decline request           |
| CancelAsync                   | Guid, string, CancellationToken              | Booking | Cancel booking            |
| MarkFileDownloadedAsync       | Guid, CancellationToken                      | Booking | File downloaded           |
| MarkInstalledAsync            | Guid, CancellationToken                      | Booking | Mark installed            |
| SubmitProofAsync              | Guid, SubmitProofInput, CancellationToken    | Booking | Upload proof              |
| ApproveProofAsync             | Guid, CancellationToken                      | Booking | Approve proof             |
| DisputeProofAsync             | Guid, DisputeProofInput, CancellationToken   | Booking | File dispute              |
| ResolveDisputeAsync           | Guid, ResolveDisputeInput, CancellationToken | Booking | Resolve dispute           |
| ValidateStatusTransitionAsync | Guid, BookingStatus, CancellationToken       | bool    | Check if transition valid |

### IReviewService

| Method      | Parameters                                 | Returns | Description   |
|-------------|--------------------------------------------|---------|---------------|
| CreateAsync | Guid, CreateReviewInput, CancellationToken | Review  | Create review |
| UpdateAsync | Guid, UpdateReviewInput, CancellationToken | Review  | Update review |
| DeleteAsync | Guid, CancellationToken                    | bool    | Delete review |

### IPaymentService

| Method                    | Parameters                               | Returns             | Description          |
|---------------------------|------------------------------------------|---------------------|----------------------|
| CreatePaymentIntentAsync  | Guid, CancellationToken                  | PaymentIntent       | Create Stripe intent |
| ConfirmPaymentAsync       | string, CancellationToken                | Payment             | Confirm payment      |
| RequestRefundAsync        | Guid, decimal, string, CancellationToken | Refund              | Process refund       |
| ProcessPayoutAsync        | Guid, CancellationToken                  | Payout              | Process payout       |
| RetryPayoutAsync          | Guid, CancellationToken                  | Payout              | Retry failed payout  |
| CreateConnectAccountAsync | CancellationToken                        | StripeConnectResult | Start onboarding     |
| RefreshAccountStatusAsync | CancellationToken                        | SpaceOwnerProfile   | Check account health |

### INotificationService

| Method                | Parameters                                                                | Returns      | Description         |
|-----------------------|---------------------------------------------------------------------------|--------------|---------------------|
| SendAsync             | Guid, NotificationType, string, string, string?, Guid?, CancellationToken | Notification | Send notification   |
| MarkReadAsync         | Guid, CancellationToken                                                   | Notification | Mark as read        |
| MarkAllReadAsync      | CancellationToken                                                         | int          | Mark all as read    |
| DeleteAsync           | Guid, CancellationToken                                                   | bool         | Delete notification |
| RegisterDeviceAsync   | string, string, CancellationToken                                         | bool         | Register push token |
| UnregisterDeviceAsync | string, CancellationToken                                                 | bool         | Remove push token   |

### IMessagingService

| Method                       | Parameters                                | Returns      | Description             |
|------------------------------|-------------------------------------------|--------------|-------------------------|
| GetOrCreateConversationAsync | Guid, CancellationToken                   | Conversation | Get/create conversation |
| SendMessageAsync             | Guid, SendMessageInput, CancellationToken | Message      | Send message            |
| MarkReadAsync                | Guid, CancellationToken                   | Conversation | Update last read        |

### INotificationPreferenceService

| Method           | Parameters                                                             | Returns                      | Description       |
|------------------|------------------------------------------------------------------------|------------------------------|-------------------|
| UpdateAsync      | NotificationType, UpdateNotificationPreferenceInput, CancellationToken | NotificationPreference       | Update preference |
| GetDefaultsAsync | CancellationToken                                                      | List<NotificationPreference> | Get all defaults  |

---

## Input Types

### User Inputs

| Input                        | Required Fields | Optional Fields                            |
|------------------------------|-----------------|--------------------------------------------|
| UpdateUserInput              | -               | name, phone, avatar                        |
| UpdateAdvertiserProfileInput | -               | companyName, industry, website             |
| UpdateSpaceOwnerProfileInput | -               | businessName, businessType, payoutSchedule |

**Example:**

```csharp
public record UpdateUserInput(
    string? Name,
    string? Phone,
    string? Avatar
);
```

### Space Inputs

| Input            | Required Fields                                                                  | Optional Fields                                                                                                                            |
|------------------|----------------------------------------------------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------|
| CreateSpaceInput | title, type, address, city, state, latitude, longitude, pricePerDay, minDuration | description, zipCode, width, height, dimensions, dimensionsText, installationFee, maxDuration, images, availableFrom, availableTo, traffic |
| UpdateSpaceInput | -                                                                                | title, description, pricePerDay, installationFee, minDuration, maxDuration, images, availableFrom, availableTo, traffic                    |
| GeoBoundsInput   | northEast, southWest                                                             | -                                                                                                                                          |
| GeoPointInput    | latitude, longitude                                                              | -                                                                                                                                          |

**Example:**

```csharp
public record CreateSpaceInput(
    string Title,
    string? Description,
    SpaceType Type,
    string Address,
    string City,
    string State,
    string? ZipCode,
    double Latitude,
    double Longitude,
    double? Width,
    double? Height,
    string? Dimensions,
    decimal PricePerDay,
    decimal? InstallationFee,
    int MinDuration,
    int? MaxDuration,
    List<string>? Images,
    DateTime? AvailableFrom,
    DateTime? AvailableTo,
    string? DimensionsText,
    string? Traffic
);

public record GeoBoundsInput(GeoPointInput NorthEast, GeoPointInput SouthWest);
public record GeoPointInput(double Latitude, double Longitude);
```

### Campaign Inputs

| Input               | Required Fields | Optional Fields                                                                     |
|---------------------|-----------------|-------------------------------------------------------------------------------------|
| CreateCampaignInput | name, imageUrl  | description, targetAudience, goals, totalBudget, startDate, endDate                 |
| UpdateCampaignInput | -               | name, description, imageUrl, targetAudience, goals, totalBudget, startDate, endDate |

### Booking Inputs

| Input               | Required Fields                   | Optional Fields |
|---------------------|-----------------------------------|-----------------|
| CreateBookingInput  | spaceId, startDate, endDate       | advertiserNotes |
| SubmitProofInput    | photos (3 required)               | -               |
| DisputeProofInput   | issueType, reason                 | photos          |
| ResolveDisputeInput | resolutionAction, resolutionNotes | refundAmount    |

**Example:**

```csharp
public record CreateBookingInput(
    Guid SpaceId,
    DateTime StartDate,
    DateTime EndDate,
    string? AdvertiserNotes
);

public record SubmitProofInput(List<string> Photos);

public record DisputeProofInput(
    DisputeIssueType IssueType,
    string Reason,
    List<string>? Photos
);
```

### Review Inputs

| Input             | Required Fields | Optional Fields |
|-------------------|-----------------|-----------------|
| CreateReviewInput | rating (1-5)    | comment         |
| UpdateReviewInput | -               | rating, comment |

### Notification Inputs

| Input                             | Required Fields | Optional Fields                         |
|-----------------------------------|-----------------|-----------------------------------------|
| UpdateNotificationPreferenceInput | -               | emailEnabled, pushEnabled, inAppEnabled |

### Messaging Inputs

| Input            | Required Fields | Optional Fields   |
|------------------|-----------------|-------------------|
| SendMessageInput | content         | type, attachments |

---

## Authorization Matrix

### Role-Based Access

| Operation Category       | User | Admin | Notes                    |
|--------------------------|------|-------|--------------------------|
| Own profile/data queries | ✓    | ✓     |                          |
| Other user queries       | ✗    | ✓     |                          |
| Public space browse      | ✓    | ✓     |                          |
| Space admin actions      | ✗    | ✓     | approve, reject, suspend |
| Booking CRUD (own)       | ✓    | ✓     |                          |
| Dispute resolution       | ✗    | ✓     |                          |
| Refund processing        | ✗    | ✓     |                          |
| Manual payout            | ✗    | ✓     |                          |
| User deletion            | ✗    | ✓     |                          |
| Transaction ledger       | ✗    | ✓     |                          |

### Resource-Based Access

| Resource                | Owner Check                                                 | Description           |
|-------------------------|-------------------------------------------------------------|-----------------------|
| Space mutations         | SpaceOwnerProfile.UserId == CurrentUser.Id                  | Only own spaces       |
| Campaign mutations      | AdvertiserProfile.UserId == CurrentUser.Id                  | Only own campaigns    |
| Booking approval/reject | Space.SpaceOwnerProfile.UserId == CurrentUser.Id            | Owner of booked space |
| Booking create          | Campaign.AdvertiserProfile.UserId == CurrentUser.Id         | Own campaign          |
| Proof approval/dispute  | Booking.Campaign.AdvertiserProfile.UserId == CurrentUser.Id | Advertiser who booked |
| Proof submission        | Booking.Space.SpaceOwnerProfile.UserId == CurrentUser.Id    | Space owner           |
| Conversation access     | Participant.UserId == CurrentUser.Id                        | Only participants     |

---

## Error Handling

### Domain Exceptions (Preferred)

Services throw domain exceptions from `Features/Shared/Errors/`. These are converted to GraphQL errors by `ErrorFilter`.

| Exception                          | Code                      | Description                           |
|------------------------------------|---------------------------|---------------------------------------|
| `NotFoundException`                | NOT_FOUND                 | Entity does not exist                 |
| `ForbiddenException`               | FORBIDDEN                 | Not authorized for action             |
| `ValidationException`              | VALIDATION_FAILED         | Input validation failed               |
| `InvalidStatusTransitionException` | INVALID_STATUS_TRANSITION | Booking status transition not allowed |
| `PaymentException`                 | PAYMENT_FAILED            | Stripe payment error                  |
| `ConflictException`                | CONFLICT                  | Resource conflict                     |

### Domain Exception Classes

```csharp
public abstract class DomainException(string code, string message)
    : Exception(message) {
    public string Code { get; } = code;
}

public sealed class NotFoundException(string entityType, Guid entityId)
    : DomainException("NOT_FOUND", $"{entityType} with ID {entityId} not found") {
    public string EntityType { get; } = entityType;
    public Guid EntityId { get; } = entityId;
}

public sealed class ForbiddenException(string action)
    : DomainException("FORBIDDEN", $"Not authorized to {action}") {
    public string Action { get; } = action;
}

public sealed class InvalidStatusTransitionException(string from, string to)
    : DomainException("INVALID_STATUS_TRANSITION", $"Cannot transition from {from} to {to}") {
    public string FromStatus { get; } = from;
    public string ToStatus { get; } = to;
}

public sealed class ConflictException(string entityType, string reason)
    : DomainException("CONFLICT", $"{entityType}: {reason}") {
    public string EntityType { get; } = entityType;
    public string Reason { get; } = reason;
}
```

### Usage in Service (domain exceptions)

Services throw domain exceptions - NEVER `GraphQLException`:

```csharp
public async Task<Booking> ApproveAsync(
    Guid userId, Guid id, string? ownerNotes, CancellationToken ct
) {
    var booking = await repository.GetByIdAsync(id, ct)
        ?? throw new NotFoundException("Booking", id);

    var space = await spaceRepository.GetByIdAsync(booking.SpaceId, ct)!;
    if (space.SpaceOwnerProfile.UserId != userId)
        throw new ForbiddenException("approve this booking");

    if (booking.Status != BookingStatus.PendingApproval)
        throw new InvalidStatusTransitionException(
            booking.Status.ToString(),
            BookingStatus.Approved.ToString());

    booking.Status = BookingStatus.Approved;
    booking.OwnerNotes = ownerNotes;
    return await repository.UpdateAsync(booking, ct);
}
```

### Mutation Resolver (declares errors)

Mutation resolvers declare `[Error<T>]` attributes for each domain exception the service might throw:

```csharp
[MutationType]
public static class BookingMutations {
    [Authorize]
    [Error<NotFoundException>]
    [Error<ForbiddenException>]
    [Error<InvalidStatusTransitionException>]
    public static async Task<Booking> ApproveBooking(
        [ID] Guid id,
        string? ownerNotes,
        IUserService userService,
        IBookingService bookingService,
        CancellationToken ct
    ) => await bookingService.ApproveAsync(userService.GetPrincipalId(), id, ownerNotes, ct);
}
```

### Generated GraphQL Schema

HotChocolate generates typed error unions for mutations:

```graphql
type Mutation {
  approveBooking(input: ApproveBookingInput!): ApproveBookingPayload!
}

type ApproveBookingPayload {
  booking: Booking
  errors: [ApproveBookingError!]
}

union ApproveBookingError = NotFoundError | ForbiddenError | InvalidStatusTransitionError
```

### Error Filter

The `ErrorFilter` converts domain exceptions to GraphQL errors:

```csharp
public sealed class ErrorFilter(IWebHostEnvironment env) : IErrorFilter {
    public IError OnError(IError error) {
        if (error.Exception is DomainException domain)
            return ErrorBuilder.FromError(error)
                .SetMessage(domain.Message)
                .SetCode(domain.Code)
                .RemoveException()
                .Build();

        if (env.IsDevelopment()) return error;

        return ErrorBuilder.FromError(error)
            .SetMessage("An unexpected error occurred.")
            .SetCode("INTERNAL_ERROR")
            .RemoveException()
            .Build();
    }
}
```

---

## Object Type Extensions

### Purpose

Extensions add authorization to navigation properties and resolve computed fields through Services, optimizing for
minimal database queries.

### How `[UseProjection]` Works

When a resolver returns `IQueryable<T>` with `[UseProjection]`, HotChocolate:

1. Inspects the GraphQL selection set (requested fields)
2. Generates an EF Core `.Select()` expression projecting only those fields
3. Navigation properties in the selection become JOINs in a single query

The repository returns plain `IQueryable` without `.Include()`:

```csharp
public IQueryable<User> GetUserById(Guid id)
    => context.Users.Where(u => u.Id == id);
```

### Query Optimization Patterns

| Relationship | Pattern | DB Queries | Example |
|--------------|---------|------------|---------|
| 1:1 | Navigation property + `[UseProjection]` | 1 (projection) | User → Profile |
| 1:N unpaginated | Navigation property + `[UseProjection]` | 1 (projection) | Small collections |
| 1:N paginated | Explicit resolver + `IQueryable` | 2 (required) | Profile → Spaces |
| 1:N paginated (optimized) | `ToBatchPageAsync` + DataLoader | 1 | Single-query nested pagination |

### 1:1 Projection (Single Query via LEFT JOIN)

For `User` → `AdvertiserProfile` / `SpaceOwnerProfile`, HotChocolate projects through navigation properties:

```graphql
query {
  me {
    name
    advertiserProfile { companyName }
    spaceOwnerProfile { businessName }
  }
}
```

Generated SQL (single query with LEFT JOINs):

```sql
SELECT u."Name", a."CompanyName", s."BusinessName"
FROM users u
LEFT JOIN advertiser_profiles a ON u."Id" = a."UserId"
LEFT JOIN space_owner_profiles s ON u."Id" = s."UserId"
WHERE u."Id" = @id
LIMIT 1
```

No explicit extensions needed - `[UseProjection]` handles 1:1 navigation properties automatically.

### 1:N Unpaginated (Single Query)

Small collections without pagination work via LEFT JOIN:

```graphql
query {
  me {
    spaceOwnerProfile {
      spaces { address city }
    }
  }
}
```

EF Core fetches all items via LEFT JOIN, materializing into `ICollection<T>`.

**Caveat:** If 1000 items exist, all 1000 are fetched. Use pagination for large collections.

### 1:N Paginated (Two Queries - Standard Approach)

Paginated collections require explicit resolvers returning `IQueryable<T>`:

```csharp
[ExtendObjectType<SpaceOwnerProfile>]
public static class SpaceOwnerProfileExtensions {
    [UsePaging]
    [UseProjection]
    [UseFiltering]
    [UseSorting]
    public static IQueryable<Space> GetSpaces(
        [Parent] SpaceOwnerProfile owner,
        ISpaceService spaceService)
        => spaceService.GetByOwnerId(owner.Id);
}
```

This results in 2 queries: one for parent entity, one for paginated children.

### 1:N Paginated Single Query (ToBatchPageAsync)

HotChocolate 14+ supports single-query nested pagination via `ToBatchPageAsync`:

```csharp
[DataLoader]
public static async Task<Dictionary<Guid, Page<Space>>> SpacesByOwnerIdAsync(
    IReadOnlyList<Guid> ownerIds,
    PagingArguments pagingArguments,
    AppDbContext context,
    CancellationToken ct)
    => await context.Spaces
        .AsNoTracking()
        .Where(s => ownerIds.Contains(s.SpaceOwnerProfileId))
        .OrderByDescending(s => s.CreatedAt).ThenBy(s => s.Id)
        .ToBatchPageAsync(s => s.SpaceOwnerProfileId, pagingArguments, ct);
```

**Requirements:**
- `GreenDonut.Data.EntityFramework` package
- Stable ordering with unique key at end (`.ThenBy(s => s.Id)`)

### Extension Points

| Type              | Extended Fields                    | Pattern | Notes |
|-------------------|------------------------------------|---------|-------|
| User              | advertiserProfile, spaceOwnerProfile | BindMember | 1:1, projection |
| AdvertiserProfile | campaigns, bookings                | IQueryable | 1:N, paginated |
| SpaceOwnerProfile | spaces, payouts                    | IQueryable | 1:N, paginated |
| Space             | bookings, reviews                  | IQueryable | 1:N, paginated |
| Campaign          | bookings                           | IQueryable | 1:N, paginated |
| Booking           | proof, dispute                     | BindMember | 1:1, projection |

**Example - 1:1 Extension (projection through navigation):**

```csharp
[ExtendObjectType<User>]
public static class UserExtensions {
    [Authorize]
    [BindMember(nameof(User.AdvertiserProfile))]
    public static AdvertiserProfile? AdvertiserProfile([Parent] User user)
        => user.AdvertiserProfile;

    [Authorize]
    [BindMember(nameof(User.SpaceOwnerProfile))]
    public static SpaceOwnerProfile? SpaceOwnerProfile([Parent] User user)
        => user.SpaceOwnerProfile;
}
```

**Example - 1:N Extension (paginated, separate query):**

```csharp
[ExtendObjectType<SpaceOwnerProfile>]
public static class SpaceOwnerProfileExtensions {
    [UsePaging]
    [UseProjection]
    [UseFiltering]
    [UseSorting]
    public static IQueryable<Space> GetSpaces(
        [Parent] SpaceOwnerProfile owner, ISpaceService spaceService
    ) => spaceService.GetByOwnerId(owner.Id);
}
```

**Key Rules**:
- 1:1 relationships: Use `[BindMember]` + return navigation property (enables projection in parent query)
- 1:N with pagination: Explicit resolver returning `IQueryable` from Service (separate query required)
- Extensions inject the service that owns the **returned type** (e.g., `ISpaceService` for `Space`, `ICampaignService` for `Campaign`)
- Extensions never fetch "current user" - always use `[Parent]` entity's ID

---

## GraphQL Configuration

**Example - Startup Configuration:**

```csharp
public static class Startup {
    public static IServiceCollection AddGraphQL(this IServiceCollection services) {
        services
            .AddGraphQLServer()
            .AddQueryType()
            .AddMutationType()
            .AddSubscriptionType()
            .AddProjections()
            .AddFiltering()
            .AddSorting()
            .AddAuthorization()
            .AddInMemorySubscriptions()
            .RegisterService<AppDbContext>(ServiceKind.Synchronized)
            .RegisterService<UserService>()
            .RegisterService<IUserService>()
            .RegisterService<ISpaceService>()
            .RegisterService<ICampaignService>()
            .RegisterService<IBookingService>()
            .RegisterService<IReviewService>()
            .RegisterService<IPaymentService>()
            .RegisterService<INotificationService>()
            .RegisterService<IMessagingService>()
            .RegisterService<INotificationPreferenceService>();

        return services;
    }
}
```

---

**Last Updated**: 2026-01-18