// src/components/layout/AdvertiserLayout.tsx
"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { UserButton, useUser } from "@clerk/nextjs";
import {
  Bug,
  Building,
  ChevronRight,
  CreditCard,
  MapPin,
  Megaphone,
  MessageSquare,
  Search,
  Settings,
  ShoppingCart,
  X,
} from "lucide-react";
import { api } from "../../../../elaview-mvp/src/trpc/react";
import { toast } from "sonner";
import { NotificationCenter } from "../../../../elaview-mvp/src/components/notifications/NotificationCenter";
import { NotificationBadge } from "../../../../elaview-mvp/src/components/notifications/NotificationBadge";
import { BugReportModal } from "../../../../elaview-mvp/src/components/feedback/BugReportButton";
import { MobileTopNav } from "../../../../elaview-mvp/src/components/layout/MobileTopNav";
import { MobileBottomNav } from "../../../../elaview-mvp/src/components/layout/MobileBottomNav";
import { AdvertiserHamburgerDrawer } from "./AdvertiserHamburgerDrawer";
import type { NotificationType } from "@prisma/client";

interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  notificationTypes?: NotificationType[];
}

const navigation: NavItem[] = [
  { name: "Browse Spaces", href: "/browse", icon: MapPin },
  {
    name: "My Campaigns",
    href: "/campaigns",
    icon: Megaphone,
    notificationTypes: [
      "BOOKING_APPROVED",
      "BOOKING_REJECTED",
      "BOOKING_CANCELLED",
      "PROOF_UPLOADED",
      "PROOF_APPROVED",
      "PROOF_REJECTED",
      "PROOF_DISPUTED",
    ],
  },
  {
    name: "Messages",
    href: "/messages",
    icon: MessageSquare,
    notificationTypes: ["MESSAGE_RECEIVED"],
  },
  {
    name: "Billing",
    href: "/billing",
    icon: CreditCard,
    notificationTypes: ["PAYMENT_FAILED", "REFUND_PROCESSED"],
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
function TopNav({
  onBugReportClick,
  pathname,
}: {
  onBugReportClick: () => void;
  pathname: string;
}) {
  const { user } = useUser();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  // Get cart using existing router
  const { data: cartData } = api.cart.getCart.useQuery(undefined, {
    staleTime: 30000, // 30 seconds
    refetchOnWindowFocus: true,
  });

  const cartCount = cartData?.summary?.itemCount ?? 0;

  const isBrowsePage = pathname === "/browse";

  // Sync search query with URL params
  useEffect(() => {
    if (isBrowsePage && typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const urlQuery = params.get("q") ?? "";
      setSearchQuery(urlQuery);
    }
  }, [isBrowsePage, pathname]);

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);

    // Update URL with search query
    if (isBrowsePage) {
      const params = new URLSearchParams(window.location.search);
      if (value) {
        params.set("q", value);
      } else {
        params.delete("q");
      }
      const newUrl = `/browse${params.toString() ? `?${params.toString()}` : ""}`;
      router.push(newUrl, { scroll: false });
    }
  };

  // Handle search submit (Enter key)
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Already handled by onChange, but we can add focus blur
    (e.target as HTMLFormElement).querySelector("input")?.blur();
  };

  return (
    <div className="fixed top-0 right-0 left-0 z-40 h-16 border-b border-slate-800 bg-slate-900/95 backdrop-blur-sm">
      <div className="flex h-full items-center gap-4 px-4 lg:px-6">
        {/* Logo - Takes exact space of sidebar + padding for consistent alignment */}
        <Link href="/browse" className="flex items-center gap-2 md:w-[304px]">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600">
            <Megaphone className="h-4 w-4 text-white" />
          </div>
          <span className="hidden text-lg font-semibold tracking-tight text-white sm:inline">
            Elaview
          </span>
        </Link>

        {/* Search - Desktop only, Browse page only */}
        {isBrowsePage && (
          <div className="hidden max-w-xl flex-1 lg:block">
            <form onSubmit={handleSearchSubmit} className="relative">
              <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-slate-400" />
              <input
                type="search"
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="Search spaces by location..."
                className="w-full rounded-lg border border-slate-700 bg-slate-800 py-2 pr-4 pl-10 text-sm text-white placeholder:text-slate-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-600 focus:outline-none"
                aria-label="Search spaces"
              />
            </form>
          </div>
        )}

        {/* Right side actions */}
        <div className="ml-auto flex items-center gap-2">
          {/* Cart Icon */}
          <Link href="/cart">
            <button
              className="relative rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-800 hover:text-white"
              aria-label={`Shopping cart${cartCount > 0 ? ` with ${cartCount} items` : ""}`}
            >
              <ShoppingCart className="h-5 w-5" />
              {cartCount > 0 && (
                <div className="absolute -top-1 -right-1">
                  <NotificationBadge count={cartCount} size="sm" />
                </div>
              )}
            </button>
          </Link>

          {/* Report Bug/Issue Icon */}
          <button
            onClick={onBugReportClick}
            className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-800 hover:text-white"
            aria-label="Report an issue"
            title="Report an issue"
          >
            <Bug className="h-5 w-5" />
          </button>

          {/* Notifications - positioned relative to this container */}
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
              {user?.firstName ?? "Advertiser"}
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
      toast.success("Switched to Space Owner mode!");
      router.push("/spaces/dashboard");
    },
    onError: () => {
      toast.error("Failed to switch role. Please try again.");
    },
  });

  const handleRoleSwitch = async () => {
    try {
      await switchRoleMutation.mutateAsync({ role: "SPACE_OWNER" });
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
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600">
            <Megaphone className="h-5 w-5 text-white" />
          </div>
          <div>
            <span className="text-lg font-bold text-white">Elaview</span>
            <p className="text-xs font-medium text-slate-400">Advertiser</p>
          </div>
        </div>
      </div>

      {/* New Campaign CTA */}
      <div className="border-b border-slate-800 p-4">
        <Link href="/campaigns/new">
          <button className="w-full rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white shadow-lg shadow-blue-600/20 transition-colors hover:bg-blue-700">
            + New Campaign
          </button>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        {isLoading ? (
          // Loading skeleton
          <div className="space-y-1">
            {[...Array<number>(5)].map((_, i) => (
              <div key={i} className="h-10 animate-pulse rounded-lg bg-slate-800" />
            ))}
          </div>
        ) : (
          <div className="space-y-1">
            {navigation.map((item) => {
              const isActive =
                pathname === item.href ||
                (item.href !== "/browse" &&
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
                      ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
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
              ? `${otherRoleCount} notification${otherRoleCount !== 1 ? "s" : ""} in Space Owner mode`
              : undefined
          }
          className={`relative flex w-full items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium shadow-lg transition-all ${
            switchRoleMutation.isPending
              ? "cursor-not-allowed bg-slate-800 text-slate-500 shadow-none"
              : "bg-green-600 text-white shadow-green-600/20 hover:bg-green-700"
          }`}
        >
          <Building className="h-4 w-4" />
          {switchRoleMutation.isPending ? "Switching..." : "List Your Space"}
          {otherRoleCount > 0 && (
            <div className="absolute -top-1 -right-1">
              <NotificationBadge count={otherRoleCount} size="sm" variant="warning" />
            </div>
          )}
        </button>

        {/* Mode Indicator */}
        <div className="flex items-center justify-center gap-2 rounded-lg bg-slate-800/50 px-3 py-2">
          <div className="h-2 w-2 animate-pulse rounded-full bg-blue-500"></div>
          <p className="text-xs font-medium text-slate-300">Advertiser Mode</p>
        </div>
      </div>
    </div>
  );
}

// Main Layout Component
export function AdvertiserLayoutClient({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [hamburgerOpen, setHamburgerOpen] = useState(false);
  const [bugReportOpen, setBugReportOpen] = useState(false);
  const pathname = usePathname();
  const { user } = useUser();

  // Get cart data for mobile top nav
  const { data: cartData } = api.cart.getCart.useQuery(undefined, {
    staleTime: 30000,
    refetchOnWindowFocus: true,
  });
  const cartCount = cartData?.summary?.itemCount ?? 0;

  // Get notifications for mobile bottom nav
  const { data: notificationData } = api.notifications.getUnread.useQuery(undefined, {
    staleTime: 30000,
    refetchOnWindowFocus: true,
  });
  const notifications = notificationData?.notifications ?? [];

  // Determine if current page should be containerized (full height)
  const isContainerized =
    pathname === "/browse" ||
    pathname === "/cart" ||
    pathname.startsWith("/messages") ||
    pathname.startsWith("/campaigns") ||
    pathname.startsWith("/billing") ||
    pathname.startsWith("/settings");

  // Mobile bottom nav items (4 primary items)
  const mobileBottomNavItems = [
    { name: "Browse", href: "/browse", icon: MapPin },
    {
      name: "Campaigns",
      href: "/campaigns",
      icon: Megaphone,
      notificationTypes: [
        "BOOKING_APPROVED",
        "BOOKING_REJECTED",
        "BOOKING_CANCELLED",
        "PROOF_UPLOADED",
        "PROOF_APPROVED",
        "PROOF_REJECTED",
        "PROOF_DISPUTED",
      ] as NotificationType[],
    },
    {
      name: "Messages",
      href: "/messages",
      icon: MessageSquare,
      notificationTypes: ["MESSAGE_RECEIVED"] as NotificationType[],
    },
    { name: "Cart", href: "/cart", icon: ShoppingCart },
  ];

  // noinspection DuplicatedCode
  return (
    <div className="flex h-screen flex-col bg-slate-950">
      {/* Desktop Top Navigation */}
      <div className="hidden md:block">
        <TopNav onBugReportClick={() => setBugReportOpen(true)} pathname={pathname} />
      </div>

      {/* Mobile Top Navigation */}
      <MobileTopNav
        brandColor="bg-blue-600"
        icon={Megaphone}
        homeHref="/browse"
        userName={user?.firstName ?? undefined}
        roleLabel="Advertiser"
        showCart={true}
        cartCount={cartCount}
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
        accentColor="blue"
        notifications={notifications}
      />

      {/* Mobile Hamburger Drawer */}
      <AdvertiserHamburgerDrawer isOpen={hamburgerOpen} onClose={() => setHamburgerOpen(false)} />

      {/* Bug Report Modal */}
      <BugReportModal isOpen={bugReportOpen} onClose={() => setBugReportOpen(false)} />
    </div>
  );
}
