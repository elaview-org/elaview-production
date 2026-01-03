// src/components/layout/SpaceOwnerHamburgerDrawer.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  X,
  Megaphone,
  Building,
  Settings,
  HelpCircle,
  Bug,
  LogOut,
} from "lucide-react";
import { useClerk } from "@clerk/nextjs";
import { toast } from "sonner";
import { NotificationBadge } from "@/shared/components/notifications/NotificationBadge";
import { BugReportModal } from "@/shared/components/feedback/BugReportButton";
import useUnreadNotifications from "@/shared/hooks/api/getters/useUnreadNotifications/useUnreadNotifications";
import useUserSwitchRole from "@/shared/hooks/api/actions/useUserSwitchRole/useUserSwitchRole";

interface SpaceOwnerHamburgerDrawerProps {
  /** Whether drawer is open */
  isOpen: boolean;
  /** Callback when drawer closes */
  onClose: () => void;
}

/**
 * Space Owner Hamburger Drawer Component
 *
 * Side drawer that opens from left containing:
 * - Brand logo and role indicator
 * - Secondary navigation (Settings)
 * - Role switch button (to Advertiser)
 * - Help & support links
 * - Bug report
 * - Sign out
 */
export function SpaceOwnerHamburgerDrawer({
  isOpen,
  onClose,
}: SpaceOwnerHamburgerDrawerProps) {
  const router = useRouter();
  const { signOut } = useClerk();
  const [bugReportOpen, setBugReportOpen] = useState(false);

  // const { data: notificationData } = api.notifications.getUnread.useQuery(undefined, {
  //   staleTime: 30000,
  //   refetchOnWindowFocus: true,
  // });
  const { notificationData } = useUnreadNotifications(undefined, {
    staleTime: 30000,
    refetchOnWindowFocus: true,
  });
  const {switchRole, isPending:switchRolePending} = useUserSwitchRole();
  // const switchRoleMutation = api.user.switchRole.useMutation({
  //   onSuccess: async () => {
  //     await utils.notifications.getUnread.invalidate();
  //     await utils.user.getCurrentUser.invalidate();
  //     toast.success("Switched to Advertiser mode!");
  //     onClose();
  //     router.push("/browse");
  //   },
  //   onError: () => {
  //     toast.error("Failed to switch role. Please try again.");
  //   },
  // });

  const handleRoleSwitch = async () => {
    try {
      // await switchRoleMutation.mutateAsync({ role: "ADVERTISER" });
      await switchRole();
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
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-600">
                <Building className="h-5 w-5 text-white" />
              </div>
              <div>
                <span className="text-lg font-bold text-white">Elaview</span>
                <p className="text-xs font-medium text-slate-400">
                  Space Owner
                </p>
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
              disabled={switchRolePending}
              className={`relative flex w-full items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-semibold shadow-lg transition-all ${
                switchRolePending
                  ? "cursor-not-allowed bg-slate-800 text-slate-500 shadow-none"
                  : "bg-blue-600 text-white shadow-blue-600/20 hover:bg-blue-700"
              }`}
            >
              <Megaphone className="h-5 w-5" />
              {switchRolePending ? "Switching..." : "Browse Spaces"}
              {otherRoleCount > 0 && (
                <div className="absolute -top-1 -right-1">
                  <NotificationBadge
                    count={otherRoleCount}
                    size="sm"
                    variant="warning"
                  />
                </div>
              )}
            </button>

            {/* Mode Indicator */}
            <div className="flex items-center justify-center gap-2 rounded-lg bg-slate-800/50 px-3 py-2">
              <div className="h-2 w-2 animate-pulse rounded-full bg-green-500"></div>
              <p className="text-xs font-medium text-slate-300">
                Space Owner Mode
              </p>
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
      <BugReportModal
        isOpen={bugReportOpen}
        onClose={() => setBugReportOpen(false)}
      />
    </>
  );
}
