# Known Issues

## Parallel Routes Render All Slots

**Date:** 2026-01-27
**Status:** Open (Next.js limitation)

All parallel route slots execute server-side code regardless of which one is displayed. With role-based parallel routes (`@admin`, `@advertiser`, etc.), every slot renders on each request—causing unnecessary data fetching and degraded performance.

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
**Status:** Open

"Reset to default" (sort) and "Clear filters" (filter) currently clear local state AND commit to the URL in a single click. They should only reset the local pending state — the user must click "Apply" to confirm.

**Affected files:**
- `components/composed/toolbar/filters-panel.tsx`
- `components/composed/toolbar/sort-panel.tsx`

---

## Sort Panel Allows Duplicate Field Selection

**Date:** 2026-01-29
**Status:** Open

The secondary sort selector shows all fields including the one already selected as primary. Selecting the same field for both primary and secondary is nonsensical. The secondary selector should exclude the currently selected primary field.

**Affected file:**
- `components/composed/toolbar/sort-panel.tsx`