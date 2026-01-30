# Known Issues

## Parallel Routes Render All Slots

**Date:** 2026-01-27
**Status:** Deferred (Next.js limitation)

All parallel route slots execute server-side code regardless of which one is displayed. With role-based parallel
routes (`@admin`, `@advertiser`, etc.), every slot renders on each request—causing unnecessary data fetching and
degraded performance.

**Workaround:** Each page must check user role early and `return null` if not applicable.

```tsx
export default async function Page() {
  const { role } = await getCurrentUserRole();
  if (role !== UserRole.Admin) return null;

  // Actual page content...
}
```

**References:**

- [GitHub #53292](https://github.com/vercel/next.js/issues/53292) - Confirmed by Vercel team, still open
- [Medium: Parallel Routes Tricky Parts](https://medium.com/@sibteali786/parallel-routes-in-nextjs-and-tricky-parts-61ee39c9a312)
- [Next.js Parallel Routes Docs](https://nextjs.org/docs/app/api-reference/file-conventions/parallel-routes)

---

## Sort/Filter Reset Commits Immediately

**Date:** 2026-01-29
**Status:** Deferred

"Reset to default" (sort) and "Clear filters" (filter) currently clear local state AND commit to the URL in a single
click. They should only reset the local pending state — the user must click "Apply" to confirm.

**Affected files:**

- `components/composed/toolbar/filters-panel.tsx`
- `components/composed/toolbar/sort-panel.tsx`

---

## Sort Panel Allows Duplicate Field Selection

**Date:** 2026-01-29
**Status:** Deferred

The secondary sort selector shows all fields including the one already selected as primary. Selecting the same field for
both primary and secondary is nonsensical. The secondary selector should exclude the currently selected primary field.

**Affected file:**

- `components/composed/toolbar/sort-panel.tsx`

---

## Expired Token and Manual Navigations to Unauthorized Routes Shows Generic Error Instead of Redirecting

**Date:** 2026-01-29
**Status:** Fixed

When a user's auth token expires mid-session, server component GraphQL queries fail and bubble up to slot `error.tsx`
boundaries, which showed a generic "Try again" error state. The dashboard layout only validates auth on initial load —
layouts persist across client-side navigations, so the `me` query never re-runs.

Fixed by wrapping `query()` and `mutate()` in try-catch in `api/gql/server.ts`. The `_query()` call throws
`CombinedGraphQLErrors` on GraphQL errors instead of returning them in `result.error`, so `throwIfAuthError` was never
reached. The catch block now intercepts the thrown error and passes it to `throwIfAuthError`, which redirects to
`/logout` on `AUTH_NOT_AUTHENTICATED`.

**Affected files:**

- `api/gql/server.ts`

---

## Protected Routes Leaked Existence to Unauthenticated Users

**Date:** 2026-01-30
**Status:** Open

`proxy.ts` rewrites to `/not-found` (404) when no auth cookie is present, hiding route existence. However, requests
with an invalid cookie bypass the proxy and reach the backend, where `throwIfAuthError` redirects to `/logout` —
revealing that the route exists. Current behavior by scenario:

- **Cookie lost mid-session:** SSR queries fail → `throwIfAuthError` → redirect to `/logout` → cookie deleted →
  `/login`. Correct behavior.
- **Cookie becomes invalid (expired/revoked):** Same as above. Correct behavior, but the redirect leaks route existence.
- **User logs out:** Clicks logout → `/logout` route handler calls backend, deletes cookie → redirect to `/login`.
  Correct behavior.
- **No cookie, protected route:** `proxy.ts` rewrites to `/not-found` → 404. Route existence hidden.
- **Fake cookie, protected route:** Bypasses `proxy.ts` → SSR queries fail → `throwIfAuthError` → redirect to
  `/logout` → `/login`. Route existence leaked via the redirect (different response from the no-cookie 404).

The fix requires `throwIfAuthError` to return 404 instead of redirecting, but `cookies().delete()` cannot be called
during Server Component rendering (Next.js restriction — only allowed in Server Actions and Route Handlers). Without
cookie deletion, `notFound()` alone creates a redirect loop: the login page sees the stale cookie → redirects to
`/overview` → 404 → stuck.

**Affected files:**

- `proxy.ts`
- `api/gql/server.ts`

---

## Search Params Instability and Loss on Navigation

**Date:** 2026-01-30
**Status:** Open

Two related problems with search params handling:

1. **Inconsistent param ordering** — `URLSearchParams` doesn't guarantee key order, so the same logical state
   (e.g., identical filters + sort + pagination) can produce different URL strings (`?filter=x&sort=y` vs
   `?sort=y&filter=x`). This creates duplicate bookmarks and pollutes browser history.

2. **Sidebar navigation drops search params** — Sidebar links are plain `<Link href="/listings">` with no query
   string. Navigating away from a filtered/sorted view and back resets all filters, sort, and pagination.

**Affected files:**

- `components/primitives/sidebar.tsx`
- `components/composed/toolbar/` (all toolbar panels that read/write search params)

---

## `new Date()` in Server Components Blocks Prerendering

**Date:** 2026-01-30
**Status:** Fixed

Profile card components computed `yearsHosting`/`yearsAdvertising` using `new Date()` at the top level of Server
Components. Next.js blocks this during prerendering because the current time makes output non-deterministic, producing:

> Route "/profile" used new Date() before accessing uncached data

Fixed by adding `"use client"` to both profile card components. They are leaf components with no async data fetching or
children, so the directive has no architectural impact — `new Date()` runs on the client where it's allowed.

**Affected files:**

- `app/(dashboard)/@advertiser/profile/profile-card.tsx`
- `app/(dashboard)/@spaceOwner/profile/profile-card.tsx`

---

## Breadcrumb Shows Raw UUIDs on Dynamic Routes

**Date:** 2026-01-30
**Status:** Fixed

`content-header.tsx` used a hand-written breadcrumb that split `usePathname()` into segments and capitalized them. On
dynamic routes like `/bookings/[id]`, it displayed the raw UUID instead of a meaningful label (e.g., space title). The
implementation also lacked proper accessibility attributes (`aria-label`, `aria-current`) and didn't use the existing
shadcn `Breadcrumb` primitive.

Fixed by extracting a `BreadcrumbNav` composed component that uses the shadcn `Breadcrumb` primitives with proper
accessibility. A `BreadcrumbProvider` context and `useBreadcrumbLabel` hook allow dynamic route components to override
segment labels (e.g., replacing a UUID with a space title). Applied to `@spaceOwner/listings/[id]` and
`@advertiser/bookings/[id]`.

**Affected files:**

- `components/composed/breadcrumb-nav.tsx` (new)
- `app/(dashboard)/content-header.tsx`
- `app/(dashboard)/layout.tsx`
- `app/(dashboard)/@spaceOwner/listings/[id]/header.tsx`
- `app/(dashboard)/@advertiser/bookings/[id]/booking-details-wrapper.tsx`

---

## Recharts SSR Warning for Negative Dimensions

**Date:** 2026-01-30
**Status:** Fixed

`ResponsiveContainer` in `chart.tsx` rendered with `width="100%" height="100%"`. During SSR there is no DOM to measure,
so Recharts falls back to -1 for both dimensions, producing:

> The width(-1) and height(-1) of chart should be greater than 0

`minWidth={0}` was added initially but did not fix the warning — those props only set CSS constraints, not
Recharts' internal dimension state which defaults to -1. Fixed by replacing `minWidth`/`minHeight` with
`initialDimension={{ width: 400, height: 300 }}`, which provides placeholder dimensions during SSR so the
internal state never hits -1. After hydration, ResizeObserver measures the actual container.
Known upstream issue: [recharts#6716](https://github.com/recharts/recharts/issues/6716).

**Affected file:**

- `components/primitives/chart.tsx`

---

## `/profile` Returns 404 and Deletes Auth Cookie in Production

**Date:** 2026-01-30
**Status:** Open

Hard navigation to `/profile` in production returned 404 and deleted the auth cookie, forcing re-login. Two compounding
issues caused the failure:

1. **`default.ts` called `notFound()` in all parallel slots.** During hard navigation in production, Next.js cannot
   determine the active state of unmatched slots and falls back to `default.ts`. Even though all slots have
   `/profile/page.tsx`, production route resolution triggers `default.ts` for non-active slots before `RoleBasedView`
   selects the correct one. Calling `notFound()` there caused a 404 response.

2. **No `app/not-found.tsx` existed with `globalNotFound: true`.** `next.config.ts` sets
   `experimental: { globalNotFound: true }`, which routes all `notFound()` calls to a single root-level `not-found.tsx`.
   That file didn't exist, so Next.js returned a bare 404.

The 404 response caused the dashboard layout's `me` query to fail, `throwIfAuthError` detected
`AUTH_NOT_AUTHENTICATED`, and redirected to `/logout` — deleting the cookie.

Fixed by changing all `default.ts` files to return `null` (per Next.js docs recommendation) and adding a global
`app/not-found.tsx` as a safety net.

**References:**

- [#60989](https://github.com/vercel/next.js/issues/60989) — Parallel route not rendering when built
- [#48090](https://github.com/vercel/next.js/issues/48090) — Parallel routes must provide default.js
- [#48509](https://github.com/vercel/next.js/issues/48509) — 404 on parallel route with default.tsx defined

**Affected files:**

- `app/(dashboard)/@admin/default.ts`
- `app/(dashboard)/@advertiser/default.ts`
- `app/(dashboard)/@marketing/default.ts`
- `app/(dashboard)/@spaceOwner/default.ts`
- `app/not-found.tsx` (new)