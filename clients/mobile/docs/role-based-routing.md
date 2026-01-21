# Role-Based Routing Proposal

> Aligning mobile app routing with the web app's backend-driven profile type pattern.

## Problem Statement

The current mobile implementation stores user role locally in SecureStore, disconnected from the authenticated user's
`activeProfileType` on the backend. This creates several issues:

1. Role state can drift between mobile and web clients
2. No server-side validation of role access
3. Role selection happens client-side rather than being persisted to the user profile
4. Auth and role are managed as separate concerns when they should be unified

The web app derives the user's profile type from the GraphQL `me` query, ensuring consistency across all clients and
enabling server-side role switching via mutation.

## Current State

### Web App (Next.js 15)

The web app uses Next.js parallel routes (`@advertiser`, `@spaceOwner`) with a dashboard layout that fetches the current
user and conditionally renders the appropriate slot based on `activeProfileType`.

```
app/(dashboard)/
├── layout.tsx              # Fetches me query, renders slot based on role
├── @advertiser/            # Advertiser-specific routes
└── @spaceOwner/            # Space owner-specific routes
```

Key characteristics:

| Aspect           | Implementation                                       |
|------------------|------------------------------------------------------|
| Role source      | `me.activeProfileType` from GraphQL                  |
| Auth guard       | Layout-level query, redirect to `/logout` if no user |
| Role switch      | `updateCurrentUser` mutation + `revalidatePath`      |
| State management | Server-side, no client state for role                |

### Mobile App (Current)

The mobile app uses Expo Router route groups (`(advertiser)`, `(owner)`) with role stored in a separate `RoleContext`
using SecureStore.

```
src/app/
├── _layout.tsx             # Wraps with AuthProvider + RoleProvider
├── index.tsx               # Checks local role, redirects
├── (advertiser)/           # Advertiser tabs
└── (owner)/                # Owner tabs
```

| Aspect           | Implementation                            |
|------------------|-------------------------------------------|
| Role source      | SecureStore key `user_role`               |
| Auth guard       | None (TODO in codebase)                   |
| Role switch      | Clear local role, navigate to role-select |
| State management | Two separate contexts (Auth + Role)       |

## Proposed Architecture

### Design Principles

**Backend as source of truth**: The user's `activeProfileType` is stored on the backend and fetched via the `me` query.
The mobile app never stores role locally.

**Unified session context**: A single `SessionContext` replaces both `AuthContext` and `RoleContext`, providing user
data including profile type.

**Protected route group**: A `(protected)` route group wraps role-specific groups and enforces authentication at the
layout level.

**Profile types only**: The mobile app supports two profile types: `ADVERTISER` and `SPACE_OWNER`. Admin and Marketing
roles are web-only.

### Route Structure

```
src/app/
├── _layout.tsx                     # Root: ApolloWrapper + SessionProvider + ThemeProvider
├── index.tsx                       # Splash: check session, redirect accordingly
├── (auth)/                         # Public authentication routes
│   ├── _layout.tsx                 # Stack navigator, no auth required
│   ├── login.tsx
│   ├── register.tsx
│   └── forgot-password.tsx
├── (protected)/                    # Authenticated routes wrapper
│   ├── _layout.tsx                 # Auth guard: fetch me, redirect if null
│   ├── (advertiser)/               # Advertiser profile routes
│   │   ├── _layout.tsx             # Tab navigator with advertiser tabs
│   │   ├── discover.tsx
│   │   ├── bookings.tsx
│   │   ├── messages.tsx
│   │   ├── alerts.tsx
│   │   └── profile.tsx
│   ├── (owner)/                    # Space owner profile routes
│   │   ├── _layout.tsx             # Tab navigator with owner tabs
│   │   ├── listings.tsx
│   │   ├── bookings.tsx
│   │   ├── messages.tsx
│   │   ├── earnings.tsx
│   │   ├── profile.tsx
│   │   └── new-listing/
│   └── profile-select.tsx          # Initial profile selection (new users only)
├── settings.tsx                    # Global settings (accessible from drawer)
└── help.tsx                        # Help center
```

### Session Context

Replace `AuthContext` and `RoleContext` with a unified `SessionContext`.

**File**: `src/contexts/SessionContext.tsx`

```typescript
import {createContext, useContext, useState, useEffect, ReactNode, useCallback} from "react";
import {useQuery, useMutation, useApolloClient} from "@apollo/client";
import * as SecureStore from "expo-secure-store";
import {ME_QUERY, SWITCH_PROFILE_MUTATION, LOGOUT_MUTATION} from "@/api/operations";

type ProfileType = "ADVERTISER" | "SPACE_OWNER";

interface User {
    id: string;
    email: string;
    name: string;
    avatar?: string;
    activeProfileType: ProfileType | null;
}

interface SessionContextType {
    user: User | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    profileType: ProfileType | null;
    switchProfile: (targetType: ProfileType) => Promise<void>;
    logout: () => Promise<void>;
    refetchUser: () => Promise<void>;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

const TOKEN_KEY = "auth_token";

export function SessionProvider({children}: { children: ReactNode }) {
    const client = useApolloClient();
    const [hasToken, setHasToken] = useState<boolean | null>(null);

    useEffect(() => {
        SecureStore.getItemAsync(TOKEN_KEY).then((token) => {
            setHasToken(!!token);
        });
    }, []);

    const {data, loading, refetch} = useQuery(ME_QUERY, {
        skip: hasToken === null || hasToken === false,
        fetchPolicy: "network-only",
    });

    const [switchProfileMutation] = useMutation(SWITCH_PROFILE_MUTATION);

    const user = data?.me ?? null;
    const isLoading = hasToken === null || (hasToken && loading);
    const isAuthenticated = !!user;
    const profileType = user?.activeProfileType ?? null;

    const switchProfile = useCallback(async (targetType: ProfileType) => {
        const {data: result} = await switchProfileMutation({
            variables: {input: {activeProfileType: targetType}},
        });

        if (result?.updateCurrentUser?.errors?.length) {
            throw new Error(result.updateCurrentUser.errors[0].message);
        }

        await refetch();
    }, [switchProfileMutation, refetch]);

    const logout = useCallback(async () => {
        await SecureStore.deleteItemAsync(TOKEN_KEY);
        await client.clearStore();
        setHasToken(false);
    }, [client]);

    const refetchUser = useCallback(async () => {
        await refetch();
    }, [refetch]);

    return (
        <SessionContext.Provider
            value = {
    {
        user,
            isLoading,
            isAuthenticated,
            profileType,
            switchProfile,
            logout,
            refetchUser,
    }
}
>
    {
        children
    }
    </SessionContext.Provider>
)
    ;
}

export function useSession() {
    const context = useContext(SessionContext);
    if (!context) {
        throw new Error("useSession must be used within a SessionProvider");
    }
    return context;
}
```

### GraphQL Operations

**File**: `src/api/operations/session.ts`

```typescript
import {gql} from "@apollo/client";

export const ME_QUERY = gql`
  query Me {
    me {
      id
      email
      name
      avatar
      activeProfileType
    }
  }
`;

export const SWITCH_PROFILE_MUTATION = gql`
  mutation SwitchProfile($input: UpdateCurrentUserInput!) {
    updateCurrentUser(input: $input) {
      user {
        id
        activeProfileType
      }
      errors {
        message
        path
      }
    }
  }
`;
```

### Protected Layout Guard

**File**: `src/app/(protected)/_layout.tsx`

```typescript
import {useEffect} from "react";
import {Slot, useRouter, useSegments} from "expo-router";
import {View, ActivityIndicator, StyleSheet} from "react-native";
import {useSession} from "@/contexts/SessionContext";
import {colors} from "@/constants/theme";

export default function ProtectedLayout() {
    const {user, isLoading, isAuthenticated, profileType} = useSession();
    const router = useRouter();
    const segments = useSegments();

    useEffect(() => {
        if (isLoading) return;

        if (!isAuthenticated) {
            router.replace("/(auth)/login");
            return;
        }

        if (!profileType) {
            router.replace("/(protected)/profile-select");
            return;
        }

        const currentGroup = segments[1];
        const isInAdvertiser = currentGroup === "(advertiser)";
        const isInOwner = currentGroup === "(owner)";
        const shouldBeInOwner = profileType === "SPACE_OWNER";

        if (shouldBeInOwner && isInAdvertiser) {
            router.replace("/(protected)/(owner)/listings");
        } else if (!shouldBeInOwner && isInOwner) {
            router.replace("/(protected)/(advertiser)/discover");
        }
    }, [isLoading, isAuthenticated, profileType, segments]);

    if (isLoading) {
        return (
            <View style = {styles.loading} >
            <ActivityIndicator size = "large"
        color = {colors.primary}
        />
        < /View>
    )
        ;
    }

    if (!isAuthenticated || !profileType) {
        return null;
    }

    return <Slot / >;
}

const styles = StyleSheet.create({
    loading: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
});
```

### Root Layout

**File**: `src/app/_layout.tsx`

```typescript
import {View} from "react-native";
import {Slot} from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import {ApolloWrapper} from "@/api";
import {SessionProvider} from "@/contexts/SessionContext";
import {ThemeProvider} from "@/contexts/ThemeContext";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
    return (
        <View style = {
    {
        flex: 1
    }
}>
    <ApolloWrapper>
        <SessionProvider>
            <ThemeProvider>
                <Slot / >
    </ThemeProvider>
    < /SessionProvider>
    < /ApolloWrapper>
    < /View>
)
    ;
}
```

### Splash/Index Screen

**File**: `src/app/index.tsx`

```typescript
import {useEffect} from "react";
import {View, ActivityIndicator, StyleSheet} from "react-native";
import {useRouter} from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import {useSession} from "@/contexts/SessionContext";
import {colors} from "@/constants/theme";

export default function SplashScreen() {
    const router = useRouter();
    const {isLoading, isAuthenticated, profileType} = useSession();

    useEffect(() => {
        if (isLoading) return;

        SplashScreen.hideAsync();

        if (!isAuthenticated) {
            router.replace("/(auth)/login");
            return;
        }

        if (!profileType) {
            router.replace("/(protected)/profile-select");
            return;
        }

        const route =
            profileType === "SPACE_OWNER"
                ? "/(protected)/(owner)/listings"
                : "/(protected)/(advertiser)/discover";

        router.replace(route);
    }, [isLoading, isAuthenticated, profileType]);

    return (
        <View style = {styles.container} >
        <ActivityIndicator size = "large"
    color = {colors.primary}
    />
    < /View>
)
    ;
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
});
```

### Profile Selection Screen

For new users who have authenticated but haven't selected a profile type yet.

**File**: `src/app/(protected)/profile-select.tsx`

```typescript
import {useState} from "react";
import {View, Text, Pressable, StyleSheet, ActivityIndicator} from "react-native";
import {useRouter} from "expo-router";
import {SafeAreaView} from "react-native-safe-area-context";
import {Ionicons} from "@expo/vector-icons";
import {useSession} from "@/contexts/SessionContext";
import {colors, spacing} from "@/constants/theme";

type ProfileType = "ADVERTISER" | "SPACE_OWNER";

export default function ProfileSelectScreen() {
    const router = useRouter();
    const {switchProfile} = useSession();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [selectedType, setSelectedType] = useState<ProfileType | null>(null);

    const handleSelect = async (type: ProfileType) => {
        setSelectedType(type);
        setIsSubmitting(true);

        try {
            await switchProfile(type);
            const route =
                type === "SPACE_OWNER"
                    ? "/(protected)/(owner)/listings"
                    : "/(protected)/(advertiser)/discover";
            router.replace(route);
        } catch (error) {
            console.error("Failed to set profile type:", error);
            setIsSubmitting(false);
            setSelectedType(null);
        }
    };

    return (
        <SafeAreaView style = {styles.container} >
        <View style = {styles.content} >
        <Text style = {styles.title} > How
    will
    you
    use
    Elaview ? </Text>
        < Text style = {styles.subtitle} > You
    can
    switch between
        profiles
            anytime < /Text>

            < View
            style = {styles.options} >
            <Pressable
                style = {
                [
                    styles.option,
                selectedType === "ADVERTISER" && styles.optionSelected,
        ]
}
    onPress = {()
=>
    handleSelect("ADVERTISER")
}
    disabled = {isSubmitting}
    >
    <Ionicons name = "megaphone-outline"
    size = {32}
    color = {colors.primary}
    />
    < Text
    style = {styles.optionTitle} > Advertiser < /Text>
        < Text
    style = {styles.optionDescription} >
        Find
    and
    book
    ad
    spaces
    for your business
    < /Text>
    < /Pressable>

    < Pressable
    style = {
        [
            styles.option,
        selectedType === "SPACE_OWNER" && styles.optionSelected,
]
}
    onPress = {()
=>
    handleSelect("SPACE_OWNER")
}
    disabled = {isSubmitting}
    >
    <Ionicons name = "storefront-outline"
    size = {32}
    color = {colors.primary}
    />
    < Text
    style = {styles.optionTitle} > Space
    Owner < /Text>
    < Text
    style = {styles.optionDescription} >
        List
    your
    spaces
    and
    earn
    from
    advertisers
    < /Text>
    < /Pressable>
    < /View>

    {
        isSubmitting && (
            <ActivityIndicator
                size = "small"
        color = {colors.primary}
        style = {styles.loader}
        />
    )
    }
    </View>
    < /SafeAreaView>
)
    ;
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    content: {
        flex: 1,
        paddingHorizontal: spacing.lg,
        paddingTop: spacing.xl,
    },
    title: {
        fontSize: 24,
        fontWeight: "600",
        color: colors.text,
        textAlign: "center",
    },
    subtitle: {
        fontSize: 14,
        color: colors.textSecondary,
        textAlign: "center",
        marginTop: spacing.xs,
        marginBottom: spacing.xl,
    },
    options: {
        gap: spacing.md,
    },
    option: {
        backgroundColor: colors.card,
        borderRadius: 12,
        padding: spacing.lg,
        borderWidth: 2,
        borderColor: colors.border,
    },
    optionSelected: {
        borderColor: colors.primary,
    },
    optionTitle: {
        fontSize: 18,
        fontWeight: "600",
        color: colors.text,
        marginTop: spacing.sm,
    },
    optionDescription: {
        fontSize: 14,
        color: colors.textSecondary,
        marginTop: spacing.xs,
    },
    loader: {
        marginTop: spacing.lg,
    },
});
```

### Drawer Menu Update

Update the drawer to use `switchProfile` from session context.

**File**: `src/components/ui/DrawerMenu.tsx` (relevant section)

```typescript
import {useSession} from "@/contexts/SessionContext";

export default function DrawerMenu({visible, onClose}: DrawerMenuProps) {
    const router = useRouter();
    const {profileType, switchProfile, logout} = useSession();
    const [isSwitching, setIsSwitching] = useState(false);

    const handleSwitchProfile = async () => {
        setIsSwitching(true);
        try {
            const targetType = profileType === "SPACE_OWNER" ? "ADVERTISER" : "SPACE_OWNER";
            await switchProfile(targetType);
            onClose();
            const route =
                targetType === "SPACE_OWNER"
                    ? "/(protected)/(owner)/listings"
                    : "/(protected)/(advertiser)/discover";
            router.replace(route);
        } catch (error) {
            console.error("Failed to switch profile:", error);
        } finally {
            setIsSwitching(false);
        }
    };

    const handleLogout = async () => {
        await logout();
        onClose();
        router.replace("/(auth)/login");
    };

    // ... rest of component
}
```

## Navigation Flows

### First-Time User

```
index.tsx (splash)
    │
    ▼ (no token)
/(auth)/login
    │
    ▼ (login success, backend sets activeProfileType = null)
/(protected)/profile-select
    │
    ▼ (select profile, mutation sets activeProfileType)
/(protected)/(advertiser)/discover  OR  /(protected)/(owner)/listings
```

### Returning User

```
index.tsx (splash)
    │
    ▼ (has token, fetch me query)
/(protected)/(advertiser)/discover  OR  /(protected)/(owner)/listings
    (based on activeProfileType)
```

### Profile Switch

```
Current screen → Drawer → Switch Profile
    │
    ▼ (mutation: updateCurrentUser)
/(protected)/(owner)/listings  OR  /(protected)/(advertiser)/discover
    (navigates to new profile's home)
```

### Logout

```
Current screen → Drawer → Logout
    │
    ▼ (clear token, clear Apollo cache)
/(auth)/login
```

### Session Expired / Invalid Token

```
Any protected screen
    │
    ▼ (me query returns null)
/(auth)/login
```

## Migration Checklist

| Step | Description                                                                       |
|------|-----------------------------------------------------------------------------------|
| 1    | Create `src/contexts/SessionContext.tsx`                                          |
| 2    | Add GraphQL operations in `src/api/operations/session.ts`                         |
| 3    | Create `src/app/(protected)/_layout.tsx` with auth guard                          |
| 4    | Move `(advertiser)` and `(owner)` directories under `(protected)`                 |
| 5    | Create `src/app/(protected)/profile-select.tsx`                                   |
| 6    | Update `src/app/_layout.tsx` to use `SessionProvider`                             |
| 7    | Update `src/app/index.tsx` to use `useSession`                                    |
| 8    | Update `DrawerMenu` to use `switchProfile` and `logout` from session              |
| 9    | Update login/register screens to work with new session flow                       |
| 10   | Remove `src/contexts/RoleContext.tsx`                                             |
| 11   | Remove `src/contexts/AuthContext.tsx`                                             |
| 12   | Update `src/app/(auth)/role-select.tsx` to redirect to `profile-select` or remove |
| 13   | Update all imports from `useRole` and `useAuth` to `useSession`                   |
| 14   | Test all navigation flows                                                         |

## Files to Create

| File                                     | Purpose                        |
|------------------------------------------|--------------------------------|
| `src/contexts/SessionContext.tsx`        | Unified auth + profile context |
| `src/api/operations/session.ts`          | GraphQL operations for session |
| `src/app/(protected)/_layout.tsx`        | Auth guard layout              |
| `src/app/(protected)/profile-select.tsx` | Initial profile selection      |

## Files to Modify

| File                               | Changes                                                  |
|------------------------------------|----------------------------------------------------------|
| `src/app/_layout.tsx`              | Replace AuthProvider + RoleProvider with SessionProvider |
| `src/app/index.tsx`                | Use useSession instead of useRole                        |
| `src/components/ui/DrawerMenu.tsx` | Use switchProfile and logout from session                |
| `src/app/(auth)/login.tsx`         | Update post-login navigation                             |
| `src/app/(auth)/register.tsx`      | Update post-register navigation                          |

## Files to Delete

| File                             | Reason                                     |
|----------------------------------|--------------------------------------------|
| `src/contexts/RoleContext.tsx`   | Replaced by SessionContext                 |
| `src/contexts/AuthContext.tsx`   | Replaced by SessionContext                 |
| `src/app/(auth)/role-select.tsx` | Replaced by profile-select under protected |

## Files to Move

| From                     | To                                   |
|--------------------------|--------------------------------------|
| `src/app/(advertiser)/*` | `src/app/(protected)/(advertiser)/*` |
| `src/app/(owner)/*`      | `src/app/(protected)/(owner)/*`      |

## Backend Requirements

The backend must support:

1. **`me` query** returning `activeProfileType` field (already exists per web implementation)
2. **`updateCurrentUser` mutation** accepting `activeProfileType` input
3. **Token-based authentication** with cookies or bearer tokens
4. **New user handling**: `activeProfileType` should be `null` for users who haven't selected yet

## Testing Scenarios

| Scenario                   | Expected Behavior                                 |
|----------------------------|---------------------------------------------------|
| Fresh install, no token    | Show splash, redirect to login                    |
| Valid token, has profile   | Show splash, redirect to profile's home tab       |
| Valid token, no profile    | Show splash, redirect to profile-select           |
| Expired/invalid token      | me query fails, redirect to login                 |
| Switch profile             | Mutation succeeds, navigate to new profile's home |
| Logout                     | Clear token/cache, redirect to login              |
| Deep link to wrong profile | Guard redirects to correct profile's equivalent   |

## Comparison with Web Implementation

| Aspect            | Web                            | Mobile                           |
|-------------------|--------------------------------|----------------------------------|
| Route protection  | Layout-level GraphQL query     | Layout-level useSession hook     |
| Profile rendering | Parallel routes with slots     | Nested route groups with guard   |
| Profile switch    | Server action + revalidatePath | Mutation + router.replace        |
| Auth state        | Cookie + server query          | SecureStore token + Apollo query |
| Navigation        | Next.js redirect()             | Expo Router router.replace()     |

The key difference is that web uses server-side rendering with parallel routes to conditionally render slots, while
mobile uses client-side guards with route groups. Both derive profile type from the same backend source.