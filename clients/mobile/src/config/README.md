# Configuration

This directory contains app configuration that reads environment variables from devbox/Doppler.

## Setup

1. **Start devbox shell** (loads environment variables from Doppler):
   ```bash
   devbox shell
   ```

2. **Environment variables** are automatically loaded with `ELAVIEW_MOBILE_` prefix

3. **Access in your code** via the config modules:

## Usage Examples

### Import environment variables

```typescript
import { API_URL, GRAPHQL_ENDPOINT, ENV, DEBUG } from '@/config';

console.log('API URL:', API_URL);
console.log('Environment:', ENV);
console.log('Debug mode:', DEBUG);
```

### Use with fetch (REST API)

```typescript
import { endpoints, defaultFetchOptions } from '@/config/api';

async function login(email: string, password: string) {
  const response = await fetch(endpoints.auth.login, {
    ...defaultFetchOptions,
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });

  return response.json();
}
```

### Use with Apollo Client (GraphQL)

```typescript
import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { GRAPHQL_ENDPOINT } from '@/config';

const httpLink = createHttpLink({
  uri: GRAPHQL_ENDPOINT,
  credentials: 'include',
});

export const apolloClient = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
});
```

### Feature flags

```typescript
import {
  ENABLE_NEW_BOOKING_FLOW,
  ENABLE_PUSH_NOTIFICATIONS,
  ENABLE_ANALYTICS
} from '@/config';

if (ENABLE_PUSH_NOTIFICATIONS) {
  // Initialize push notification service
}

if (ENABLE_ANALYTICS) {
  // Initialize analytics
}
```

### Cloudinary uploads

```typescript
import {
  CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_UPLOAD_PRESET_SPACES
} from '@/config';

const uploadToCloudinary = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET_SPACES);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
    {
      method: 'POST',
      body: formData,
    }
  );

  return response.json();
};
```

## How it works

1. **app.config.js** reads `process.env.ELAVIEW_MOBILE_*` variables at build time
2. Variables are injected into the app via `expo.extra.env`
3. **src/config/env.ts** reads from `Constants.expoConfig.extra.env` at runtime
4. Import and use anywhere in your app

## Available Variables

See `src/config/env.ts` for the complete list of available environment variables.
