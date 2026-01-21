# Mobile Authentication Setup

> Complete authentication implementation using the backend REST API

## Overview

The mobile app uses cookie-based authentication with the backend .NET API. Authentication state is managed via React Context and persisted using Expo SecureStore.

## Architecture

### Components

1. **Auth Types** (`src/types/auth.ts`)
   - Type definitions for User, LoginRequest, LoginResponse, etc.
   - Matches backend .NET API response structures

2. **Auth Service** (`src/services/auth.ts`)
   - REST API integration for login, signup, logout
   - Uses configured endpoints from `@/config/api`
   - Cookie-based session management

3. **Auth Context** (`src/contexts/AuthContext.tsx`)
   - Global authentication state management
   - Provides `login`, `signup`, `logout`, `refreshUser` functions
   - Persists user data to SecureStore
   - Wraps the entire app in `_layout.tsx`

4. **Auth Screens**
   - **Login** (`src/app/(auth)/login.tsx`) - Email/password login
   - **Register** (`src/app/(auth)/register.tsx`) - User signup with validation

## Authentication Flow

### Login Flow

```
1. User enters email and password
2. App validates input (email format, required fields)
3. Calls login() from AuthContext
4. AuthContext calls authService.login()
5. Service makes POST to /api/auth/login with credentials
6. Backend validates and sets session cookie
7. Response contains user data (id, email, name, role)
8. User data saved to SecureStore
9. Navigate to role-select screen
```

### Signup Flow

```
1. User enters name, email, password, confirm password
2. App validates input (password length, match, email format)
3. Calls signup() from AuthContext
4. AuthContext calls authService.signup()
5. Service makes POST to /api/auth/signup
6. Backend creates user and sets session cookie
7. Response contains user data
8. User data saved to SecureStore
9. Navigate to role-select screen
```

### Logout Flow

```
1. User clicks logout
2. Calls logout() from AuthContext
3. AuthContext calls authService.logout()
4. Service makes POST to /api/auth/logout
5. Backend clears session cookie
6. User data removed from SecureStore
7. Navigate to login screen
```

## Usage

### Using Auth Context in Components

```typescript
import { useAuth } from '@/contexts/AuthContext';

export default function MyScreen() {
  const { user, isAuthenticated, isLoading, login, logout } = useAuth();

  if (isLoading) {
    return <ActivityIndicator />;
  }

  if (!isAuthenticated) {
    return <Text>Please log in</Text>;
  }

  return (
    <View>
      <Text>Welcome, {user.name}!</Text>
      <Text>Email: {user.email}</Text>
      <Text>Role: {user.role}</Text>
      <Button title="Logout" onPress={logout} />
    </View>
  );
}
```

### Protected Routes

To protect a route, check authentication status:

```typescript
import { useAuth } from '@/contexts/AuthContext';
import { Redirect } from 'expo-router';

export default function ProtectedScreen() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <ActivityIndicator />;
  }

  if (!isAuthenticated) {
    return <Redirect href="/(auth)/login" />;
  }

  return <YourProtectedContent />;
}
```

## API Endpoints

All endpoints use cookie-based authentication with `credentials: 'include'`.

### POST /api/auth/login

**Request:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "id": "user-id",
  "email": "user@example.com",
  "name": "John Doe",
  "role": "Advertiser",
  "message": "Login successful"
}
```

### POST /api/auth/signup

**Request:**
```json
{
  "name": "John Doe",
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "id": "user-id",
  "email": "user@example.com",
  "name": "John Doe",
  "role": "User",
  "message": "Account created successfully"
}
```

### POST /api/auth/logout

**Request:** Empty body

**Response:** 200 OK

## User Roles

The backend uses roles for permission levels:

- **Admin** - Full system access
- **Advertiser** - Can book ad spaces
- **User** - Basic user permissions

**Note:** Roles are separate from profile types (AdvertiserProfile, SpaceOwnerProfile). Users can have multiple profiles.

## Security Features

1. **Cookie-based sessions** - Secure HTTP-only cookies managed by backend
2. **SecureStore** - User data encrypted on device
3. **Input validation** - Email format, password length, required fields
4. **Error handling** - User-friendly error messages
5. **Loading states** - Prevents double-submission

## Testing Authentication

### Manual Testing

1. **Start the backend:**
   ```bash
   devbox shell
   ev backend:start
   ```

2. **Start the mobile app:**
   ```bash
   cd clients/mobile
   pnpm dev
   ```

3. **Test signup:**
   - Open app and navigate to Register
   - Enter: Name, Email, Password, Confirm Password
   - Click "Sign up"
   - Should navigate to role selection on success

4. **Test login:**
   - Navigate to Login
   - Enter registered email and password
   - Click "Sign in"
   - Should navigate to role selection on success

5. **Verify session persistence:**
   - Close and reopen the app
   - Should remain logged in (user data loaded from SecureStore)

### Common Issues

**Issue: "Network request failed"**
- Solution: Make sure backend is running (`ev backend:start`)
- Check API_URL in environment variables: `ev env:list:mobile`

**Issue: "Login failed" with valid credentials**
- Solution: Check backend logs: `ev backend:logs`
- Verify CORS settings allow mobile app origin

**Issue: User not persisted after app restart**
- Solution: Check SecureStore permissions on device
- Verify AuthContext is properly loading saved user on mount

## Next Steps

### TODO: Implement GraphQL Integration

Currently, the `getCurrentUser()` function returns null. When implementing GraphQL:

1. Set up Apollo Client (see `API-INTEGRATION-GUIDE.md`)
2. Implement `currentUser` query
3. Update `refreshUser()` in AuthContext to use GraphQL
4. Fetch full user profile after login (including profiles)

### TODO: Session Expiry Handling

Add session expiry detection:

1. Add error interceptor to detect 401 responses
2. Clear auth state and redirect to login
3. Show "Session expired" message to user

### TODO: Remember Me

Add optional "Remember Me" feature:

1. Add checkbox to login screen
2. Store flag in SecureStore
3. Auto-login on app launch if enabled

## Files Created

- ✅ `src/types/auth.ts` - Auth type definitions
- ✅ `src/services/auth.ts` - REST API service
- ✅ `src/contexts/AuthContext.tsx` - Auth state management
- ✅ `src/app/(auth)/login.tsx` - Updated with auth integration
- ✅ `src/app/(auth)/register.tsx` - Updated with auth integration
- ✅ `src/app/_layout.tsx` - Added AuthProvider

---

**Last Updated**: 2026-01-12
