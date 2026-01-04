// src/components/layout/AdvertiserHamburgerDrawer.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  X,
  Building,
  Megaphone,
  Settings,
  CreditCard,
  HelpCircle,
  Bug,
  LogOut,
} from "lucide-react";
import { useClerk } from "@clerk/nextjs";
// import { api } from "../../../../elaview-mvp/src/trpc/react";
import { toast } from "sonner";
import { NotificationBadge } from "@/shared/components/notifications/NotificationBadge";
import { BugReportModal } from "@/shared/components/feedback/BugReportButton";

interface AdvertiserHamburgerDrawerProps {
  /** Whether drawer is open */
  isOpen: boolean;
  /** Callback when drawer closes */
  onClose: () => void;
}

/**
 * Advertiser Hamburger Drawer Component
 *
 * Side drawer that opens from left containing:
 * - Brand logo and role indicator
 * - Secondary navigation (Settings, Billing)
 * - Role switch button (to Space Owner)
 * - Help & support links
 * - Bug report
 * - Sign out
 */
export function AdvertiserHamburgerDrawer({ isOpen, onClose }: AdvertiserHamburgerDrawerProps) {
  const router = useRouter();
  const { signOut } = useClerk();
  const utils :any = undefined;
  const [bugReportOpen, setBugReportOpen] = useState(false);

  // const { data: notificationData } = api.notifications.getUnread.useQuery(undefined, {
  //   staleTime: 30000,
  //   refetchOnWindowFocus: true,
  // });
  const notificationData  = undefined;

  const switchRoleMutation :any = undefined;
  // const switchRoleMutation :any = api.user.switchRole.useMutation({
  //   onSuccess: async () => {
  //     await utils.notifications.getUnread.invalidate();
  //     await utils.user.getCurrentUser.invalidate();
  //     toast.success("Switched to Space Owner mode!");
  //     onClose();
  //     router.push("/spaces/dashboard");
  //   },
  //   onError: () => {
  //     toast.error("Failed to switch role. Please try again.");
  //   },
  // });

  const handleRoleSwitch = async () => {
    try {
      await switchRoleMutation.mutateAsync({ role: "SPACE_OWNER" });
    } catch (error) {
      console.error("Role switch error:", error);
    }
  };

  const handleSignOut = async () => {
    onClose();
    await signOut();
    router.push("/");
  };

  const otherRoleCount = notificationData?.otherRoleCount ?? 0;

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-85 bg-black/60 backdrop-blur-sm md:hidden"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div className="fixed top-0 bottom-0 left-0 z-90 w-80 max-w-[85vw] transform border-r border-slate-800 bg-slate-900 shadow-2xl transition-transform duration-300 ease-in-out md:hidden">
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-800 px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600">
                <Megaphone className="h-5 w-5 text-white" />
              </div>
              <div>
                <span className="text-lg font-bold text-white">Elaview</span>
                <p className="text-xs font-medium text-slate-400">Advertiser</p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-800 hover:text-white"
              aria-label="Close menu"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Menu Items */}
          <nav className="flex-1 space-y-1 overflow-y-auto px-4 py-4">
            {/* Settings */}
            <Link
              href="/settings"
              onClick={onClose}
              className="flex items-center gap-3 rounded-lg px-4 py-3 text-slate-300 transition-colors hover:bg-slate-800 hover:text-white"
            >
              <Settings className="h-5 w-5" />
              <span className="font-medium">Settings</span>
            </Link>

            {/* Billing */}
            <Link
              href="/billing"
              onClick={onClose}
              className="flex items-center gap-3 rounded-lg px-4 py-3 text-slate-300 transition-colors hover:bg-slate-800 hover:text-white"
            >
              <CreditCard className="h-5 w-5" />
              <span className="font-medium">Billing</span>
            </Link>

            <div className="my-3 border-t border-slate-800" />

            {/* Help & Support */}
            <Link
              href="/help"
              onClick={onClose}
              className="flex items-center gap-3 rounded-lg px-4 py-3 text-slate-300 transition-colors hover:bg-slate-800 hover:text-white"
            >
              <HelpCircle className="h-5 w-5" />
              <span className="font-medium">Help & Support</span>
            </Link>

            {/* Report an Issue */}
            <button
              onClick={() => {
                onClose();
                setBugReportOpen(true);
              }}
              className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-slate-300 transition-colors hover:bg-slate-800 hover:text-white"
            >
              <Bug className="h-5 w-5" />
              <span className="font-medium">Report an Issue</span>
            </button>
          </nav>

          {/* Footer - Role Switch & Sign Out */}
          <div className="space-y-3 border-t border-slate-800 p-4">
            {/* Role Switch Button */}
            <button
              onClick={handleRoleSwitch}
              disabled={switchRoleMutation.isPending}
              className={`relative flex w-full items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-semibold shadow-lg transition-all ${
                switchRoleMutation.isPending
                  ? "cursor-not-allowed bg-slate-800 text-slate-500 shadow-none"
                  : "bg-green-600 text-white shadow-green-600/20 hover:bg-green-700"
              }`}
            >
              <Building className="h-5 w-5" />
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

            {/* Sign Out */}
            <button
              onClick={handleSignOut}
              className="flex w-full items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium text-slate-400 transition-colors hover:bg-slate-800 hover:text-white"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </button>
          </div>
        </div>
      </div>

      {/* Bug Report Modal */}
      <BugReportModal isOpen={bugReportOpen} onClose={() => setBugReportOpen(false)} />
    </>
  );
}
