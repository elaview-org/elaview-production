# Cost Analysis Optimization

## Current Configuration

`Bootstrap/Services.cs:110-123`

| Setting | Current Value |
|---|---|
| MaxFieldCost | 20,000 |
| MaxTypeCost | 20,000 |
| EnforceCostLimits | true |
| ApplyCostDefaults | true |
| DefaultResolverCost | 10.0 |
| Filtering.DefaultFilterArgumentCost | 10.0 |
| Filtering.DefaultFilterOperationCost | 10.0 |
| Filtering.DefaultExpensiveFilterOperationCost | 20.0 |
| Filtering.VariableMultiplier | 5 |
| Sorting.DefaultSortArgumentCost | 10.0 |
| Sorting.DefaultSortOperationCost | 10.0 |
| Sorting.VariableMultiplier | 5 |

No `[Cost]` or `[ListSize]` attributes on individual resolvers — everything uses centralized defaults. All connections have `assumedSize: 50`, `slicingArgumentDefaultValue: 10`, `requireOneSlicingArgument: false`.

---

## Cost Calculation Examples

### 1. Simple listing page (typical)
```graphql
query { mySpaces(first: 10) { nodes { id title status pricePerDay images } pageInfo { hasNextPage } } }
```
- **Field cost**: ~10 (mySpaces resolver)
- **Type cost**: ~22 (1 connection + 10 nodes + 10 edges + 1 pageInfo)

### 2. Listing page with filters + sorting
```graphql
query { mySpaces(first: 10, where: { status: { eq: ACTIVE } }, order: { createdAt: DESC }) { nodes { id title } } }
```
- **Field cost**: ~40 (10 resolver + 10 filter arg + 10 filter op + 10 sort)
- **Type cost**: ~22

### 3. Bookings page with nested navigation (2 levels)
```graphql
query { myBookingsAsOwner(first: 10) { nodes { id status campaign { id name } space { id title } } } }
```
- **Field cost**: ~210 (10 + 10*10 campaign + 10*10 space)
- **Type cost**: ~52 (connection overhead + 10 bookings + 10 campaigns + 10 spaces)

### 4. Heavy legitimate query (dashboard with aggregates)
```graphql
query { mySpaces(first: 20, where: {...}, order: {...}) { nodes { id title bookings(first: 5) { nodes { id status } } reviews(first: 5) { nodes { rating } } } } earningsSummary { totalEarnings pendingPayouts } }
```
- **Field cost**: ~650 (resolvers + nested pagination multiplied by parent size)
- **Type cost**: ~300

### 5. Abusive deep nesting (attacker)
```graphql
query { mySpaces(first: 50) { nodes { bookings(first: 50) { nodes { campaign { bookings(first: 50) { nodes { space { id } } } } } } } } }
```
- **Field cost**: ~25,000+ (exceeds current 20,000 limit at 3rd nesting level)
- **Type cost**: ~130,000+ (far exceeds)

### 6. Moderate abuse (2-level nesting, max page sizes)
```graphql
query { mySpaces(first: 50) { nodes { bookings(first: 50) { nodes { id status totalAmount } } } } }
```
- **Field cost**: ~510 (10 + 50*10)
- **Type cost**: ~5,100 (1 + 50 + 50*50*2)
- **Current limits allow this** despite returning up to 2,500 rows of data.

---

## Problems

### 1. MaxFieldCost and MaxTypeCost are too permissive (20,000)
Legitimate frontend queries cost 10-650 field cost and 20-300 type cost. At 20,000, attackers can nest 2 levels deep with `first: 50` at each level (2,500 potential DB rows) without hitting limits. Only 3+ levels of deep nesting gets blocked.

### 2. No resolver-level cost differentiation
Every resolver costs 10, but complexity varies significantly:
- `me` — single row by auth token, nearly free
- `unreadConversationsCount` — aggregate count, cheap
- `myBookingsAsOwner` with filters — paginated query with potential joins, expensive
- `earningsSummary` — multiple aggregate calculations, very expensive

### 3. `requireOneSlicingArgument: false` on all connections
Clients can query any connection without `first` or `last`, triggering `assumedSize: 50` for cost calculation and potentially returning all records from the DB. This is the biggest risk vector.

### 4. Uniform `assumedSize: 50` on nested connections
Nested connections like `Space.bookings`, `Booking.reviews`, `Campaign.bookings` use the same `assumedSize: 50` as root queries. Nested connections should have smaller assumed sizes since they represent secondary data loads.

### 5. Non-list navigation fields cost the same as list resolvers
`Booking.campaign` (single entity lookup via DataLoader) costs 10, same as `myBookingsAsOwner` (paginated list query). Single-entity navigation should be cheaper.

---

## Recommendations

### A. Tighten global limits

| Setting | Current | Recommended | Rationale |
|---|---|---|---|
| MaxFieldCost | 20,000 | **5,000** | Covers all legitimate queries (max ~650) with headroom for complex dashboards, blocks 3-level nesting at any page size |
| MaxTypeCost | 20,000 | **5,000** | Prevents queries returning more than ~5,000 type instances, blocks 2-level nesting with `first: 50` |

### B. Differentiate resolver costs via `[Cost]` attributes

| Resolver Category | Current | Recommended | Examples |
|---|---|---|---|
| Identity/count | 10 | **1** | `me`, `unreadConversationsCount`, `unreadNotificationsCount` |
| Single entity by ID | 10 | **5** | `bookingById`, `spaceById`, `campaignById`, `paymentById`, `payoutById`, `reviewByBooking` |
| Paginated root queries | 10 | **10** (keep) | `mySpaces`, `myBookingsAsOwner`, `myBookingsAsAdvertiser`, `myCampaigns`, `spaces` |
| Paginated with implicit filter | 10 | **10** (keep) | `incomingBookingRequests`, `bookingsRequiringAction` |
| Aggregate computation | 10 per field | **15** per field | `earningsSummary` sub-fields |
| Single navigation (DataLoader) | 10 | **5** | `Booking.campaign`, `Booking.space`, `Campaign.advertiser`, `Space.owner` |
| Nested paginated connection | 10 | **10** (keep) | `Space.bookings`, `Campaign.bookings`, `Space.reviews` |
| Non-paginated list | 10 | **10** (keep) | `Booking.reviews`, `Booking.payments`, `Booking.payouts` |
| All mutations | 10 | **10** (keep) | All mutations |

### C. Tighten `@listSize` on nested connections

| Connection | Current assumedSize | Recommended | Rationale |
|---|---|---|---|
| Root queries (`mySpaces`, `myCampaigns`, etc.) | 50 | **50** (keep) | Primary data load, page-level |
| `Space.bookings`, `Space.reviews` | 50 | **20** | Secondary data, unlikely to need 50 per parent |
| `Campaign.bookings` | 50 | **20** | Same reasoning |
| `AdvertiserProfile.campaigns` | 50 | **20** | Nested navigation |
| `Booking` nested connections | 50 | **10** | Rarely need many nested items |
| `Conversation.messages` | 50 | **30** | Chat messages, moderate size |

### D. Enforce slicing arguments on nested connections

Set `requireOneSlicingArgument: true` on nested connections (not root queries) to force clients to specify `first` or `last`:
- `Space.bookings`, `Space.reviews`
- `Campaign.bookings`
- `AdvertiserProfile.campaigns`
- `Conversation.messages`
- `Payment.refunds`

Root queries can keep `requireOneSlicingArgument: false` since the frontend may use default page sizes.

### E. Keep current filter/sort costs (no changes needed)

The current filter and sort cost configuration follows HotChocolate defaults and is well-calibrated:
- Basic operations (eq, neq, in): cost 10
- Expensive operations (contains, startsWith, endsWith): cost 20
- Variable multiplier 5 appropriately penalizes dynamic filter variables

---

## Implementation

All changes go in two locations:

1. **`Bootstrap/Services.cs`** — Update `ModifyCostOptions` for global limits
2. **Individual resolver files** in `Features/*/` — Add `[Cost]` and `[ListSize]` attributes on specific resolvers

### Services.cs changes
```csharp
.ModifyCostOptions(options => {
    options.MaxFieldCost = 5_000;     // was 20,000
    options.MaxTypeCost = 5_000;      // was 20,000
    options.EnforceCostLimits = true;
    options.ApplyCostDefaults = true;
    options.DefaultResolverCost = 10.0;
    // filter + sort costs unchanged
})
```

### Resolver attribute examples
```csharp
// Queries/UserQueries.cs
[Cost(1)]
public static User? GetMe(...) => ...;

// Queries/SpaceQueries.cs
[Cost(5)]
public static Space? GetSpaceById(...) => ...;

// Space type - nested connection
[ListSize(AssumedSize = 20, SlicingArguments = ["first", "last"],
          SizedFields = ["edges", "nodes"], RequireOneSlicingArgument = true)]
public static IEnumerable<Booking> GetBookings(...) => ...;
```

---

## Verification

1. Run `dotnet build` to verify compilation
2. Export the schema (`dotnet run -- schema export`) and verify updated `@cost` and `@listSize` directives
3. Send the `GraphQL-Cost: report` header with typical frontend queries and verify field/type costs are within expected ranges
4. Test that abusive queries (3-level nesting, missing pagination args on nested connections) are rejected
5. Run the frontend locally and verify no legitimate queries are blocked