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