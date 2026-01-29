# Migrate Shared Dashboard Routes to Children

Move shared routes (messages, notifications, settings) out of parallel slots into direct `children` of `(dashboard)/`. This eliminates page-level duplication entirely for shared routes.

## How It Works

Next.js layouts receive both `children` (implicit slot) and named slot props (`admin`, `spaceOwner`, etc.). By placing shared routes as direct children of `(dashboard)/`, they populate the `children` prop. `RoleBasedView` checks the pathname to decide whether to render `children` (shared route) or the active slot (role-specific route).

When navigating to `/messages` (shared):
- `children` = messages page (matches `app/(dashboard)/messages/page.tsx`)
- Named slots fall back to their `default.ts` → `notFound()` (silently handled by Next.js)
- `RoleBasedView` detects shared route, renders `children`

When navigating to `/listings` (role-specific):
- `children` = null (from `app/(dashboard)/default.tsx`)
- Active slot renders its page
- `RoleBasedView` renders the active slot

---

## Phase 0: Routing Infrastructure

### 0.1 Create `app/(dashboard)/default.tsx`

Children slot fallback for role-specific routes. Returns `null` so the children slot doesn't throw when no children route matches:

```tsx
export default function Default() {
  return null;
}
```

### 0.2 Update `role-based-view.tsx`

Add `"use client"` directive (needed for `usePathname`). Add `children` prop and pathname-based routing:

```tsx
"use client";

import { usePathname } from "next/navigation";

const SHARED_ROUTES = new Set(["messages", "notifications", "settings"]);

export default function RoleBasedView({
  data, children, admin, marketing, spaceOwner, advertiser
}: Props) {
  const { role, activeProfileType } = getFragmentData(RoleBasedView_UserFragment, data);
  const pathname = usePathname();
  const firstSegment = pathname.split("/").filter(Boolean)[0];

  if (SHARED_ROUTES.has(firstSegment)) {
    return children;
  }

  switch (role) {
    case UserRole.Admin: return admin;
    case UserRole.Marketing: return marketing;
    case UserRole.User:
      return activeProfileType === ProfileType.SpaceOwner
        ? spaceOwner : advertiser;
  }
}
```

### 0.3 Update `layout.tsx`

Stop spreading `...props` (avoids passing non-serializable `params` Promise to the now-client `RoleBasedView`). Pass props explicitly:

```tsx
<RoleBasedView
  data={data.me}
  admin={props.admin}
  marketing={props.marketing}
  spaceOwner={props.spaceOwner}
  advertiser={props.advertiser}
>
  {props.children}
</RoleBasedView>
```

**Files:** 1 created (`default.tsx`), 2 modified (`role-based-view.tsx`, `layout.tsx`)

---

## Phase 1: Messages

### 1.1 Create `app/(dashboard)/messages/page.tsx`

```tsx
import getConversationsQuery from "@/features/conversations/messages-queries";
import MessagesClient from "@/features/conversations/components/messages-client";

export default async function Page() {
  const { conversations } = await getConversationsQuery();
  return <MessagesClient conversations={conversations} />;
}
```

### 1.2 Create `app/(dashboard)/messages/[id]/page.tsx`

Same pattern as the existing `@advertiser/messages/[id]/page.tsx`, importing from `features/messages/`.

### 1.3 Delete slot-level messages routes

- Delete `@advertiser/messages/` (entire directory)
- Delete `@spaceOwner/messages/` (entire directory)

**Files:** 2 created, 2 directories deleted

---

## Phase 2: Notifications

### 2.1 Create `app/(dashboard)/notifications/page.tsx`

```tsx
import getNotificationsQuery from "@/features/notifications/notifications-queries";
import NotificationsContent from "@/features/notifications/components/notifications-content";

export default async function NotificationsPage() {
  const { notifications } = await getNotificationsQuery();
  return <NotificationsContent initialNotifications={notifications} />;
}
```

### 2.2 Delete slot-level notifications routes

- Delete `@advertiser/notifications/` (entire directory)
- Delete `@spaceOwner/notifications/` (entire directory)

**Files:** 1 created, 2 directories deleted

---

## Phase 3: Settings

Settings has role-specific content (different business forms, payout section for spaceOwner). The shared children page handles this via role-aware branching.

### 3.1 New structure

```
app/(dashboard)/settings/
  page.tsx                         # Queries user + both profiles, renders SettingsContent
  settings-content.tsx             # Role-aware: renders shared + role-specific forms
  profile-settings-form.tsx        # Shared (visibilityLabel prop)
  account-settings-form.tsx        # Shared (generic user type)
  notification-settings-form.tsx   # Shared (notificationTypes + labels props)
  space-owner-business-form.tsx    # From @spaceOwner (role-specific)
  advertiser-business-form.tsx     # From @advertiser (role-specific)
  payout-settings-form.tsx         # From @spaceOwner only
  constants.ts                     # Merged from both slots
  settings.actions.ts              # Shared updateProfileAction + both updateBusinessInfoActions
  loading.tsx                      # Skeleton
```

### 3.2 `page.tsx`

Single query fetching both profile types (one will be null based on user's role):

```tsx
export default async function Page() {
  const { data, error } = await api.query({
    query: graphql(`
      query Settings {
        me {
          id email name avatar phone createdAt lastLoginAt activeProfileType
          spaceOwnerProfile {
            id businessName businessType payoutSchedule onboardingComplete
            stripeAccountId stripeAccountStatus
          }
          advertiserProfile {
            id companyName industry website onboardingComplete
          }
        }
        myNotificationPreferences {
          id notificationType inAppEnabled emailEnabled pushEnabled
        }
      }
    `),
  });

  if (error || !data?.me) redirect("/logout");

  return (
    <SettingsContent
      user={data.me}
      notificationPreferences={data.myNotificationPreferences}
    />
  );
}
```

### 3.3 `settings-content.tsx`

Role-aware rendering. Derives profile type from `user.activeProfileType`:

```tsx
"use client";

export default function SettingsContent({ user, notificationPreferences }: Props) {
  const isSpaceOwner = user.activeProfileType === ProfileType.SpaceOwner;

  return (
    <Accordion ...>
      <SettingsSection value="profile" ...>
        <ProfileSettingsForm
          user={user}
          visibilityLabel={isSpaceOwner ? "advertisers" : "space owners"}
        />
      </SettingsSection>

      <SettingsSection value="business" ...>
        {isSpaceOwner
          ? <SpaceOwnerBusinessForm user={user} />
          : <AdvertiserBusinessForm user={user} />}
      </SettingsSection>

      {isSpaceOwner && (
        <SettingsSection value="payout" ...>
          <PayoutSettingsForm user={user} />
        </SettingsSection>
      )}

      <SettingsSection value="notifications" ...>
        <NotificationSettingsForm
          preferences={notificationPreferences}
          notificationTypes={isSpaceOwner ? SPACE_OWNER_NOTIFICATIONS : ADVERTISER_NOTIFICATIONS}
          labels={NOTIFICATION_LABELS}
        />
      </SettingsSection>

      <SettingsSection value="account" ...>
        <AccountSettingsForm user={user} />
      </SettingsSection>
    </Accordion>
  );
}
```

### 3.4 Shared form types

Replace role-specific GQL query types (`SpaceOwnerSettingsQuery`, `AdvertiserSettingsQuery`) with plain interfaces that both query results satisfy:

**profile-settings-form.tsx:**
```tsx
type SettingsUser = { name: string | null; email: string | null; phone: string | null; avatar: string | null };
```

**account-settings-form.tsx:**
```tsx
type SettingsUser = { createdAt: unknown; lastLoginAt: unknown; activeProfileType: string | null | undefined };
```

**notification-settings-form.tsx:**
```tsx
type Props = {
  preferences: { notificationType: NotificationType; inAppEnabled: boolean; emailEnabled: boolean; pushEnabled: boolean }[];
  notificationTypes: readonly NotificationType[];
  labels: Partial<Record<NotificationType, string>>;
};
```

### 3.5 `constants.ts`

Merge both slots' constants into one file:

- `BUSINESS_TYPES` (from spaceOwner)
- `PAYOUT_SCHEDULE_LABELS` (from spaceOwner)
- `INDUSTRY_OPTIONS` (from advertiser)
- `NOTIFICATION_LABELS` (merged, union of both)
- `SPACE_OWNER_NOTIFICATIONS` (from spaceOwner)
- `ADVERTISER_NOTIFICATIONS` (from advertiser)

### 3.6 `settings.actions.ts`

Merge all actions:

- `updateProfileAction` — shared (identical logic, calls `updateCurrentUser`)
- `updateSpaceOwnerBusinessAction` — from @spaceOwner (calls `updateSpaceOwnerProfile`)
- `updateAdvertiserBusinessAction` — from @advertiser (calls `updateAdvertiserProfile`)

Single `getCurrentUser` query fetching both profile IDs:

```tsx
async function getCurrentUser() {
  const { data } = await api.query({
    query: graphql(`
      query GetUserForSettings {
        me {
          id
          avatar
          spaceOwnerProfile { id }
          advertiserProfile { id }
        }
      }
    `),
  });
  return data?.me ?? null;
}
```

### 3.7 Delete slot-level settings routes

- Delete `@advertiser/settings/` (entire directory)
- Delete `@spaceOwner/settings/` (entire directory)
- Delete `@admin/settings/` (entire directory)
- Delete `@marketing/settings/` (entire directory)

**Files:** ~10 created (new settings directory), 4 slot directories deleted

---

## Phase 4: Profile — No extraction

Profile stays in parallel slots. The implementations are fundamentally different:

- **@spaceOwner**: Real GraphQL data, reviews section, hosting stats
- **@advertiser**: Mock data, campaigns section, advertising stats
- **@admin / @marketing**: UnderConstruction stubs

The shared `ProfileCardBase` already exists in `components/composed/profile-card.tsx`. No further extraction needed.

---

## Summary

```
app/(dashboard)/
  default.tsx                    # NEW — children slot fallback (returns null)
  role-based-view.tsx            # MODIFIED — client component, pathname-based routing
  layout.tsx                     # MODIFIED — explicit prop passing
  messages/                      # NEW — shared route
    page.tsx
    [id]/page.tsx
  notifications/                 # NEW — shared route
    page.tsx
  settings/                      # NEW — shared route (role-aware)
    page.tsx
    settings-content.tsx
    profile-settings-form.tsx
    account-settings-form.tsx
    notification-settings-form.tsx
    space-owner-business-form.tsx
    advertiser-business-form.tsx
    payout-settings-form.tsx
    constants.ts
    settings.actions.ts
    loading.tsx
  @admin/settings/               # DELETED
  @marketing/settings/           # DELETED
  @spaceOwner/messages/          # DELETED
  @spaceOwner/notifications/     # DELETED
  @spaceOwner/settings/          # DELETED
  @advertiser/messages/          # DELETED
  @advertiser/notifications/     # DELETED
  @advertiser/settings/          # DELETED
```

---

## Verification

After each phase:

```bash
bun typecheck
bun lint
bun format
```

Manual testing:
- Navigate to `/messages`, `/messages/[id]` as both spaceOwner and advertiser
- Navigate to `/notifications` as both roles
- Navigate to `/settings` as both roles — verify correct business form and payout section visibility
- Navigate to role-specific routes (`/listings`, `/campaigns`) — verify they still work
- Navigate to invalid route — verify 404 behavior
- Test profile update, business info update actions from settings
- Test hard refresh (browser reload) on shared routes