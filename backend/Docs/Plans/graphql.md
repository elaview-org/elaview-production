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
│   ├── UserDataLoaders.cs       # Batch data loading
│   ├── UserQueries.cs           # GraphQL queries
│   ├── UserMutations.cs         # GraphQL mutations
│   ├── UserInputs.cs            # Input types (records)
│   └── *Extensions.cs           # Object type extensions
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

| Layer      | Responsibility                                  | Returns                                |
|------------|-------------------------------------------------|----------------------------------------|
| Resolver   | HotChocolate middleware, delegate to Service    | `IQueryable<T>` or `Task<T>`           |
| Service    | Business logic, authorization, orchestration    | `IQueryable<T>` (reads), `Task<T>` (writes) |
| Repository | Data access via `IQueryable`, DataLoaders       | `IQueryable<T>` or `Task<T>`           |
| DataLoader | Batch fetching for mutation scenarios           | `IReadOnlyDictionary` or `ILookup`     |

**Key Rules**:

- Resolvers NEVER access Repository or AppDbContext directly
- All data flows through Service
- Interface + implementation live in same file (reduces file sprawl)
- DataLoaders used only for fetching entities in mutations (not for query extensions)
- Only `UserService` has `GetPrincipalId()` - other services receive IDs as parameters
- "My*" queries handled via extensions on User's profile types (not top-level queries)

### Return Type Rules

| Operation Type             | Service Returns | Resolver Returns | Why                               |
|----------------------------|-----------------|------------------|-----------------------------------|
| Paginated/filtered queries | IQueryable<T>   | IQueryable<T>    | Preserves HotChocolate middleware |
| Single entity by ID        | IQueryable<T>   | IQueryable<T>    | UseFirstOrDefault + UseProjection |
| Mutations                  | Task<T>         | Task<T>          | Single entity after write         |
| Extensions (1:1 relation)  | -               | T?               | [BindMember] + navigation prop    |
| Extensions (1:N relation)  | IQueryable<T>   | IQueryable<T>    | Preserves pagination/filtering    |

### Service Layer Pattern

**Service Responsibilities:**

- Business logic and validation
- Database operations via Repository (not direct AppDbContext)
- Cross-cutting concerns (notifications, payments)
- Authorization checks beyond role-based auth

**Repository Responsibilities:**

- Wraps DataLoaders for batched fetching
- Provides IQueryable for filtered/paginated queries
- CRUD operations via AppDbContext

**Resolver Responsibilities:**

- Thin wrappers that delegate to services
- HotChocolate middleware application (Authorize, Paging, Filtering, etc.)
- NEVER access Repository or AppDbContext directly

**Example - Service Interface + Implementation (same file):**

```csharp
public interface ISpaceService {
    IQueryable<Space> GetSpacesQuery();
    IQueryable<Space> GetSpaceByIdQuery(Guid id);
    Task<Space> CreateAsync(CreateSpaceInput input, CancellationToken ct);
    Task<Space> UpdateAsync(Guid id, UpdateSpaceInput input, CancellationToken ct);
    Task<bool> DeleteAsync(Guid id, CancellationToken ct);
}

public sealed class SpaceService(
    ISpaceRepository repository,
    IHttpContextAccessor httpContextAccessor
) : ISpaceService {
    public IQueryable<Space> GetSpacesQuery() => repository.Query();
    public IQueryable<Space> GetSpaceByIdQuery(Guid id)
        => repository.Query().Where(s => s.Id == id);

    public async Task<Space> CreateAsync(CreateSpaceInput input, CancellationToken ct) {
        var space = new Space { Title = input.Title /* ... */ };
        return await repository.AddAsync(space, ct);
    }
}
```

**Example - Repository Interface + Implementation (same file):**

```csharp
public interface ISpaceRepository {
    IQueryable<Space> Query();
    Task<Space?> GetByIdAsync(Guid id, CancellationToken ct);
    Task<Space> AddAsync(Space space, CancellationToken ct);
}

public sealed class SpaceRepository(
    AppDbContext context,
    ISpaceByIdDataLoader spaceByIdLoader
) : ISpaceRepository {
    public IQueryable<Space> Query() => context.Spaces;

    public async Task<Space?> GetByIdAsync(Guid id, CancellationToken ct)
        => await spaceByIdLoader.LoadAsync(id, ct);

    public async Task<Space> AddAsync(Space space, CancellationToken ct) {
        context.Spaces.Add(space);
        await context.SaveChangesAsync(ct);
        return space;
    }
}
```

**Example - DI Registration:**

```csharp
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

| Query          | Auth     | Pagination | Filtering | Sorting | Description                          |
|----------------|----------|------------|-----------|---------|--------------------------------------|
| `me`           | Required | No         | No        | No      | Returns authenticated user's profile |
| `userById(id)` | Admin    | No         | No        | No      | Get any user by ID                   |
| `users`        | Admin    | Yes        | Yes       | Yes     | List all users with full filtering   |

**Filters for `users`:**

- email (contains, equals)
- name (contains, equals)
- role (equals, in)
- status (equals, in)
- createdAt (range)
- lastLoginAt (range)

**Example - Query (delegates to Service):**

```csharp
[QueryType]
public static partial class UserQueries {
    [Authorize]
    [GraphQLName("me")]
    [UseFirstOrDefault]
    [UseProjection]
    public static IQueryable<User> Me(IUserService userService)
        => userService.GetCurrentUser();

    [Authorize(Roles = ["Admin"])]
    [UsePaging]
    [UseProjection]
    [UseFiltering]
    [UseSorting]
    public static IQueryable<User> Users(IUserService userService)
        => userService.GetAll();
}
```

**Example - GraphQL Usage:**

```graphql
query {
  me {
    id
    email
    name
    advertiserProfile {
      companyName
    }
  }
}

query {
  users(first: 10, where: { role: { eq: USER } }, order: { createdAt: DESC }) {
    nodes {
      id
      email
    }
    pageInfo {
      hasNextPage
    }
  }
}
```

### Spaces Feature

| Query                    | Auth     | Pagination | Filtering | Sorting | Description                            |
|--------------------------|----------|------------|-----------|---------|----------------------------------------|
| `spaceById(id)`          | Required | No         | No        | No      | Get space details                      |
| `spaces`                 | Optional | Yes        | Yes       | Yes     | Browse available spaces (excludes own) |
| `spacesInBounds(bounds)` | Optional | Yes        | Yes       | No      | Spaces within geographic rectangle     |
| `mySpaces`               | Required | Yes        | Yes       | Yes     | Space owner's listings                 |

**Filters for `spaces`:**

- type (equals, in)
- status (equals, in)
- city (equals, contains)
- state (equals)
- pricePerDay (range)
- minDuration (range)
- availableFrom (range)
- availableTo (range)
- averageRating (range)

**Geographic Query `spacesInBounds`:**

- Input: `{ northEast: { latitude, longitude }, southWest: { latitude, longitude } }`
- Returns spaces where coordinates fall within bounding box
- Used for map-based discovery

**Example - Query with Geographic Filter:**

```csharp
[UsePaging]
[UseProjection]
[UseFiltering]
public static IQueryable<Space> GetSpacesInBounds(
    GeoBoundsInput bounds,
    AppDbContext context,
    UserService userService
) {
    var query = context.Spaces
        .Where(s => s.Status == SpaceStatus.Active)
        .Where(s => s.Latitude >= bounds.SouthWest.Latitude)
        .Where(s => s.Latitude <= bounds.NorthEast.Latitude)
        .Where(s => s.Longitude >= bounds.SouthWest.Longitude)
        .Where(s => s.Longitude <= bounds.NorthEast.Longitude);

    if (userService.PrincipalId() is { } userId)
        query = query.Where(s => s.SpaceOwnerProfile.UserId.ToString() != userId);

    return query;
}
```

**Example - GraphQL Usage:**

```graphql
query {
  spaces(
    first: 20
    where: { type: { eq: STOREFRONT }, pricePerDay: { lte: 50 } }
    order: { averageRating: DESC }
  ) {
    nodes {
      id
      title
      pricePerDay
      averageRating
    }
  }
}

query {
  spacesInBounds(
    bounds: {
      northEast: { latitude: 34.1, longitude: -117.8 }
      southWest: { latitude: 33.7, longitude: -118.4 }
    }
  ) {
    nodes {
      id
      latitude
      longitude
    }
  }
}
```

### Campaigns Feature

| Query              | Auth     | Pagination | Filtering | Sorting | Description             |
|--------------------|----------|------------|-----------|---------|-------------------------|
| `campaignById(id)` | Required | No         | No        | No      | Get campaign (own only) |
| `myCampaigns`      | Required | Yes        | Yes       | Yes     | Advertiser's campaigns  |

**Filters for `myCampaigns`:**

- status (equals, in)
- name (contains)
- createdAt (range)
- startDate (range)
- endDate (range)

**Example - GraphQL Usage:**

```graphql
query {
  myCampaigns(where: { status: { in: [DRAFT, SUBMITTED] } }) {
    nodes {
      id
      name
      status
      bookings {
        totalCount
      }
    }
  }
}
```

### Bookings Feature

| Query                     | Auth     | Pagination | Filtering | Sorting | Description                  |
|---------------------------|----------|------------|-----------|---------|------------------------------|
| `bookingById(id)`         | Required | No         | No        | No      | Get booking (own only)       |
| `myBookingsAsAdvertiser`  | Required | Yes        | Yes       | Yes     | Bookings via owned campaigns |
| `myBookingsAsOwner`       | Required | Yes        | Yes       | Yes     | Bookings on owned spaces     |
| `incomingBookingRequests` | Required | Yes        | No        | Yes     | Pending approval requests    |
| `bookingsRequiringAction` | Required | Yes        | No        | No      | Bookings needing user action |

**Filters for booking queries:**

- status (equals, in)
- startDate (range)
- endDate (range)
- createdAt (range)
- totalAmount (range)

**`bookingsRequiringAction` logic:**

- For Advertisers: Bookings with status `Verified` (need proof review)
- For Space Owners: Bookings with status `PendingApproval`, `Paid`, `FileDownloaded`, or `Installed`

**Example - Query Implementation:**

```csharp
[Authorize]
[UsePaging]
[UseProjection]
public static IQueryable<Booking> GetBookingsRequiringAction(
    AppDbContext context,
    UserService userService
) {
    var userId = userService.PrincipalId();
    return context.Bookings.Where(b =>
        (b.Campaign.AdvertiserProfile.UserId.ToString() == userId &&
         b.Status == BookingStatus.Verified) ||
        (b.Space.SpaceOwnerProfile.UserId.ToString() == userId &&
         (b.Status == BookingStatus.PendingApproval ||
          b.Status == BookingStatus.Paid ||
          b.Status == BookingStatus.FileDownloaded ||
          b.Status == BookingStatus.Installed)));
}
```

**Example - GraphQL Usage:**

```graphql
query {
  myBookingsAsAdvertiser(
    where: { status: { in: [PAID, VERIFIED] } }
    order: { startDate: ASC }
  ) {
    nodes {
      id
      status
      totalAmount
      space {
        title
      }
    }
  }
}
```

### Payments Feature

| Query                              | Auth     | Pagination | Filtering | Sorting | Description                     |
|------------------------------------|----------|------------|-----------|---------|---------------------------------|
| `paymentById(id)`                  | Required | No         | No        | No      | Get payment (own bookings only) |
| `paymentsByBooking(bookingId)`     | Required | No         | No        | No      | All payments for a booking      |
| `myPayouts`                        | Required | Yes        | Yes       | Yes     | Space owner's payout history    |
| `earningsSummary`                  | Required | No         | No        | No      | Aggregated earnings data        |
| `transactionsByBooking(bookingId)` | Admin    | No         | No        | No      | Transaction ledger for booking  |

**`earningsSummary` returns:**

- totalEarnings: Sum of completed payouts
- pendingPayouts: Sum of pending/processing payouts
- availableBalance: Available for withdrawal
- thisMonthEarnings: Current month completed
- lastMonthEarnings: Previous month completed

**Filters for `myPayouts`:**

- status (equals, in)
- stage (equals)
- processedAt (range)
- amount (range)

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
    nodes {
      id
      amount
      stage
      status
      booking {
        space {
          title
        }
      }
    }
  }
}
```

### Reviews Feature

| Query                                      | Auth     | Pagination | Filtering | Sorting | Description                     |
|--------------------------------------------|----------|------------|-----------|---------|---------------------------------|
| `reviewsBySpace(spaceId)`                  | None     | Yes        | No        | Yes     | Public reviews for a space      |
| `reviewByBooking(bookingId, reviewerType)` | Required | No         | No        | No      | Specific review for booking     |
| `myReviews`                                | Required | Yes        | No        | Yes     | Reviews written by current user |

**Example - GraphQL Usage:**

```graphql
query {
  reviewsBySpace(spaceId: "xxx", first: 5, order: { createdAt: DESC }) {
    nodes {
      rating
      comment
      createdAt
    }
  }
}
```

### Notifications Feature

| Query                       | Auth     | Pagination | Filtering | Sorting | Description                   |
|-----------------------------|----------|------------|-----------|---------|-------------------------------|
| `myNotifications`           | Required | Yes        | Yes       | Yes     | User's notifications          |
| `unreadNotificationCount`   | Required | No         | No        | No      | Count of unread notifications |
| `myNotificationPreferences` | Required | No         | No        | No      | Notification settings         |

**Filters for `myNotifications`:**

- type (equals, in)
- isRead (equals)
- createdAt (range)
- entityType (equals)

**Example - GraphQL Usage:**

```graphql
query {
  myNotifications(where: { isRead: { eq: false } }, first: 10) {
    nodes {
      id
      type
      title
      body
      createdAt
    }
  }
  unreadNotificationCount
}
```

### Messaging Feature

| Query                                    | Auth     | Pagination | Filtering | Sorting | Description                         |
|------------------------------------------|----------|------------|-----------|---------|-------------------------------------|
| `conversationById(id)`                   | Required | No         | No        | No      | Get conversation (participant only) |
| `myConversations`                        | Required | Yes        | No        | Yes     | User's conversations                |
| `conversationByBooking(bookingId)`       | Required | No         | No        | No      | Conversation for specific booking   |
| `messagesByConversation(conversationId)` | Required | Yes        | No        | No      | Messages in conversation            |
| `unreadMessageCount`                     | Required | No         | No        | No      | Total unread messages               |

**Example - GraphQL Usage:**

```graphql
query {
  myConversations(first: 20) {
    nodes {
      id
      updatedAt
      participants {
        user {
          name
        }
      }
      messages(first: 1) {
        nodes {
          content
        }
      }
    }
  }
}
```

---

## Mutations

### Users Feature

| Mutation                          | Auth     | Description                           | Side Effects               |
|-----------------------------------|----------|---------------------------------------|----------------------------|
| `updateCurrentUser(input)`        | Required | Update name, phone, avatar            | None                       |
| `switchProfileType(type)`         | Required | Switch between Advertiser/SpaceOwner  | None                       |
| `updateAdvertiserProfile(input)`  | Required | Update company info                   | None                       |
| `updateSpaceOwnerProfile(input)`  | Required | Update business info, payout schedule | None                       |
| `completeOnboarding(profileType)` | Required | Mark onboarding complete              | Creates profile if missing |
| `deleteUser(id)`                  | Admin    | Soft delete user                      | Cascades to profiles       |

**Example - Mutation with Service:**

```csharp
[MutationType]
public static partial class UserMutations {
    [Authorize]
    public static async Task<User> UpdateCurrentUser(
        UpdateUserInput input,
        IUserService userService,
        CancellationToken ct
    ) => await userService.UpdateAsync(input, ct);
}
```

**Example - GraphQL Usage:**

```graphql
mutation {
  updateCurrentUser(input: { name: "New Name", phone: "+1234567890" }) {
    id
    name
    phone
  }
}

mutation {
  switchProfileType(type: SPACE_OWNER) {
    id
    activeProfileType
  }
}
```

### Spaces Feature

| Mutation                   | Auth     | Description             | Side Effects                                              |
|----------------------------|----------|-------------------------|-----------------------------------------------------------|
| `createSpace(input)`       | Required | Create new listing      | Status: PendingApproval (if moderation enabled) or Active |
| `updateSpace(id, input)`   | Required | Update own listing      | None                                                      |
| `deleteSpace(id)`          | Required | Hard delete listing     | Fails if active bookings                                  |
| `deactivateSpace(id)`      | Required | Soft delete (Inactive)  | None                                                      |
| `reactivateSpace(id)`      | Required | Restore from Inactive   | Status: Active                                            |
| `approveSpace(id)`         | Admin    | Approve pending listing | Status: Active, Notification to owner                     |
| `rejectSpace(id, reason)`  | Admin    | Reject listing          | Status: Rejected, Notification to owner                   |
| `suspendSpace(id, reason)` | Admin    | Suspend active listing  | Status: Suspended, Notification to owner                  |

**Example - GraphQL Usage:**

```graphql
mutation {
  createSpace(
    input: {
      title: "Downtown Window Display"
      type: WINDOW_DISPLAY
      address: "123 Main St"
      city: "Los Angeles"
      state: "CA"
      latitude: 34.0522
      longitude: -118.2437
      pricePerDay: 25.00
      minDuration: 7
      images: ["https://..."]
    }
  ) {
    id
    title
    status
  }
}
```

### Campaigns Feature

| Mutation                    | Auth     | Description           | Side Effects                                     |
|-----------------------------|----------|-----------------------|--------------------------------------------------|
| `createCampaign(input)`     | Required | Create draft campaign | Status: Draft                                    |
| `updateCampaign(id, input)` | Required | Update own campaign   | Only if Draft/Submitted                          |
| `deleteCampaign(id)`        | Required | Delete campaign       | Only if no active bookings                       |
| `submitCampaign(id)`        | Required | Submit for booking    | Status: Submitted                                |
| `cancelCampaign(id)`        | Required | Cancel campaign       | Status: Cancelled, cascade booking cancellations |

**Example - GraphQL Usage:**

```graphql
mutation {
  createCampaign(
    input: {
      name: "Summer Sale 2026"
      imageUrl: "https://cdn.example.com/creative.png"
      targetAudience: "Local shoppers"
      goals: "Drive foot traffic"
    }
  ) {
    id
    name
    status
  }
}
```

### Bookings Feature

| Mutation                           | Auth     | Description                | Side Effects                                            |
|------------------------------------|----------|----------------------------|---------------------------------------------------------|
| `createBooking(campaignId, input)` | Required | Request booking            | Status: PendingApproval, Notification to owner          |
| `approveBooking(id, ownerNotes?)`  | Required | Accept request             | Status: Approved, Notification to advertiser            |
| `rejectBooking(id, reason)`        | Required | Decline request            | Status: Rejected, Notification to advertiser            |
| `cancelBooking(id, reason)`        | Required | Cancel booking             | Status: Cancelled, Refund if paid, Notifications        |
| `markFileDownloaded(id)`           | Required | Owner downloaded creative  | Status: FileDownloaded, Stage 1 Payout triggered        |
| `markInstalled(id)`                | Required | Owner installed ad         | Status: Installed                                       |
| `submitProof(id, input)`           | Required | Upload verification photos | Status: Verified, 48hr auto-approve timer, Notification |
| `approveProof(id)`                 | Required | Advertiser approves        | Status: Completed, Stage 2 Payout triggered             |
| `disputeProof(id, input)`          | Required | Advertiser disputes        | Status: Disputed, Notification to owner + admin         |
| `resolveDispute(id, input)`        | Admin    | Resolve dispute            | Status: Completed/Cancelled, Refund if applicable       |

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

| Mutation                                   | Auth     | Description                     | Side Effects                              |
|--------------------------------------------|----------|---------------------------------|-------------------------------------------|
| `createPaymentIntent(bookingId)`           | Required | Create Stripe PaymentIntent     | Returns clientSecret for frontend         |
| `confirmPayment(paymentIntentId)`          | Required | Confirm after Stripe success    | Status: Paid, Transaction record          |
| `requestRefund(paymentId, amount, reason)` | Admin    | Process refund                  | Refund record, Stripe refund, Transaction |
| `processManualPayout(payoutId)`            | Admin    | Force payout processing         | Stripe transfer                           |
| `retryPayout(payoutId)`                    | Admin    | Retry failed payout             | Reset attempt count, retry transfer       |
| `connectStripeAccount`                     | Required | Start Stripe Connect onboarding | Returns onboarding URL                    |
| `refreshStripeAccountStatus`               | Required | Check Stripe account health     | Updates profile status                    |

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

| Mutation                         | Auth     | Description   | Side Effects                                             |
|----------------------------------|----------|---------------|----------------------------------------------------------|
| `createReview(bookingId, input)` | Required | Create review | Only for Completed bookings, Updates space averageRating |
| `updateReview(id, input)`        | Required | Edit review   | Within 24hr edit window                                  |
| `deleteReview(id)`               | Admin    | Remove review | Recalculates space averageRating                         |

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

| Mutation                                    | Auth     | Description             | Side Effects           |
|---------------------------------------------|----------|-------------------------|------------------------|
| `markNotificationRead(id)`                  | Required | Mark single as read     | Updates isRead, readAt |
| `markAllNotificationsRead`                  | Required | Mark all as read        | Returns count updated  |
| `deleteNotification(id)`                    | Required | Delete notification     | Hard delete            |
| `updateNotificationPreference(type, input)` | Required | Update channel settings | Creates if not exists  |
| `registerDeviceToken(token, platform)`      | Required | Register for push       | Stores device token    |
| `unregisterDeviceToken(token)`              | Required | Remove device           | Deletes token          |

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

| Mutation                             | Auth     | Description                | Side Effects                                                       |
|--------------------------------------|----------|----------------------------|--------------------------------------------------------------------|
| `createConversation(bookingId)`      | Required | Get or create conversation | Creates participants if new                                        |
| `sendMessage(conversationId, input)` | Required | Send message               | Updates conversation.updatedAt, Notification to other participants |
| `markConversationRead(id)`           | Required | Update last read timestamp | Updates participant.lastReadAt                                     |

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

| Subscription      | Parameters     | Payload      | Description                          |
|-------------------|----------------|--------------|--------------------------------------|
| `onNotification`  | userId         | Notification | New notification for user            |
| `onMessage`       | conversationId | Message      | New message in conversation          |
| `onBookingUpdate` | bookingId      | Booking      | Booking status changed               |
| `onProofUpdate`   | bookingId      | BookingProof | Proof submitted/reviewed             |
| `onPaymentUpdate` | paymentId      | Payment      | Payment status changed               |
| `onPayoutUpdate`  | payoutId       | Payout       | Payout status changed                |
| `onSpaceUpdate`   | spaceId        | Space        | Space status changed (admin actions) |

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

### Error Codes

| Code                      | HTTP Equivalent | Description                                |
|---------------------------|-----------------|--------------------------------------------|
| NOT_FOUND                 | 404             | Entity does not exist                      |
| UNAUTHORIZED              | 401             | Not authenticated                          |
| FORBIDDEN                 | 403             | Not authorized for action                  |
| VALIDATION_FAILED         | 400             | Input validation failed                    |
| INVALID_STATUS_TRANSITION | 400             | Booking status transition not allowed      |
| PAYMENT_FAILED            | 400             | Stripe payment error                       |
| PAYOUT_FAILED             | 400             | Stripe transfer error                      |
| CONFLICT                  | 409             | Resource conflict (e.g., duplicate review) |

### Error Response Structure

```json
{
  "errors": [
    {
      "message": "Booking with ID xxx not found",
      "extensions": {
        "code": "NOT_FOUND",
        "entity": "Booking",
        "id": "xxx"
      }
    }
  ]
}
```

**Example - Error Helper Class:**

```csharp
public static class GraphQLErrors {
    public static GraphQLException NotFound(string entity, Guid id) =>
        new($"{entity} with ID {id} not found",
            new Dictionary<string, object?> {
                ["code"] = "NOT_FOUND",
                ["entity"] = entity,
                ["id"] = id
            });

    public static GraphQLException Unauthorized(string message = "Not authorized") =>
        new(message, new Dictionary<string, object?> { ["code"] = "UNAUTHORIZED" });

    public static GraphQLException InvalidStatusTransition(BookingStatus from, BookingStatus to) =>
        new($"Cannot transition from {from} to {to}",
            new Dictionary<string, object?> {
                ["code"] = "INVALID_STATUS_TRANSITION",
                ["from"] = from.ToString(),
                ["to"] = to.ToString()
            });
}
```

**Example - Usage in Service:**

```csharp
public async Task<Booking> ApproveAsync(Guid id, string? ownerNotes, CancellationToken ct) {
    var booking = await context.Bookings.FindAsync([id], ct)
        ?? throw GraphQLErrors.NotFound("Booking", id);

    if (booking.Status != BookingStatus.PendingApproval)
        throw GraphQLErrors.InvalidStatusTransition(booking.Status, BookingStatus.Approved);

    booking.Status = BookingStatus.Approved;
    booking.OwnerNotes = ownerNotes;
    await context.SaveChangesAsync(ct);
    return booking;
}
```

---

## Object Type Extensions

### Purpose

Extensions add authorization to navigation properties and resolve computed fields through Services, optimizing for
minimal database queries.

### Query Optimization Patterns

| Relationship | Pattern | DB Queries | Example |
|--------------|---------|------------|---------|
| 1:1 | `[BindMember]` + navigation property | 1 (projection) | User → Profile |
| 1:N paginated | Explicit resolver + `IQueryable` | 2 (required) | Profile → Spaces |
| 1:N non-paginated | `[BindMember]` + navigation property | 1 (projection) | - |

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
public static class SpaceOwnerExtensions {
    [Authorize]
    [UsePaging]
    [UseProjection]
    [UseFiltering]
    [UseSorting]
    public static IQueryable<Space> Spaces(
        [Parent] SpaceOwnerProfile owner, ISpaceService service
    ) => service.GetByOwnerId(owner.Id);
}
```

**Key Rules**:
- 1:1 relationships: Use `[BindMember]` + return navigation property (enables projection in parent query)
- 1:N with pagination: Explicit resolver returning `IQueryable` from Service (separate query required)
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

**Last Updated**: 2026-01-16