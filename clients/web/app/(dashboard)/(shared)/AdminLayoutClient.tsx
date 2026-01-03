// src/app/(dashboard)/@admin/AdminLayoutClient.tsx
"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import {
  Activity,
  AlertCircle,
  AlertTriangle,
  BarChart3,
  Beaker,
  ChevronRight,
  DollarSign,
  FileCheck,
  FileText,
  Inbox,
  LayoutDashboard,
  Mail,
  MapPin,
  Menu,
  MessageSquare,
  Settings,
  Shield,
  Target,
  TrendingUp,
  UserCheck,
  Users,
  X,
  Zap,
} from "lucide-react";
// import { NotificationCenter } from "../../../../elaview-mvp/src/components/notifications/NotificationCenter";
// import { NotificationBadge } from "../../../../elaview-mvp/src/components/notifications/NotificationBadge";
import { AdminModeToggle } from "./AdminModeToggle";
import useUnreadNotifications from "@/shared/hooks/api/getters/useUnreadNotifications/useUnreadNotifications";
// import { useAdminMode } from "../../../../elaview-mvp/src/contexts/AdminModeContext";
// import { api } from "../../../../elaview-mvp/src/trpc/react";
// import type { NotificationType } from "@prisma/client";
type NotificationType = any;
interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  notificationTypes?: NotificationType[];
}

const navigation: NavItem[] = [
  { name: "Dashboard", href: "/overview", icon: LayoutDashboard },
  {
    name: "Customers",
    href: "/payment-flows",
    icon: UserCheck,
    notificationTypes: [
      "PAYMENT_RECEIVED",
      "PAYMENT_FAILED",
      "BOOKING_REQUEST",
      "DISPUTE_FILED",
    ],
  },
  {
    name: "Financial",
    href: "/finance",
    icon: DollarSign,
    notificationTypes: ["PAYOUT_PROCESSED", "PAYMENT_RECEIVED"],
  },
  {
    name: "Disputes",
    href: "/disputes",
    icon: AlertTriangle,
    notificationTypes: ["DISPUTE_FILED", "PROOF_DISPUTED"],
  },
  {
    name: "Bug Reports",
    href: "/bug-reports",
    icon: AlertCircle,
  },
  {
    name: "Fraud",
    href: "/fraud",
    icon: Shield,
    notificationTypes: ["PAYMENT_FAILED"],
  },
  {
    name: "Analytics",
    href: "/analytics",
    icon: TrendingUp,
  },
  {
    name: "Users",
    href: "/users",
    icon: Users,
  },
  {
    name: "Spaces",
    href: "/spaces",
    icon: MapPin,
    notificationTypes: ["SPACE_APPROVED", "SPACE_REJECTED", "SPACE_SUSPENDED"],
  },
  {
    name: "System",
    href: "/system",
    icon: Activity,
    notificationTypes: ["SYSTEM_UPDATE"],
  },
  {
    name: "Testing",
    href: "/testing",
    icon: Beaker,
  },
  {
    name: "Verification",
    href: "/verification-review",
    icon: FileCheck,
    notificationTypes: ["PROOF_UPLOADED", "PROOF_APPROVED", "PROOF_REJECTED"],
  },
  {
    name: "Messages",
    href: "/messages",
    icon: MessageSquare,
    notificationTypes: ["MESSAGE_RECEIVED"],
  },
  {
    name: "Settings",
    href: "/settings",
    icon: Settings,
  },
];

const marketingNavigation: NavItem[] = [
  { name: "Overview", href: "/overview", icon: LayoutDashboard },
  { name: "Inbound Leads", href: "/inbound", icon: Inbox },
  { name: "Outbound CRM", href: "/outbound", icon: Target },
  { name: "Campaigns", href: "/campaigns", icon: Mail },
  { name: "Audiences", href: "/audiences", icon: UserCheck },
  { name: "Templates", href: "/templates", icon: FileText },
  { name: "Analytics", href: "/analytics", icon: BarChart3 },
  { name: "Automation", href: "/automation", icon: Zap },
  { name: "Settings", href: "/marketingsettings", icon: Settings },
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
function TopNav({ mode }: { mode: string }) {
  const bgColor = mode === "marketing" ? "bg-purple-600" : "bg-red-600";
  const Icon = mode === "marketing" ? Mail : Shield;

  return (
    <div className="fixed top-0 right-0 left-0 z-40 h-16 border-b border-slate-800 bg-slate-900/95 backdrop-blur-sm">
      <div className="flex h-full items-center gap-4 px-4 lg:px-6">
        {/* Logo */}
        <Link href="/public" className="flex items-center gap-2 md:w-[304px]">
          <div
            className={`h-8 w-8 ${bgColor} flex items-center justify-center rounded-lg`}
          >
            <Icon className="h-4 w-4 text-white" />
          </div>
          <span className="hidden text-lg font-semibold tracking-tight text-white sm:inline">
            Elaview
          </span>
        </Link>

        {/* Right side actions */}
        <div className="ml-auto flex items-center gap-2">
          {/* Admin Mode Toggle */}
          <AdminModeToggle />

          {/* Notifications */}
          {/* <div className="relative">
            <NotificationCenter />
          </div> */}

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
              {mode === "marketing" ? "Marketing" : "Admin"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

// Sidebar Content Component
function SidebarContent({
  navigation,
  pathname,
  accentColor,
  bgColor,
  mode,
  onItemClick,
}: {
  navigation: NavItem[];
  pathname: string;
  accentColor: string;
  bgColor: string;
  mode: string;
  onItemClick?: () => void;
}) {
  const router = useRouter();
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const navRef = useRef<HTMLElement>(null);

  const { notificationData, isLoading } = useUnreadNotifications(
    undefined,

    {
      staleTime: 30000,
      refetchOnWindowFocus: true,
      refetchOnMount: true,
    }
  );
  
  const notifications = notificationData?.notifications ?? [];

  // Get current active index
  const currentIndex = navigation.findIndex((item) => {
    return (
      // Exact match
      pathname === item.href ||
      // Nested routes (except overview to avoid matching everything)
      (item.href !== "/overview" && pathname.startsWith(item.href + "/"))
    );
  });

  // Set initial focus to current page
  useEffect(() => {
    if (currentIndex !== -1 && focusedIndex === -1) {
      setFocusedIndex(currentIndex);
    }
  }, [currentIndex, focusedIndex]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeElement = document.activeElement;
      const isInputFocused =
        activeElement?.tagName === "INPUT" ||
        activeElement?.tagName === "TEXTAREA" ||
        activeElement?.getAttribute("contenteditable") === "true";

      if (isInputFocused) return;

      if (e.key === "ArrowDown") {
        e.preventDefault();
        setFocusedIndex((prev) => {
          const next = prev + 1;
          return next >= navigation.length ? 0 : next;
        });
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setFocusedIndex((prev) => {
          const next = prev - 1;
          return next < 0 ? navigation.length - 1 : next;
        });
      } else if (e.key === "Enter" && focusedIndex >= 0) {
        e.preventDefault();
        const targetNav = navigation[focusedIndex];
        if (targetNav) {
          router.push(targetNav.href);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [focusedIndex, navigation, router]);

  // Scroll focused item into view
  useEffect(() => {
    if (focusedIndex >= 0 && navRef.current) {
      const focusedElement = navRef.current.querySelector(
        `[data-nav-index="${focusedIndex}"]`
      );
      if (focusedElement) {
        focusedElement.scrollIntoView({ block: "nearest", behavior: "smooth" });
      }
    }
  }, [focusedIndex]);

  return (
    <div className="flex h-full flex-col">
      {/* Logo & Brand - Mobile Only */}
      <div className="flex h-16 items-center justify-between border-b border-slate-800 px-6 md:hidden">
        <div className="flex items-center gap-3">
          <div
            className={`flex h-10 w-10 items-center justify-center rounded-lg ${bgColor}`}
          >
            {mode === "marketing" ? (
              <Mail className="h-5 w-5 text-white" />
            ) : (
              <Shield className="h-5 w-5 text-white" />
            )}
          </div>
          <div>
            <span className="text-lg font-bold text-white">Elaview</span>
            <p className="text-xs font-medium text-slate-400">
              {mode === "marketing" ? "Marketing" : "Admin"}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav ref={navRef} className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        {isLoading ? (
          // Loading skeleton
          <div className="space-y-1">
            {[...Array<NavItem>(navigation.length)].map((_, i) => (
              <div
                key={i}
                className="h-10 animate-pulse rounded-lg bg-slate-800"
              />
            ))}
          </div>
        ) : (
          <div className="space-y-1">
            {navigation.map((item, index) => {
              const isActive =
                pathname === item.href ||
                (item.href !== "/overview" &&
                  pathname.startsWith(item.href + "/"));

              const isFocused = focusedIndex === index;
              const Icon = item.icon;
              const notificationCount = getNotificationCount(
                notifications,
                item.notificationTypes
              );

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={onItemClick}
                  data-nav-index={index}
                  onMouseEnter={() => setFocusedIndex(index)}
                  className={`group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all ${
                    isActive
                      ? `${bgColor} text-white shadow-lg shadow-${accentColor}-600/20`
                      : isFocused
                      ? "bg-slate-800 text-white ring-2 ring-slate-700"
                      : "text-slate-400 hover:bg-slate-800 hover:text-white"
                  }`}
                >
                  <Icon
                    className={`h-5 w-5 transition-colors ${
                      isActive
                        ? "text-white"
                        : isFocused
                        ? "text-white"
                        : "text-slate-500 group-hover:text-slate-300"
                    }`}
                  />
                  <span className="flex-1">{item.name}</span>

                  {/* {notificationCount > 0 && (
                    <NotificationBadge count={notificationCount} size="sm" />
                  )} */}

                  {isActive && !notificationCount && (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </Link>
              );
            })}
          </div>
        )}
      </nav>

      {/* Keyboard shortcut hint & Mode Indicator */}
      <div className="space-y-3 border-t border-slate-800 p-4">
        <div className="flex items-center justify-center gap-2 rounded-lg bg-slate-800/50 px-3 py-2">
          <div
            className={`h-2 w-2 rounded-full ${
              mode === "marketing" ? "bg-purple-500" : "bg-red-500"
            } animate-pulse`}
          ></div>
          <p className="text-xs font-medium text-slate-300">
            {mode === "marketing" ? "Marketing Mode" : "Admin Mode"}
          </p>
        </div>

        <div className="px-2">
          <p className="text-center text-xs text-slate-500">
            <kbd className="rounded bg-slate-800 px-1.5 py-0.5 text-slate-400">
              ↑
            </kbd>{" "}
            <kbd className="rounded bg-slate-800 px-1.5 py-0.5 text-slate-400">
              ↓
            </kbd>{" "}
            navigate •{" "}
            <kbd className="rounded bg-slate-800 px-1.5 py-0.5 text-slate-400">
              Enter
            </kbd>{" "}
            select
          </p>
        </div>
      </div>
    </div>
  );
}

// Main Client Layout Component
export function AdminLayoutClient({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  // const { mode } = useAdminMode();
  const mode = "marketing";
  // Choose navigation based on mode
  const currentNavigation =
    mode === "marketing" ? marketingNavigation : navigation;
  const accentColor = mode === "marketing" ? "purple" : "red";
  const bgColor = mode === "marketing" ? "bg-purple-600" : "bg-red-600";

  // Determine if current page should be containerized (full height)
  const containerizedPages = [
    // Sub-Batch 1A: Placeholder pages
    "/analytics",
    "/audiences",
    "/automation",
    "/settings",
    "/templates",
    "/verification-review",
    "/campaigns",

    // Sub-Batch 1B: Simple dashboards
    "/system",
    "/fraud",
    "/users",
    "/analytics",
    "/marketing",

    // Sub-Batch 2A: MEDIUM complexity (NEW - ADDED)
    "/refunds",
    "/finance",
    "/test-booking",
    "/inbound",
    "/outbound",
    "/campaigns/new",
    "/bug-reports",

    // Main dashboard (PENDING - will add after containerizing)
    "/overview",
  ];

  const isContainerized = containerizedPages.some(
    (page) => pathname === page || pathname.startsWith(page + "/")
  );

  return (
    <div className="flex h-screen flex-col bg-slate-950">
      {/* Top Navigation */}
      <TopNav mode={mode} />

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

        {/* Mobile menu button */}
        <button
          onClick={() => setSidebarOpen(true)}
          className={`fixed right-4 bottom-4 z-30 p-3 md:hidden ${bgColor} rounded-full text-white shadow-lg transition-opacity hover:opacity-90`}
          aria-label="Open navigation menu"
        >
          <Menu className="h-6 w-6" />
        </button>

        {/* Mobile sidebar */}
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
            <SidebarContent
              navigation={currentNavigation}
              pathname={pathname}
              accentColor={accentColor}
              bgColor={bgColor}
              mode={mode}
              onItemClick={() => setSidebarOpen(false)}
            />
          </div>
        </div>

        {/* Desktop sidebar with floating card */}
        <div className="hidden bg-slate-950 p-4 md:flex md:w-72 md:flex-col">
          <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl border border-slate-800 bg-slate-900 shadow-xl">
            <SidebarContent
              navigation={currentNavigation}
              pathname={pathname}
              accentColor={accentColor}
              bgColor={bgColor}
              mode={mode}
            />
          </div>
        </div>

        {/* Main content area */}
        <main
          className={`flex-1 bg-slate-950 ${
            isContainerized ? "overflow-hidden" : "overflow-y-auto"
          }`}
        >
          <div
            className={
              isContainerized
                ? "h-full"
                : "mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8"
            }
          >
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
