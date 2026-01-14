# Authentication Fix Report

> Generated: January 13, 2026

## Summary

This report documents the authentication issues identified and the fixes applied to enable login and signup functionality in the Elaview mobile app.

---

## Issues Identified & Fixed

### ✅ Issue 1: GraphQL Endpoint Mismatch (FIXED)

**Problem:** The mobile app's GraphQL endpoint was configured to use port `5000` but the backend runs on port `7106`.

| Setting | Before | After |
|---------|--------|-------|
| `MOBILE_EXPO_PUBLIC_GRAPHQL_ENDPOINT` | `http://localhost:5000/graphql` | `http://localhost:7106/api/graphql` |

**Fix Applied:** Updated Doppler secret via:
```bash
doppler secrets set MOBILE_EXPO_PUBLIC_GRAPHQL_ENDPOINT="http://localhost:7106/api/graphql"
```

---

### ✅ Issue 2: Cookie Security Policy Blocking Development (FIXED)

**Problem:** The backend cookie configuration used `SecurePolicy.Always` and `SameSite.Strict`, which:
- `SecurePolicy.Always` requires HTTPS, but development runs on HTTP
- `SameSite.Strict` blocks cookies in cross-origin requests from mobile apps

**File:** `backend/Bootstrap/Services.cs`

**Fix Applied:** Made cookie policy environment-aware:
```csharp
// Before
options.Cookie.SecurePolicy = CookieSecurePolicy.Always;
options.Cookie.SameSite = SameSiteMode.Strict;

// After
options.Cookie.SecurePolicy = builder.Environment.IsDevelopment()
    ? CookieSecurePolicy.None
    : CookieSecurePolicy.Always;
options.Cookie.SameSite = builder.Environment.IsDevelopment()
    ? SameSiteMode.Lax
    : SameSiteMode.Strict;
```

---

### ✅ Issue 3: CORS Origins Missing Expo URLs (FIXED)

**Problem:** CORS origins only included web URLs, not Expo development URLs.

| Setting | Before | After |
|---------|--------|-------|
| `BACKEND_CORS_ORIGINS` | `http://localhost:3000,http://localhost:8081` | `http://localhost:3000,http://localhost:8081,exp://localhost:8081,http://127.0.0.1:8081` |

**Fix Applied:** Updated Doppler secret to include Expo origins.

---

### ✅ Issue 4: SocialIconBar Missing on Signup (FIXED)

**Problem:** The register screen used placeholder text buttons instead of the `SocialIconBar` component.

**File:** `clients/mobile/src/app/(auth)/register.tsx`

**Fix Applied:** 
- Added import for `SocialIconBar` component
- Replaced inline TouchableOpacity buttons with `<SocialIconBar />`

---

## Remaining Manual Steps Required

### 🔴 Step 1: Start PostgreSQL Database

The database container is not running. Start it with one of these options:

**Option A - Docker:**
```bash
cd backend && docker-compose up -d postgres
```

**Option B - Devbox PostgreSQL:**
```bash
devbox services start postgresql
```

**Option C - Start container manually:**
```bash
docker start elaview-postgres
```

---

### 🔴 Step 2: Start the Backend Server

The backend is not running on port 7106. Start it:

```bash
cd backend && devbox run -- dotnet run
```

Or using the ev command:
```bash
ev backend:start
```

---

### 🔴 Step 3: Reload Doppler Environment

After the Doppler secrets update, reload your shell environment:

```bash
# Exit and re-enter devbox shell to reload secrets
exit
devbox shell
```

Or in the mobile directory:
```bash
cd clients/mobile
# Rebuild the app to pick up new environment variables
npx expo run:ios --device
```

---

### 🔴 Step 4: Rebuild Mobile App (Required)

Environment variables are baked in at build time via `app.config.js`. You must rebuild:

```bash
cd clients/mobile
npx expo run:ios
```

---

## Verification Checklist

After applying all fixes, verify:

- [ ] PostgreSQL is running: `lsof -i :5432`
- [ ] Backend is running: `lsof -i :7106`
- [ ] Test login endpoint: `curl -X POST http://localhost:7106/api/auth/login -H "Content-Type: application/json" -d '{"email":"test@example.com","password":"password"}'`
- [ ] GraphQL accessible: `curl http://localhost:7106/api/graphql`
- [ ] Mobile app can reach backend (check Expo logs for network errors)

---

## Architecture Notes

### Authentication Flow
```
Mobile App (Expo) 
    ↓ POST /api/auth/login
Backend (.NET 10 on :7106)
    ↓ Validates credentials via AuthService
PostgreSQL Database
    ↓ Returns user data
Backend sets HttpOnly cookie
    ↓ Cookie stored by mobile fetch
Subsequent requests include cookie automatically
```

### Environment Variable Flow
```
Doppler Secrets
    ↓ Loaded via scripts/init/env.sh
Prefixed with ELAVIEW_
    ↓ Read by app.config.js
Exposed via expo-constants
    ↓ Accessed in src/config/env.ts
Used by src/config/api.ts for endpoints
```

---

## Files Modified

| File | Change |
|------|--------|
| `backend/Bootstrap/Services.cs` | Cookie policy made environment-aware |
| `clients/mobile/src/app/(auth)/register.tsx` | Added SocialIconBar component |
| Doppler: `MOBILE_EXPO_PUBLIC_GRAPHQL_ENDPOINT` | Changed to port 7106 |
| Doppler: `BACKEND_CORS_ORIGINS` | Added Expo development origins |
