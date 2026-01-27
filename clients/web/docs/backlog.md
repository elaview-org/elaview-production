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