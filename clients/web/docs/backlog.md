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

## Backend GraphQL Integration

**Date:** 2026-01-27 | **Status:** Blocked (Backend)

Multiple @advertiser pages use mock data. Backend queries/mutations required before frontend implementation.

### Advertiser Profile

`AdvertiserProfile` needs a `bookings` field (similar to `SpaceOwnerProfile.spaces`) to calculate total campaigns and total spend.

**Files:**
- `app/(dashboard)/@advertiser/profile/page.tsx`
- `app/(dashboard)/@advertiser/profile/profile-card.tsx`
- `app/(dashboard)/@advertiser/profile/about-section.tsx`

### Advertiser Spending

Requires `spendingSummary` query and `myPaymentsAsAdvertiser` paginated query.

**Files:**
- `app/(dashboard)/@advertiser/spending/page.tsx`
- `app/(dashboard)/@advertiser/spending/spending-cards.tsx`
- `app/(dashboard)/@advertiser/spending/payments-table.tsx`

### Discover Favorites

Allow advertisers to favorite spaces. Requires `toggleFavoriteSpace` mutation, `myFavoriteSpaces` query, and `Space.isFavorite` field.

**Files:**
- `app/(dashboard)/@advertiser/discover/space-card.tsx` - Add heart button
- New route or section for favorites list

### Discover Backend Filtering

Replace client-side filtering with server-side. Requires `SpaceFilterInput`, `SpaceOrderInput`, and `availableSpaces` query with pagination.

**Files:**
- `app/(dashboard)/@advertiser/discover/page.tsx`
- `app/(dashboard)/@advertiser/discover/filter-sheet.tsx`

### Tasks

**Backend:**
- [ ] Add `AdvertiserProfile.campaigns.bookings` nested query support
- [ ] Add `spendingSummary` query
- [ ] Add `myPaymentsAsAdvertiser` query
- [ ] Add `Space.isFavorite` field
- [ ] Add `toggleFavoriteSpace` mutation
- [ ] Add `myFavoriteSpaces` query
- [ ] Add `SpaceFilterInput` and `SpaceOrderInput` types
- [ ] Add `availableSpaces` query with filtering/sorting/pagination

**Frontend (after backend ready):**
- [x] Implement profile GraphQL fragments, remove mock.json (campaigns, reviews, about)
- [x] Enable notification preferences (individual toggle saves)
- [x] Enable Stripe Connect flow (connect, refresh status, dashboard link)
- [x] Enable delete account with confirmation dialog
- [ ] Implement spending GraphQL fragments, remove mock.json
- [ ] Add favorites UI with optimistic updates
- [ ] Update discover to use server-side filtering

---

## Infinite Scroll Pagination

**Date:** 2026-01-29 | **Status:** Planned

Replace `ToolbarPagination` (cursor-based prev/next) with an infinite scroll component. Drop-in replacement at the toolbar level — swap `<ToolbarPagination>` usage in `toolbar/index.tsx`.

**Approach:**
- Use `IntersectionObserver` with a sentinel element to trigger `fetchMore` with `after` cursor
- Keep cursor-based GraphQL pagination (auto-advance instead of manual clicks)
- Remove `before`/`last` search params (no backward navigation needed)

**Considerations:**
- Loading indicator at bottom of list
- Scroll-to-top button
- Empty state and end-of-list state
- Grid and table views: place sentinel after the last item
- Map view: may keep manual pagination or load all results

**Affected files:**
- `components/composed/toolbar/index.tsx` — replace `<ToolbarPagination>` with infinite scroll
- `components/composed/toolbar/pagination.tsx` — replace or remove

**Tasks:**

- [ ] Create infinite scroll component with `IntersectionObserver` sentinel
- [ ] Integrate with existing `fetchMore` / cursor-based pagination
- [ ] Remove `before`/`last` search params from toolbar
- [ ] Add loading indicator, scroll-to-top button, end-of-list state
- [ ] Update grid and table views to place sentinel correctly
- [ ] Decide map view strategy (keep pagination vs load all)
- [ ] Remove or repurpose `pagination.tsx`

---

## Shared Dashboard Routes

**Date:** 2026-01-31 | **Status:** In Progress

**Docs:** [shared-routes.md](./shared-routes.md)

Shared routes (spaces, messages, notifications, settings) render as direct `children` of `(dashboard)/` instead of being duplicated across parallel slots. `RoleBasedView` detects shared routes via `useIsSharedRoute` and renders `children` instead of the role slot.

**Infrastructure (Phase 0):**

- [x] Create `hooks/use-is-shared-route.ts` hook
- [x] Convert `role-based-view.tsx` to client component with `children` prop and `useIsSharedRoute`
- [x] Create `@{admin,advertiser,marketing,spaceOwner}/default.tsx` — return `null` for shared routes, `notFound()` otherwise

**Shared Routes:**

- [x] `spaces/[id]` — space detail page (stub)
- [ ] `messages` — extract from `@advertiser/messages` and `@spaceOwner/messages` (Phase 1)
- [ ] `notifications` — extract from `@advertiser/notifications` and `@spaceOwner/notifications` (Phase 2)
- [ ] `settings` — extract with role-aware branching (Phase 3)

---
## Pre-Launch Reminders

- [ ] Add footer attribution for third-party assets (see [docs/acknowledgements.md](./acknowledgements.md))
