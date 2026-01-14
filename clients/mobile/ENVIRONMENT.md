# Mobile Environment Configuration

> Quick reference for environment variables and configuration in the Elaview mobile app

## Overview

The mobile app uses **Doppler for secrets management** and loads environment variables via **devbox shell**. There are no `.env` files - all configuration comes from `ELAVIEW_MOBILE_*` environment variables.

## How It Works

1. **Devbox shell** loads environment variables from Doppler with `ELAVIEW_MOBILE_` prefix
2. **app.config.js** reads these variables at build time via `process.env`
3. **src/config/env.ts** exposes them for use throughout the app via `expo-constants`
4. Import and use via `@/config` path alias

## Usage

### Import environment variables

```typescript
import {
  API_URL,
  GRAPHQL_ENDPOINT,
  ENV,
  DEBUG,
  STRIPE_PUBLISHABLE_KEY,
  GOOGLE_MAPS_API_KEY,
  CLOUDINARY_CLOUD_NAME,
  ENABLE_PUSH_NOTIFICATIONS
} from '@/config';
```

### Use with fetch (REST API)

```typescript
import { endpoints, defaultFetchOptions } from '@/config/api';

const response = await fetch(endpoints.auth.login, {
  ...defaultFetchOptions,
  method: 'POST',
  body: JSON.stringify({ email, password }),
});
```

### Use with Apollo Client (GraphQL)

```typescript
import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { GRAPHQL_ENDPOINT } from '@/config';

const httpLink = createHttpLink({
  uri: GRAPHQL_ENDPOINT,
  credentials: 'include',
});
```

### Feature flags

```typescript
import { ENABLE_PUSH_NOTIFICATIONS, ENABLE_ANALYTICS } from '@/config';

if (ENABLE_PUSH_NOTIFICATIONS) {
  // Initialize push notifications
}
```

## Available Variables

All variables are defined in Doppler with the `ELAVIEW_MOBILE_` prefix:

- **API Configuration**: `API_URL`, `GRAPHQL_ENDPOINT`, `APP_URL`
- **Authentication**: `CLERK_PUBLISHABLE_KEY`
- **Cloudinary**: `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_UPLOAD_PRESET_*`
- **Google Maps**: `GOOGLE_MAPS_API_KEY`, `GOOGLE_MAPS_MAP_ID`
- **Stripe**: `STRIPE_PUBLISHABLE_KEY`
- **Feature Flags**: `ENABLE_NEW_BOOKING_FLOW`, `ENABLE_PUSH_NOTIFICATIONS`, `ENABLE_ANALYTICS`
- **Environment**: `ENV` (development/staging/production), `DEBUG`

## Configuration Files

- **app.config.js** - Reads env vars from devbox and injects into app
- **src/config/env.ts** - Typed exports for all environment variables
- **src/config/api.ts** - API endpoints and fetch utilities
- **src/config/index.ts** - Main export point

## Documentation

- **Detailed usage examples**: `src/config/README.md`
- **API integration guide**: `API-INTEGRATION-GUIDE.md`
- **Project instructions**: `../../CLAUDE.md`

## Important Rules

✅ **DO**: Import from `@/config` in your code
✅ **DO**: Use devbox shell to load environment variables
✅ **DO**: Add new variables to Doppler with `ELAVIEW_MOBILE_` prefix

❌ **DON'T**: Create `.env` files
❌ **DON'T**: Use `process.env` directly in app code
❌ **DON'T**: Hardcode API URLs or secrets

## Troubleshooting

**Problem**: Environment variables are undefined

**Solution**:
1. Make sure you're running in devbox shell: `devbox shell`
2. Check variables are loaded: `ev env:list:mobile`
3. Restart Expo dev server after shell restart

**Problem**: Variables not updating after change

**Solution**:
1. Stop Expo dev server
2. Exit and restart devbox shell
3. Clear Expo cache: `pnpm start --clear`
4. Restart dev server

---

**Last Updated**: 2026-01-12
