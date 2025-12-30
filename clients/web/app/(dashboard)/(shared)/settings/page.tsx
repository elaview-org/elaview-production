// src/app/(shared)/settings/page.tsx
"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import type { UserResource } from "@clerk/types";
import {
  AlertCircle,
  Bell,
  Building,
  CheckCircle,
  DollarSign,
  Download,
  ExternalLink,
  Loader2,
  Shield,
  User,
} from "lucide-react";
import { api } from "../../../../../elaview-mvp/src/trpc/react";
import { toast } from "sonner";

// Import existing advertiser components
import { BusinessProfileTab } from "../../../../../elaview-mvp/src/components/settings/BusinessProfileTab";
import { NotificationsTab } from "../../../../../elaview-mvp/src/components/settings/NotificationsTab";
import { SecurityTab } from "../../../../../elaview-mvp/src/components/settings/SecurityTab";
import { DataPrivacyTab } from "../../../../../elaview-mvp/src/components/settings/DataPrivacyTab";
import { EmbeddedStripeOnboarding } from "../../../../../elaview-mvp/src/components/settings/EmbeddedStripeOnboarding";

// Tab types
type AdvertiserTabId = "profile" | "business" | "notifications" | "security" | "privacy";
type SpaceOwnerTabId = "profile" | "payouts";
type TabId = AdvertiserTabId | SpaceOwnerTabId;

interface Tab {
  id: TabId;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

export default function UnifiedSettingsPage() {
  const { user: clerkUser } = useUser();
  const { data: user, isLoading: userLoading } = api.user.getCurrentUser.useQuery();

  // Default tab based on role
  const getDefaultTab = useCallback((): TabId => {
    if (user?.role === "SPACE_OWNER") return "payouts";
    return "profile";
  }, [user?.role]);

  const [activeTab, setActiveTab] = useState<TabId>("profile");

  // Update default tab when user data loads
  useEffect(() => {
    if (user && activeTab === "profile") {
      setActiveTab(getDefaultTab());
    }
  }, [user, activeTab, getDefaultTab]);

  if (userLoading) {
    return (
      <div className="h-full w-full p-4">
        <div className="flex h-full items-center justify-center rounded-xl border border-slate-800 bg-slate-900 shadow-xl">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            <p className="text-sm text-slate-400">Loading settings...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="h-full w-full p-4">
        <div className="flex h-full items-center justify-center rounded-xl border border-slate-800 bg-slate-900 shadow-xl">
          <p className="text-slate-400">Please sign in to view settings</p>
        </div>
      </div>
    );
  }

  // Define tabs based on role
  const advertiserTabs: Tab[] = [
    { id: "profile", label: "Profile", icon: User },
    { id: "business", label: "Business", icon: Building },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "security", label: "Security", icon: Shield },
    { id: "privacy", label: "Data & Privacy", icon: Download },
  ];

  const spaceOwnerTabs: Tab[] = [
    { id: "profile", label: "Profile", icon: User },
    { id: "payouts", label: "Payouts", icon: DollarSign },
  ];

  const tabs = user.role === "ADVERTISER" ? advertiserTabs : spaceOwnerTabs;
  const accentColor = user.role === "ADVERTISER" ? "blue" : "green";

  return (
    <div className="h-full w-full p-4">
      <div className="flex h-full flex-col overflow-hidden rounded-xl border border-slate-800 bg-slate-900 shadow-xl">
        {/* Header - Fixed */}
        <div className="shrink-0 border-b border-slate-800 p-6">
          <h1 className="text-3xl font-bold text-white">Account Settings</h1>
          <p className="mt-2 text-slate-400">
            {user.role === "ADVERTISER"
              ? "Manage your account preferences and security settings"
              : "Manage your profile and payout preferences"}
          </p>
        </div>

        {/* Tabs - Fixed */}
        <div className="shrink-0 border-b border-slate-800 bg-slate-900/50">
          <nav className="flex space-x-8 overflow-x-auto px-6">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`${
                    isActive
                      ? `border-${accentColor}-500 text-${accentColor}-400`
                      : "border-transparent text-slate-400 hover:border-slate-700 hover:text-slate-300"
                  } flex items-center border-b-2 px-1 py-4 text-sm font-medium whitespace-nowrap transition-colors`}
                  style={
                    isActive
                      ? {
                          borderColor: user.role === "ADVERTISER" ? "#3b82f6" : "#22c55e",
                          color: user.role === "ADVERTISER" ? "#60a5fa" : "#4ade80",
                        }
                      : {}
                  }
                >
                  <Icon className="mr-2 h-4 w-4" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Content Area - Scrollable */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === "profile" && <ProfileTab userRole={user.role} clerkUser={clerkUser} />}

          {/* Advertiser-only tabs */}
          {user.role === "ADVERTISER" && (
            <>
              {activeTab === "business" && <BusinessProfileTab />}
              {activeTab === "notifications" && <NotificationsTab />}
              {activeTab === "security" && <SecurityTab />}
              {activeTab === "privacy" && <DataPrivacyTab />}
            </>
          )}

          {/* Space Owner-only tabs */}
          {user.role === "SPACE_OWNER" && activeTab === "payouts" && <PayoutsTab />}
        </div>
      </div>
    </div>
  );
}

// Profile Tab - Works for all roles
function ProfileTab({
  userRole,
  clerkUser,
}: {
  userRole: "ADVERTISER" | "SPACE_OWNER" | "ADMIN" | "MARKETING";
  clerkUser: UserResource | null | undefined;
}) {
  const gradientFrom =
    userRole === "ADVERTISER"
      ? "from-blue-500"
      : userRole === "ADMIN"
        ? "from-purple-500"
        : userRole === "MARKETING"
          ? "from-purple-500"
          : "from-green-500";
  const gradientTo =
    userRole === "ADVERTISER"
      ? "to-cyan-500"
      : userRole === "ADMIN"
        ? "to-pink-500"
        : userRole === "MARKETING"
          ? "to-pink-500"
          : "to-emerald-500";
  const badgeBg =
    userRole === "ADVERTISER"
      ? "bg-blue-500/10"
      : userRole === "ADMIN"
        ? "bg-purple-500/10"
        : userRole === "MARKETING"
          ? "bg-purple-500/10"
          : "bg-green-500/10";
  const badgeText =
    userRole === "ADVERTISER"
      ? "text-blue-400"
      : userRole === "ADMIN"
        ? "text-purple-400"
        : "text-green-400";
  const badgeBorder =
    userRole === "ADVERTISER"
      ? "border-blue-500/20"
      : userRole === "ADMIN"
        ? "border-purple-500/20"
        : "border-green-500/20";
  const linkColor =
    userRole === "ADVERTISER"
      ? "text-blue-400 hover:text-blue-300"
      : userRole === "ADMIN"
        ? "text-purple-400 hover:text-purple-300"
        : "text-green-400 hover:text-green-300";

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-slate-700 bg-slate-800 p-6 transition-colors hover:border-slate-600">
        <h2 className="mb-6 text-xl font-bold text-white">Profile Information</h2>

        <div className="mb-8 flex items-center space-x-4 border-b border-slate-700 pb-6">
          <div
            className={`h-20 w-20 rounded-full bg-linear-to-br ${gradientFrom} ${gradientTo} flex items-center justify-center text-2xl font-bold text-white shadow-lg`}
          >
            {clerkUser?.firstName?.[0]}
            {clerkUser?.lastName?.[0]}
          </div>
          <div>
            <h3 className="text-xl font-semibold text-white">{clerkUser?.fullName}</h3>
            <p className="text-slate-400">{clerkUser?.primaryEmailAddress?.emailAddress}</p>
            <div className="mt-2 flex items-center gap-2">
              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold ${badgeBg} ${badgeText} border ${badgeBorder}`}
              >
                {userRole.replace("_", " ")}
              </span>
              {clerkUser?.primaryEmailAddress?.verification?.status === "verified" && (
                <span className="flex items-center gap-1 text-xs text-green-400">
                  <CheckCircle className="h-3 w-3" />
                  Verified
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-slate-400">Email Address</label>
            <p className="mt-1 text-white">{clerkUser?.primaryEmailAddress?.emailAddress}</p>
          </div>

          <div>
            <label className="text-sm font-medium text-slate-400">Account Type</label>
            <p className="mt-1 text-white">{userRole.replace("_", " ")}</p>
          </div>

          <div className="border-t border-slate-700 pt-6">
            <a
              href="/user"
              className={`inline-flex items-center ${linkColor} text-sm font-medium transition-colors hover:underline`}
            >
              Manage authentication settings (password, 2FA, sessions)
            </a>
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-slate-700 bg-slate-800 p-6 transition-colors hover:border-slate-600">
        <h3 className="mb-4 text-lg font-semibold text-white">Account Details</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-slate-400">User ID</p>
            <p className="mt-1 font-mono text-xs break-all text-slate-300">{clerkUser?.id}</p>
          </div>
          <div>
            <p className="text-slate-400">Account Created</p>
            <p className="mt-1 text-slate-300">
              {clerkUser?.createdAt ? new Date(clerkUser.createdAt).toLocaleDateString() : "N/A"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Payouts Tab - Space Owner Only
function PayoutsTab() {
  const utils = api.useUtils();

  const { data: accountStatus, isLoading: statusLoading } =
    api.billing.getConnectAccountStatus.useQuery();

  const openDashboard = api.billing.generateExpressDashboardLink.useMutation({
    onSuccess: (data) => {
      window.open(data.url, "_blank");
      toast.success("Opening Stripe Dashboard...");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to open dashboard");
    },
  });

  if (statusLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-green-500" />
      </div>
    );
  }

  const isAccountActive = accountStatus?.hasAccount && accountStatus?.isActive;
  const needsSetup = !accountStatus?.hasAccount || accountStatus?.requiresAction;

  return (
    <div className="max-w-3xl space-y-6">
      {/* Status banner */}
      <div
        className={`rounded-lg border p-4 ${
          isAccountActive
            ? "border-green-500/20 bg-green-500/5"
            : "border-amber-500/20 bg-amber-500/5"
        }`}
      >
        <div className="flex items-center gap-3">
          {isAccountActive ? (
            <CheckCircle className="h-5 w-5 shrink-0 text-green-400" />
          ) : (
            <AlertCircle className="h-5 w-5 shrink-0 text-amber-400" />
          )}
          <div className="flex-1">
            <p className={`font-medium ${isAccountActive ? "text-green-400" : "text-amber-400"}`}>
              {isAccountActive ? "Payout Account Active" : "Setup Required"}
            </p>
            <p className="mt-0.5 text-sm text-slate-400">
              {isAccountActive
                ? "Ready to receive payments from advertisers"
                : "Complete setup below to start earning"}
            </p>
          </div>

          {isAccountActive && (
            <button
              onClick={() => openDashboard.mutate()}
              disabled={openDashboard.isPending}
              className="inline-flex items-center rounded-lg bg-green-600 px-4 py-2 font-medium text-white transition-all hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {openDashboard.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Opening...
                </>
              ) : (
                <>
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Open Dashboard
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {needsSetup && (
        <>
          <div className="rounded-lg border border-slate-700 bg-slate-800 p-6">
            <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-white">
              <CheckCircle className="h-5 w-5 text-green-400" />
              What to Expect
            </h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-green-500/20 text-sm font-bold text-green-400 ring-2 ring-green-500/30">
                  1
                </div>
                <div className="flex-1">
                  <p className="font-medium text-white">Enter your email</p>
                  <p className="mt-0.5 text-xs text-slate-400">
                    Any email works - you will use this to access your Stripe dashboard later
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-green-500/20 text-sm font-bold text-green-400 ring-2 ring-green-500/30">
                  2
                </div>
                <div className="flex-1">
                  <p className="font-medium text-white">Provide business details</p>
                  <p className="mt-0.5 text-xs text-slate-400">
                    Business name, address, and tax ID (individual or business)
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-green-500/20 text-sm font-bold text-green-400 ring-2 ring-green-500/30">
                  3
                </div>
                <div className="flex-1">
                  <p className="font-medium text-white">Connect your bank account</p>
                  <p className="mt-0.5 text-xs text-slate-400">
                    Where you will receive payouts from advertisers
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-green-500/20 text-sm font-bold text-green-400 ring-2 ring-green-500/30">
                  4
                </div>
                <div className="flex-1">
                  <p className="font-medium text-white">Verify your identity</p>
                  <p className="mt-0.5 text-xs text-slate-400">
                    Upload government-issued ID (required by law for security)
                  </p>
                </div>
              </div>
            </div>
          </div>

          <EmbeddedStripeOnboarding
            onComplete={() => utils.billing.getConnectAccountStatus.invalidate()}
            onExit={() => toast.info("You can complete setup anytime from settings")}
          />
        </>
      )}

      <div className="rounded-lg border border-slate-700 bg-slate-800 p-5">
        <h3 className="mb-3 font-semibold text-white">How Payouts Work</h3>
        <div className="space-y-3 text-sm">
          <div className="flex gap-3">
            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-green-500/10 text-xs font-bold text-green-400">
              1
            </span>
            <div>
              <p className="font-medium text-white">Upload installation proof within 7 days</p>
            </div>
          </div>

          <div className="flex gap-3">
            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-green-500/10 text-xs font-bold text-green-400">
              2
            </span>
            <div>
              <p className="font-medium text-white">Advertiser reviews (48hr auto-approve)</p>
            </div>
          </div>

          <div className="flex gap-3">
            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-green-500/10 text-xs font-bold text-green-400">
              3
            </span>
            <div>
              <p className="font-medium text-white">Payment sent instantly to your bank</p>
              <p className="mt-0.5 text-xs text-slate-400">10% platform fee • 2-7 day arrival</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
