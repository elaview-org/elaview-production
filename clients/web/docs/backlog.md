# Backlog

## Storage Key Consistency

**Date:** 2026-01-27

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