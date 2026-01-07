# Elaview Mobile Navigation

> Role-based navigation architecture using Expo Router v6

## Overview

The Elaview mobile app uses **role-based route groups** to provide different navigation experiences for Advertisers and Space Owners. Built with Expo Router v6's file-based routing.

## Architecture

```
Root
├── Welcome (index.tsx) - Checks for saved role
├── Auth Group
│   ├── Login
│   └── Role Select
├── Advertiser Group (5 tabs)
└── Owner Group (5 tabs)
```

## Navigation Flow

### First-Time User
```
Splash → Welcome → Login → Role Select → Advertiser/Owner Tabs
```

### Returning User
```
Splash → (checks saved role) → Advertiser/Owner Tabs (direct)
```

### Logout
```
Current Screen → Login (role cleared)
```

### Switch Role
```
Current Screen → Role Select → New Role Tabs
```

## File Structure

```
src/app/
├── _layout.tsx                    # Root: ThemeProvider + RoleProvider
├── index.tsx                      # Welcome screen with role routing
├── settings.tsx                   # ✅ Settings screen
├── help.tsx                       # ✅ Help center screen
├── (auth)/
│   ├── _layout.tsx
│   ├── login.tsx
│   ├── register.tsx
│   ├── role-select.tsx
│   └── forgot-password.tsx        # ✅ Password reset flow
├── (advertiser)/                  # Route group for advertisers
│   ├── _layout.tsx                # Tabs config + TopNavBar + DrawerMenu
│   ├── discover.tsx               # ✅ Tab 1: Map + search + space cards
│   ├── bookings.tsx               # ✅ Tab 2: Status filters + booking list
│   ├── messages.tsx               # ✅ Tab 3: Conversation list
│   ├── alerts.tsx                 # ✅ Tab 4: Notifications
│   └── profile.tsx                # ✅ Tab 5: User profile + settings
└── (owner)/                       # Route group for owners
    ├── _layout.tsx                # Tabs config + TopNavBar + DrawerMenu
    ├── listings.tsx               # ✅ Tab 1: Space grid + FAB
    ├── bookings.tsx               # ✅ Tab 2: Incoming requests + active
    ├── messages.tsx               # ✅ Tab 3: Conversation list
    ├── earnings.tsx               # ✅ Tab 4: Balance + transactions
    └── profile.tsx                # ✅ Tab 5: User profile + settings
```

## Route Groups

### Why Route Groups?

Expo Router v6 supports **route groups** (folders wrapped in parentheses) that don't affect the URL structure. We use two groups:

- `(advertiser)` - Dedicated tabs for advertisers
- `(owner)` - Dedicated tabs for space owners

**Benefits:**
- Clean separation of concerns
- Role-specific layouts
- Easy to add role-specific screens

### Advertiser Tabs

| Order | Icon | Label | Route | Status |
|-------|------|-------|-------|--------|
| 1 | search | Discover | `/(advertiser)/discover` | ✅ Complete |
| 2 | calendar-outline | Bookings | `/(advertiser)/bookings` | ✅ Complete |
| 3 | chatbubble-outline | Messages | `/(advertiser)/messages` | ✅ Complete |
| 4 | notifications-outline | Alerts | `/(advertiser)/alerts` | ✅ Complete |
| 5 | person-outline | Profile | `/(advertiser)/profile` | ✅ Complete |

### Owner Tabs

| Order | Icon | Label | Route | Status |
|-------|------|-------|-------|--------|
| 1 | location-outline | Listings | `/(owner)/listings` | ✅ Complete |
| 2 | calendar-outline | Bookings | `/(owner)/bookings` | ✅ Complete |
| 3 | chatbubble-outline | Messages | `/(owner)/messages` | ✅ Complete |
| 4 | wallet-outline | Earnings | `/(owner)/earnings` | ✅ Complete |
| 5 | person-outline | Profile | `/(owner)/profile` | ✅ Complete |

## Shared Components

### TopNavBar

Location: `src/components/ui/TopNavBar.tsx`

**Features:**
- ELAVIEW logo (left)
- Cart icon (advertisers only, right)
- Hamburger menu icon (right)
- Safe area insets for iOS notch

**Props:**
```typescript
interface TopNavBarProps {
  onMenuPress: () => void;
  onCartPress?: () => void;
}
```

### DrawerMenu

Location: `src/components/ui/DrawerMenu.tsx`

**Features:**
- Slide-in from right
- Settings
- Help
- Switch Role
- Logout

**Menu Items:**
| Icon | Label | Action |
|------|-------|--------|
| settings-outline | Settings | Navigate to settings (TODO) |
| help-circle-outline | Help | Navigate to help (TODO) |
| swap-horizontal-outline | Switch Role | Clear role → Role Select |
| log-out-outline | Logout | Clear role → Login |

## Context Providers

### RoleContext

Location: `src/contexts/RoleContext.tsx`

**Purpose:** Manages user role with persistent storage

**API:**
```typescript
interface RoleContextType {
  role: 'advertiser' | 'owner' | null;
  setRole: (role: UserRole) => Promise<void>;
  isLoading: boolean;
  clearRole: () => Promise<void>;
}

// Usage
const { role, setRole, isLoading, clearRole } = useRole();
```

**Storage:** `expo-secure-store` with key `user_role`

### ThemeContext

Location: `src/contexts/ThemeContext.tsx`

**Purpose:** Light/dark mode support

**API:**
```typescript
interface ThemeContextType {
  theme: Theme;
  themeMode: 'light' | 'dark' | 'system';
  isDark: boolean;
  setThemeMode: (mode: ThemeMode) => void;
}
```

## Navigation Patterns

### Navigating Between Tabs
```typescript
import { useRouter } from 'expo-router';

const router = useRouter();
router.push('/(advertiser)/alerts');
```

### Navigating to Role Selection
```typescript
import { useRole } from '@/contexts/RoleContext';
import { useRouter } from 'expo-router';

const { clearRole } = useRole();
const router = useRouter();

await clearRole();
router.replace('/(auth)/role-select');
```

### Conditional Navigation Based on Role
```typescript
const { role } = useRole();

if (role === 'advertiser') {
  router.push('/(advertiser)/discover');
} else {
  router.push('/(owner)/listings');
}
```

## Deep Linking

### Schema
```
elaview://
```

### Example Routes
```
elaview://advertiser/alerts
elaview://owner/earnings
elaview://auth/login
```

### Configuration (app.json)
```json
{
  "expo": {
    "scheme": "elaview",
    "ios": {
      "associatedDomains": ["applinks:elaview.com"]
    },
    "android": {
      "intentFilters": [
        {
          "action": "VIEW",
          "data": [
            {
              "scheme": "elaview"
            }
          ],
          "category": ["BROWSABLE", "DEFAULT"]
        }
      ]
    }
  }
}
```

## Future Enhancements

### Nested Stacks
When implementing booking flows, use nested stacks:

```
src/app/(advertiser)/
├── _layout.tsx
├── discover.tsx
├── bookings/
│   ├── _layout.tsx
│   ├── index.tsx
│   └── [id].tsx
```

### Modal Screens
For full-screen modals:

```typescript
// In _layout.tsx
<Stack>
  <Stack.Screen name="index" />
  <Stack.Screen
    name="modal"
    options={{ presentation: 'modal' }}
  />
</Stack>
```

### Tab Bar Badges
```typescript
<Tabs.Screen
  name="alerts"
  options={{
    tabBarBadge: unreadCount > 0 ? unreadCount : undefined,
  }}
/>
```

## Related Documentation

- [MOBILE-SCREENS.md](../../docs/MOBILE-SCREENS.md) - Screen specifications
- [PLAYBOOK.md](./PLAYBOOK.md) - Development roadmap
- [Expo Router Docs](https://docs.expo.dev/router/introduction/)
