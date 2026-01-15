# Authentication Configuration Changes

> **Date:** January 13, 2026  
> **Branch:** Current working branch  
> **Status:** Applied

---

## Changes Summary

This document tracks all authentication-related changes made to resolve login/signup issues in the mobile app.

---

## Change 1: Cookie Policy Configuration

**File:** `backend/Bootstrap/Services.cs`

### Before
```csharp
options.Cookie.HttpOnly = true;
options.Cookie.SecurePolicy = CookieSecurePolicy.Always;
options.Cookie.SameSite = SameSiteMode.Strict;
```

### After
```csharp
options.Cookie.HttpOnly = true;
// In development, allow non-HTTPS cookies for local testing
options.Cookie.SecurePolicy = builder.Environment.IsDevelopment()
    ? CookieSecurePolicy.None
    : CookieSecurePolicy.Always;
// Use Lax for mobile app compatibility (cross-origin requests)
options.Cookie.SameSite = builder.Environment.IsDevelopment()
    ? SameSiteMode.Lax
    : SameSiteMode.Strict;
```

### Revert Command
```bash
cd /Users/michaelanderson/Code/elaview-org/elaview-production
git checkout HEAD -- backend/Bootstrap/Services.cs
```

---

## Change 2: GraphQL Endpoint (Doppler)

**Secret:** `MOBILE_EXPO_PUBLIC_GRAPHQL_ENDPOINT`

| Before | After |
|--------|-------|
| `http://localhost:5000/graphql` | `http://localhost:7106/api/graphql` |

### Revert Command
```bash
devbox run -- doppler secrets set MOBILE_EXPO_PUBLIC_GRAPHQL_ENDPOINT="http://localhost:5000/graphql"
```

---

## Change 3: CORS Origins (Doppler)

**Secret:** `BACKEND_CORS_ORIGINS`

| Before | After |
|--------|-------|
| `http://localhost:3000,http://localhost:8081` | `http://localhost:3000,http://localhost:8081,exp://localhost:8081,http://127.0.0.1:8081` |

### Revert Command
```bash
devbox run -- doppler secrets set BACKEND_CORS_ORIGINS="http://localhost:3000,http://localhost:8081"
```

---

## Change 4: SocialIconBar on Register Screen

**File:** `clients/mobile/src/app/(auth)/register.tsx`

### Before
```tsx
import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Link, useRouter } from 'expo-router';
// ...

{/* Social Login */}
<Text style={styles.orText}>Or continue with</Text>
<View style={styles.socialContainer}>
  <TouchableOpacity style={styles.socialButton}>
    <Text style={styles.socialIcon}>G</Text>
  </TouchableOpacity>
  <TouchableOpacity style={styles.socialButton}>
    <Text style={styles.socialIcon}>f</Text>
  </TouchableOpacity>
  <TouchableOpacity style={styles.socialButton}>
    <Text style={styles.socialIcon}></Text>
  </TouchableOpacity>
</View>
```

### After
```tsx
import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SocialIconBar } from '@/components/features/SocialIconBar';
import { Link, useRouter } from 'expo-router';
// ...

{/* Social Login */}
<Text style={styles.orText}>Or continue with</Text>
<View style={styles.socialContainer}>
  <SocialIconBar />
</View>
```

### Revert Command
```bash
cd /Users/michaelanderson/Code/elaview-org/elaview-production
git checkout HEAD -- clients/mobile/src/app/(auth)/register.tsx
```

---

## Full Reversion Strategy

### Option A: Revert All Git Changes
```bash
cd /Users/michaelanderson/Code/elaview-org/elaview-production

# Revert all file changes
git checkout HEAD -- backend/Bootstrap/Services.cs
git checkout HEAD -- clients/mobile/src/app/(auth)/register.tsx

# Revert Doppler secrets
devbox run -- doppler secrets set MOBILE_EXPO_PUBLIC_GRAPHQL_ENDPOINT="http://localhost:5000/graphql"
devbox run -- doppler secrets set BACKEND_CORS_ORIGINS="http://localhost:3000,http://localhost:8081"

# Rebuild mobile app to pick up reverted env vars
cd clients/mobile && npx expo run:ios
```

### Option B: Revert Specific Changes Only

**If only cookie policy needs reverting:**
```bash
git checkout HEAD -- backend/Bootstrap/Services.cs
```

**If only Doppler secrets need reverting:**
```bash
devbox run -- doppler secrets set MOBILE_EXPO_PUBLIC_GRAPHQL_ENDPOINT="http://localhost:5000/graphql"
devbox run -- doppler secrets set BACKEND_CORS_ORIGINS="http://localhost:3000,http://localhost:8081"
```

**If only register.tsx needs reverting:**
```bash
git checkout HEAD -- clients/mobile/src/app/(auth)/register.tsx
```

---

## Post-Reversion Steps

After reverting any changes:

1. **Restart the backend:**
   ```bash
   cd backend && dotnet run
   ```

2. **Reload Doppler environment:**
   ```bash
   exit  # Exit devbox shell
   devbox shell  # Re-enter to reload secrets
   ```

3. **Rebuild mobile app:**
   ```bash
   cd clients/mobile && npx expo run:ios
   ```

---

## Why These Changes Were Made

| Issue | Root Cause | Fix Applied |
|-------|------------|-------------|
| Login/signup fails silently | Cookie `SecurePolicy.Always` requires HTTPS | Made policy environment-aware |
| Cookies not sent from mobile | `SameSite.Strict` blocks cross-origin | Changed to `Lax` in development |
| GraphQL requests fail | Wrong port (5000 vs 7106) | Updated Doppler secret |
| CORS errors in Expo | Missing Expo origins | Added `exp://` URLs |
| Inconsistent social icons | Register used placeholder text | Used `SocialIconBar` component |

---

## Related Files

- [AUTH-FIX-REPORT.md](./AUTH-FIX-REPORT.md) - Detailed analysis report
- [AUTHENTICATION.md](../clients/mobile/AUTHENTICATION.md) - Mobile auth documentation
- [Services.cs](../backend/Bootstrap/Services.cs) - Backend auth configuration
