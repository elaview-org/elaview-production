// src/components/layout/MobileBottomNav.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NotificationBadge } from "../notifications/NotificationBadge";
import type { NotificationType } from "@prisma/client";

interface BottomNavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  notificationTypes?: NotificationType[];
}

interface MobileBottomNavProps {
  /** Navigation items to display (max 5 recommended) */
  items: BottomNavItem[];
  /** Active/brand color (e.g., "blue", "green") */
  accentColor: "blue" | "green";
  /** Unread notifications for badge display */
  notifications?: Array<{ type: NotificationType }>;
}

// Helper function to count notifications for a nav item
function getNotificationCount(
  notifications: Array<{ type: NotificationType }>,
  notificationTypes?: NotificationType[]
): number {
  if (!notificationTypes || notificationTypes.length === 0) return 0;
  return notifications.filter(n => notificationTypes.includes(n.type)).length;
}

/**
 * Mobile Bottom Navigation Component
 *
 * Fixed bottom navigation bar for mobile devices showing 4-5 primary nav items.
 * Features:
 * - Active state indication
 * - Notification badges
 * - Touch-friendly sizing (min 44px tap targets)
 * - Safe area padding for notched devices
 *
 * Only visible on mobile (<768px)
 */
export function MobileBottomNav({
  items,
  accentColor,
  notifications = [],
}: MobileBottomNavProps) {
  const pathname = usePathname();

  // Color mappings
  const colorClasses = {
    blue: {
      active: "bg-blue-600 text-white",
      badge: "default" as const,
    },
    green: {
      active: "bg-green-600 text-white",
      badge: "default" as const,
    },
  };

  const colors = colorClasses[accentColor];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-[70] h-16 border-t border-slate-800 bg-slate-900/95 backdrop-blur-sm pb-safe">
      <div className="flex h-full items-center justify-around px-2">
        {items.map((item) => {
          const Icon = item.icon;

          // Smart active state detection
          // Exclude specific routes from prefix matching to prevent false positives
          // e.g., /spaces/dashboard should not activate /spaces
          const shouldCheckPrefix =
            item.href !== '/browse' &&
            item.href !== '/spaces' &&
            item.href !== '/spaces/dashboard' &&
            item.href !== '/messages' &&
            item.href !== '/settings' &&
            item.href !== '/cart' &&
            item.href !== '/earnings' &&
            item.href !== '/requests';

          const isActive =
            pathname === item.href ||
            (shouldCheckPrefix && item.href !== "/" && pathname.startsWith(item.href + "/"));

          const notificationCount = getNotificationCount(notifications, item.notificationTypes);

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`relative flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-lg min-w-[60px] transition-all ${
                isActive
                  ? colors.active
                  : "text-slate-400 hover:text-white hover:bg-slate-800"
              }`}
            >
              <div className="relative">
                <Icon className={`h-5 w-5 ${isActive ? "text-white" : ""}`} />
                {notificationCount > 0 && (
                  <div className="absolute -top-2 -right-2">
                    <NotificationBadge count={notificationCount} size="sm" variant={colors.badge} />
                  </div>
                )}
              </div>
              <span className={`text-xs font-medium ${isActive ? "text-white" : ""}`}>
                {item.name}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
