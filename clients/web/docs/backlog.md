# Backlog

## Storage Key Consistency

**Date:** 2026-01-27 | **Status:** In Progress

Centralized storage keys in `lib/storage-keys.ts` for consistent localStorage and cookie naming.

**Pattern:**

```ts
import storageKey from "@/lib/storage-keys";

// Cookie
cookieStore.set(storageKey.preferences.listings.view, value);

// localStorage
useLocalStorage(storageKey.preferences.theme, defaultValue);
```

**Tasks:**

- [x] Create `lib/storage-keys.ts` with centralized key definitions
- [x] Migrate `listings.view` cookie to use `storageKey`
- [x] Migrate sidebar open state to use `storageKey` (read + write)
- [x] Migrate theme preference to use `storageKey`
- [ ] Migrate authentication token to use `storageKey`
- [ ] Audit codebase for any hardcoded storage keys

---

## Proxy Infrastructure

**Date:** 2026-01-27 | **Status:** Planned

Implement `proxy.ts` (Next.js 16) for cross-cutting concerns at the network boundary.

**Docs:** [proxy.js API](https://nextjs.org/docs/app/api-reference/file-conventions/proxy)

**Tasks:**

- [ ] Create `proxy.ts` with base matcher config
- [ ] Implement request logging with `event.waitUntil()`
- [ ] Add request ID injection (`x-request-id` header)
- [ ] Add security headers (X-Frame-Options, X-Content-Type-Options)
- [ ] Implement lightweight auth guard (cookie check, redirect to /login)
- [ ] Add CORS handling for `/api/*` routes
- [ ] Consider A/B testing infrastructure
- [ ] Consider geo-based routing

---

## Sidebar Active State

**Date:** 2026-01-27 | **Status:** In Progress

Highlight active navigation item and disable redundant navigation (e.g., clicking /bookings while on /bookings).

**Location:** `app/(dashboard)/navigation-section.tsx`, `app/(dashboard)/user-section.tsx`

**Tasks:**

- [x] `navMain` - active state styling + disable link
- [ ] `navSecondary` - active state styling + disable link
- [ ] `documents` - active state styling + disable link
- [ ] `user-section` popup - active state styling + disable link
- [ ] Define semantic CSS variable in `globals.css` for active state color

---

## Shared Component Extraction

**Date:** 2026-01-27 | **Status:** In Progress

Extract reusable components from `@spaceOwner` to `components/composed/` for consistent UIs between SpaceOwner and
Advertiser dashboards.

### Utility Functions (→ `lib/utils.ts`)

- [x] `formatCurrency(amount, options?)` - Currency display ($1,234)
- [x] `formatDateRange(start, end)` - Date ranges (Jan 15 - Jan 20)
- [x] `formatTime(dateString)` - Relative time (2d ago, Just now) - already existed
- [x] `getInitials(name)` - Avatar fallback (JD from John Doe)
- [x] `formatNumber(num)` - Compact numbers (1.2K, 3.5M)
- [x] `formatDate(date, options?)` - Full date display (January 15, 2026)
- [x] `calculateTrend(current, previous)` - Percentage change calculation

### Shared Constants (→ `lib/constants.ts`)

- [x] `BOOKING_STATUS` - labels, variants, indicators
- [x] `SPACE_STATUS` - labels, variants, indicators
- [x] `SPACE_TYPE` - labels
- [x] `PAYOUT_STATUS` - labels, variants, indicators
- [x] `PAYOUT_STAGE` - labels, descriptions
- [x] `TIME_RANGES` - chart time range options (90d, 30d, 7d)
- [x] `CAMPAIGN_STATUS` - labels, variants, indicators
- [x] `PAYMENT_STATUS` - labels, variants, indicators

### Refactored @spaceOwner Files

The following files now use shared utilities and constants:

**Utilities:**
- `overview/pending-requests.tsx` - formatCurrency, formatDateRange, formatTime, getInitials
- `overview/stats-cards.tsx` - formatCurrency, calculateTrend
- `overview/top-spaces.tsx` - formatCurrency (compact), formatNumber
- `overview/active-bookings.tsx` - formatDateRange
- `analytics/summary-cards.tsx` - formatCurrency, calculateTrend
- `analytics/comparison-card.tsx` - formatCurrency, calculateTrend
- `analytics/top-performers.tsx` - formatCurrency
- `earnings/balance-cards.tsx` - formatCurrency (decimals), calculateTrend
- `calendar/calendar-grid.tsx` - formatDateRange

**Constants:**
- `bookings/(grid)/booking-card.tsx` - BOOKING_STATUS
- `bookings/(table)/bookings-table.tsx` - BOOKING_STATUS
- `listings/(grid)/space-card.tsx` - SPACE_STATUS, SPACE_TYPE
- `listings/(table)/columns.tsx` - SPACE_STATUS, SPACE_TYPE
- `listings/[id]/header.tsx` - SPACE_STATUS
- `earnings/payouts-table.tsx` - PAYOUT_STATUS, PAYOUT_STAGE
- `analytics/status-chart.tsx` - BOOKING_STATUS
- `calendar/constants.ts` - Re-exports BOOKING_STATUS.labels

### High Priority Components

- [x] **ProgressSteps** - Numbered workflow steps (`components/composed/progress-steps.tsx`)
- [x] **ActionCard** - Avatar + info + actions (`components/composed/action-card.tsx`)
- [x] **PerformerCard** - Icon + title + value badge (`components/composed/performer-card.tsx`)
- [x] **TimeRangeSelector** - Responsive 90d/30d/7d toggle (`components/composed/time-range-selector.tsx`)
- [x] **ComparisonTable** - Previous/current/change rows (`components/composed/comparison-table.tsx`)
- [x] **SettingsSection** - Accordion with icon + description (`components/composed/settings-section.tsx`)
- [x] **SectionCard** - Card header with count badge + "View All" link (`components/composed/section-card.tsx`)

### Medium Priority Components

- [x] **RankedCard** - Card with rank badge overlay (`components/composed/ranked-card.tsx`)
- [x] **ReviewCard** - Star rating + comment + author (`components/composed/review-card.tsx`)
- [x] **StarRating** - Star rating display primitive (`components/primitives/star-rating.tsx`)
- [x] **ProfileCard** - Avatar + name + stats grid (`components/composed/profile-card.tsx`)

### Refactored @spaceOwner Files (Components)

- `overview/active-bookings.tsx` → ProgressSteps, SectionCard
- `overview/pending-requests.tsx` → ActionCard, SectionCard
- `overview/activity-chart.tsx` → TimeRangeSelector
- `overview/top-spaces.tsx` → RankedCard, SectionCard
- `analytics/top-performers.tsx` → PerformerCard, SectionCard
- `analytics/comparison-card.tsx` → ComparisonTable
- `settings/settings-content.tsx` → SettingsSection
- `profile/reviews-section.tsx` → ReviewCard
- `profile/profile-card.tsx` → ProfileCard

---

## Advertiser Profile GraphQL Query

**Date:** 2026-01-27 | **Status:** Blocked (Backend)

The `@advertiser/profile` page currently uses mock data. When backend support is available, implement proper GraphQL fragments.

**Required Schema Changes:**

`AdvertiserProfile` needs a `bookings` field (similar to `SpaceOwnerProfile.spaces`) to calculate:
- Total campaigns count
- Total spend across all bookings

**Proposed Query:**

```graphql
query AdvertiserProfile {
  me {
    name
    avatar
    advertiserProfile {
      createdAt
      companyName
      industry
      website
      onboardingComplete
      campaigns(first: 100) {
        nodes {
          id
          bookings(first: 100) {
            nodes {
              id
              totalPrice
            }
          }
        }
      }
    }
  }
}
```

**Files to Update:**
- `app/(dashboard)/@advertiser/profile/page.tsx` - Add GraphQL query
- `app/(dashboard)/@advertiser/profile/profile-card.tsx` - Add fragment
- `app/(dashboard)/@advertiser/profile/about-section.tsx` - Add fragment

**Tasks:**
- [ ] Confirm schema supports nested campaigns → bookings query
- [ ] Implement GraphQL fragments matching @spaceOwner pattern
- [ ] Remove mock.json dependency

---

## Advertiser Spending GraphQL Query

**Date:** 2026-01-27 | **Status:** Blocked (Backend)

The `@advertiser/spending` page currently uses mock data. Backend queries required.

**Required Operations:**

```graphql
query SpendingSummary {
  spendingSummary {
    totalSpent
    pendingPayments
    thisMonthSpending
    lastMonthSpending
  }
}

query MyPaymentsAsAdvertiser($first: Int, $after: String) {
  myPaymentsAsAdvertiser(first: $first, after: $after) {
    nodes {
      id
      amount
      status
      createdAt
      booking {
        id
        space {
          title
          images
        }
        campaign {
          name
        }
      }
    }
    pageInfo {
      hasNextPage
      endCursor
    }
    totalCount
  }
}
```

**Files to Update:**
- `app/(dashboard)/@advertiser/spending/page.tsx` - Replace mock data with GraphQL
- `app/(dashboard)/@advertiser/spending/spending-cards.tsx` - Add fragment
- `app/(dashboard)/@advertiser/spending/payments-table.tsx` - Add fragment

**Tasks:**
- [ ] Add `spendingSummary` query to backend
- [ ] Add `myPaymentsAsAdvertiser` query to backend
- [ ] Implement GraphQL fragments
- [ ] Remove mock.json dependency

---

## Discover Favorites Feature

**Date:** 2026-01-27 | **Status:** Blocked (Backend)

Allow advertisers to favorite spaces for later reference.

**Required Operations:**

```graphql
mutation ToggleFavoriteSpace($spaceId: UUID!) {
  toggleFavoriteSpace(spaceId: $spaceId) {
    success
    isFavorite
  }
}

query MyFavoriteSpaces($first: Int) {
  myFavoriteSpaces(first: $first) {
    nodes {
      id
      ...SpaceCard_SpaceFragment
    }
  }
}
```

**Schema Changes:**
- Add `Space.isFavorite: Boolean` field (resolver checks user favorites)
- Add `toggleFavoriteSpace` mutation
- Add `myFavoriteSpaces` query

**Frontend Tasks:**
- [ ] Add heart button to space cards in discover grid
- [ ] Implement localStorage-based favorites until backend ready
- [ ] Create favorites section in discover or separate route
- [ ] Add optimistic UI updates for favorite toggle

---

## Discover Backend Filtering

**Date:** 2026-01-27 | **Status:** Blocked (Backend)

The discover route currently filters client-side. Backend support needed for:

**Required Filter Support:**

```graphql
query DiscoverSpaces(
  $where: SpaceFilterInput
  $order: [SpaceOrderInput!]
  $first: Int
  $after: String
) {
  availableSpaces(where: $where, order: $order, first: $first, after: $after) {
    nodes {
      id
      ...SpaceCard_SpaceFragment
    }
    pageInfo {
      hasNextPage
      endCursor
    }
    totalCount
  }
}
```

**Filter Examples:**
- Price range: `where: { pricePerDay: { gte: 50, lte: 200 } }`
- Space type: `where: { type: { in: [STOREFRONT, WINDOW_DISPLAY] } }`
- Location: `where: { city: { eq: "Austin" } }`

**Sort Examples:**
- `order: [{ pricePerDay: ASC }]`
- `order: [{ createdAt: DESC }]`

**Tasks:**
- [ ] Add `SpaceFilterInput` to schema
- [ ] Add `SpaceOrderInput` to schema
- [ ] Implement `availableSpaces` query with pagination
- [ ] Update discover route to use server-side filtering
- [ ] Add `totalCount` for pagination UI

---

## Discover View Preference Cookie Migration

**Date:** 2026-01-27 | **Status:** Planned

Migrate discover view preference from localStorage to cookie for SSR consistency.

**Current State:**
- Uses localStorage via `useSyncExternalStore`
- Key: `storageKey.preferences.discover.view`

**Target State:**
- Use cookie with server action
- Read initial value from cookie in server component
- Pass as prop to client content component

**Files to Update:**
- `app/(dashboard)/@advertiser/discover/layout.tsx` - Read cookie, pass to Content
- `app/(dashboard)/@advertiser/discover/content.tsx` - Accept initial view as prop

**Tasks:**
- [ ] Update layout to read cookie and pass initial view
- [ ] Update Content component to accept initialView prop
- [ ] Add server action for view change
- [ ] Remove localStorage usage