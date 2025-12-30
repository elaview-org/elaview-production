// src/components/layout/SpaceOwnerLayout.tsx
"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { UserButton, useUser } from "@clerk/nextjs";
import {
  Bug,
  Building,
  ChevronRight,
  ClipboardList,
  DollarSign,
  LayoutDashboard,
  MapPin,
  Megaphone,
  MessageSquare,
  Settings,
  X,
} from "lucide-react";
import { api } from "../../../../elaview-mvp/src/trpc/react";
import { toast } from "sonner";
import { NotificationCenter } from "../../../../elaview-mvp/src/components/notifications/NotificationCenter";
import { NotificationBadge } from "../../../../elaview-mvp/src/components/notifications/NotificationBadge";
import { BugReportModal } from "../../../../elaview-mvp/src/components/feedback/BugReportButton";
import { MobileTopNav } from "../../../../elaview-mvp/src/components/layout/MobileTopNav";
import { MobileBottomNav } from "../../../../elaview-mvp/src/components/layout/MobileBottomNav";
import { SpaceOwnerHamburgerDrawer } from "./SpaceOwnerHamburgerDrawer";
import type { NotificationType } from "@prisma/client";

interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  notificationTypes?: NotificationType[];
}

const navigation: NavItem[] = [
  { name: "Dashboard", href: "/spaces/dashboard", icon: LayoutDashboard },
  {
    name: "My Spaces",
    href: "/spaces",
    icon: MapPin,
    notificationTypes: ["SPACE_APPROVED", "SPACE_REJECTED", "SPACE_SUSPENDED", "SPACE_REACTIVATED"],
  },
  {
    name: "Campaign Requests",
    href: "/requests",
    icon: ClipboardList,
    notificationTypes: ["BOOKING_REQUEST"],
  },
  { name: "Active Campaigns", href: "/spaces/active-campaigns", icon: Megaphone },
  {
    name: "Earnings",
    href: "/earnings",
    icon: DollarSign,
    notificationTypes: ["PAYOUT_PROCESSED"],
  },
  {
    name: "Messages",
    href: "/messages",
    icon: MessageSquare,
    notificationTypes: ["MESSAGE_RECEIVED"],
  },
  { name: "Settings", href: "/settings", icon: Settings },
];

// Helper function to count notifications for a nav item
function getNotificationCount(
  notifications: Array<{ type: NotificationType }>,
  notificationTypes?: NotificationType[]
): number {
  if (!notificationTypes || notificationTypes.length === 0) return 0;
  return notifications.filter((n) => notificationTypes.includes(n.type)).length;
}

// Top Navigation Component
function TopNav({ onBugReportClick }: { onBugReportClick: () => void }) {
  const { user } = useUser();

  return (
    <div className="fixed top-0 right-0 left-0 z-40 h-16 border-b border-slate-800 bg-slate-900/95 backdrop-blur-sm">
      <div className="flex h-full items-center gap-4 px-4 lg:px-6">
        {/* Logo */}
        <Link href="/spaces/dashboard" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-600">
            <Building className="h-4 w-4 text-white" />
          </div>
          <span className="hidden text-lg font-semibold tracking-tight text-white sm:inline">
            Elaview
          </span>
        </Link>

        {/* Right side actions */}
        <div className="ml-auto flex items-center gap-2">
          {/* Report Bug/Issue Icon */}
          <button
            onClick={onBugReportClick}
            className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-800 hover:text-white"
            aria-label="Report an issue"
            title="Report an issue"
          >
            <Bug className="h-5 w-5" />
          </button>

          {/* Notifications */}
          <div className="relative">
            <NotificationCenter />
          </div>

          {/* User Profile */}
          <div className="flex items-center gap-2 border-l border-slate-700 pl-2">
            <UserButton
              appearance={{
                elements: {
                  avatarBox: "w-8 h-8",
                },
              }}
            />
            <span className="hidden text-sm font-medium text-white md:inline">
              {user?.firstName ?? "Space Owner"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

// Sidebar Content Component
function SidebarContent({ pathname, onItemClick }: { pathname: string; onItemClick?: () => void }) {
  const router = useRouter();
  const utils = api.useUtils();

  const { data: notificationData, isLoading } = api.notifications.getUnread.useQuery(undefined, {
    staleTime: 30000,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
  });

  const switchRoleMutation = api.user.switchRole.useMutation({
    onSuccess: async () => {
      await utils.notifications.getUnread.invalidate();
      await utils.user.getCurrentUser.invalidate();
      toast.success("Switched to Advertiser mode!");
      router.push("/browse");
    },
    onError: () => {
      toast.error("Failed to switch role. Please try again.");
    },
  });

  const handleRoleSwitch = async () => {
    try {
      await switchRoleMutation.mutateAsync({ role: "ADVERTISER" });
    } catch (error) {
      console.error("Role switch error:", error);
    }
  };

  const otherRoleCount = notificationData?.otherRoleCount ?? 0;
  const notifications = notificationData?.notifications ?? [];

  return (
    <div className="flex h-full flex-col">
      {/* Logo & Brand - Mobile Only */}
      <div className="flex h-16 items-center justify-between border-b border-slate-800 px-6 md:hidden">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-600">
            <Building className="h-5 w-5 text-white" />
          </div>
          <div>
            <span className="text-lg font-bold text-white">Elaview</span>
            <p className="text-xs font-medium text-slate-400">Space Owner</p>
          </div>
        </div>
      </div>

      {/* New Space CTA */}
      <div className="border-b border-slate-800 p-4">
        <Link href="/spaces/new">
          <button className="w-full rounded-lg bg-green-600 px-4 py-2.5 text-sm font-medium text-white shadow-lg shadow-green-600/20 transition-colors hover:bg-green-700">
            + List New Space
          </button>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        {isLoading ? (
          // Loading skeleton
          <div className="space-y-1">
            {Array.from({ length: 7 }).map((_, i) => (
              <div key={i} className="h-10 animate-pulse rounded-lg bg-slate-800" />
            ))}
          </div>
        ) : (
          <div className="space-y-1">
            {navigation.map((item) => {
              const isActive =
                pathname === item.href ||
                (item.href !== "/spaces" &&
                  item.href !== "/spaces/dashboard" &&
                  item.href !== "/messages" &&
                  item.href !== "/settings" &&
                  pathname.startsWith(item.href + "/"));

              const Icon = item.icon;
              const notificationCount = getNotificationCount(notifications, item.notificationTypes);

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={onItemClick}
                  className={`group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all ${
                    isActive
                      ? "bg-green-600 text-white shadow-lg shadow-green-600/20"
                      : "text-slate-400 hover:bg-slate-800 hover:text-white"
                  }`}
                >
                  <Icon
                    className={`h-5 w-5 transition-colors ${
                      isActive ? "text-white" : "text-slate-500 group-hover:text-slate-300"
                    }`}
                  />
                  <span className="flex-1">{item.name}</span>

                  {notificationCount > 0 && (
                    <NotificationBadge count={notificationCount} size="sm" />
                  )}

                  {isActive && !notificationCount && <ChevronRight className="h-4 w-4" />}
                </Link>
              );
            })}
          </div>
        )}
      </nav>

      {/* Role Switch & Footer */}
      <div className="space-y-3 border-t border-slate-800 p-4">
        {/* Role Switch Button */}
        <button
          onClick={handleRoleSwitch}
          disabled={switchRoleMutation.isPending}
          title={
            otherRoleCount > 0
              ? `${otherRoleCount} notification${otherRoleCount !== 1 ? "s" : ""} in Advertiser mode`
              : undefined
          }
          className={`relative flex w-full items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium shadow-lg transition-all ${
            switchRoleMutation.isPending
              ? "cursor-not-allowed bg-slate-800 text-slate-500 shadow-none"
              : "bg-blue-600 text-white shadow-blue-600/20 hover:bg-blue-700"
          }`}
        >
          <Megaphone className="h-4 w-4" />
          {switchRoleMutation.isPending ? "Switching..." : "Browse Spaces"}
          {otherRoleCount > 0 && (
            <div className="absolute -top-1 -right-1">
              <NotificationBadge count={otherRoleCount} size="sm" variant="warning" />
            </div>
          )}
        </button>

        {/* Mode Indicator */}
        <div className="flex items-center justify-center gap-2 rounded-lg bg-slate-800/50 px-3 py-2">
          <div className="h-2 w-2 animate-pulse rounded-full bg-green-500"></div>
          <p className="text-xs font-medium text-slate-300">Space Owner Mode</p>
        </div>
      </div>
    </div>
  );
}

// Main Layout Component
export function SpaceOwnerLayoutClient({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [hamburgerOpen, setHamburgerOpen] = useState(false);
  const [bugReportOpen, setBugReportOpen] = useState(false);
  const pathname = usePathname();
  const { user } = useUser();

  // Get notifications for mobile bottom nav
  const { data: notificationData } = api.notifications.getUnread.useQuery(undefined, {
    staleTime: 30000,
    refetchOnWindowFocus: true,
  });
  const notifications = notificationData?.notifications ?? [];

  // Determine if current page should be containerized (full height)
  const isContainerized =
    pathname === "/spaces" ||
    pathname === "/spaces/new" ||
    pathname.startsWith("/messages") ||
    pathname.startsWith("/settings") ||
    pathname.startsWith("/spaces/dashboard") ||
    pathname.startsWith("/spaces/active-campaigns") ||
    pathname.startsWith("/earnings") ||
    pathname.startsWith("/requests") ||
    // Match /spaces/{id} (detail view) and /spaces/{id}/edit
    (pathname.startsWith("/spaces/") &&
      (pathname.includes("/edit") || /\/spaces\/[^/]+$/.test(pathname)));

  // Mobile bottom nav items (5 primary items)
  const mobileBottomNavItems = [
    { name: "Dashboard", href: "/spaces/dashboard", icon: LayoutDashboard },
    {
      name: "Spaces",
      href: "/spaces",
      icon: MapPin,
      notificationTypes: [
        "SPACE_APPROVED",
        "SPACE_REJECTED",
        "SPACE_SUSPENDED",
        "SPACE_REACTIVATED",
      ] as NotificationType[],
    },
    {
      name: "Requests",
      href: "/requests",
      icon: ClipboardList,
      notificationTypes: ["BOOKING_REQUEST"] as NotificationType[],
    },
    {
      name: "Messages",
      href: "/messages",
      icon: MessageSquare,
      notificationTypes: ["MESSAGE_RECEIVED"] as NotificationType[],
    },
    {
      name: "Earnings",
      href: "/earnings",
      icon: DollarSign,
      notificationTypes: ["PAYOUT_PROCESSED"] as NotificationType[],
    },
  ];

  return (
    <div className="flex h-screen flex-col bg-slate-950">
      {/* Desktop Top Navigation */}
      <div className="hidden md:block">
        <TopNav onBugReportClick={() => setBugReportOpen(true)} />
      </div>

      {/* Mobile Top Navigation */}
      <MobileTopNav
        brandColor="bg-green-600"
        icon={Building}
        homeHref="/spaces/dashboard"
        userName={user?.firstName ?? undefined}
        roleLabel="Space Owner"
        showCart={false}
        onMenuClick={() => setHamburgerOpen(true)}
      />

      {/* Content Area with Sidebar */}
      <div className="flex flex-1 overflow-hidden pt-16">
        {/* Mobile menu backdrop */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-40 bg-slate-900/80 backdrop-blur-sm md:hidden"
            onClick={() => setSidebarOpen(false)}
            aria-hidden="true"
          />
        )}

        {/* Mobile sidebar (legacy - keep for now, hidden) */}
        <div
          className={`fixed inset-y-0 top-16 left-0 z-50 w-72 transform transition-transform duration-300 ease-in-out md:hidden ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex h-full flex-col border-r border-slate-800 bg-slate-900 shadow-2xl">
            <div className="absolute top-4 right-4 z-10">
              <button
                onClick={() => setSidebarOpen(false)}
                className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-800 hover:text-white"
                aria-label="Close navigation menu"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <SidebarContent pathname={pathname} onItemClick={() => setSidebarOpen(false)} />
          </div>
        </div>

        {/* Desktop sidebar with floating card */}
        <div className="hidden bg-slate-950 p-4 md:flex md:w-72 md:flex-col">
          <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl border border-slate-800 bg-slate-900 shadow-xl">
            <SidebarContent pathname={pathname} />
          </div>
        </div>

        {/* Main content area */}
        <main
          className={`flex-1 bg-slate-950 ${
            isContainerized ? "overflow-hidden" : "overflow-y-auto"
          } pb-16 md:pb-0`}
        >
          <div
            className={isContainerized ? "h-full" : "mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8"}
          >
            {children}
          </div>
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav
        items={mobileBottomNavItems}
        accentColor="green"
        notifications={notifications}
      />

      {/* Mobile Hamburger Drawer */}
      <SpaceOwnerHamburgerDrawer isOpen={hamburgerOpen} onClose={() => setHamburgerOpen(false)} />

      {/* Bug Report Modal */}
      <BugReportModal isOpen={bugReportOpen} onClose={() => setBugReportOpen(false)} />
    </div>
  );
}
