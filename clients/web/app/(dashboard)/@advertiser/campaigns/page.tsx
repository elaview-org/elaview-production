"use client";

import { useState } from "react";
import { Megaphone, PlusCircle, Clock, TrendingUp } from "lucide-react";
import { api } from "../../../../../elaview-mvp/src/trpc/react";
import Button from "../../../../../elaview-mvp/src/components/atoms/Button/Button";
import Links from "../../../../../elaview-mvp/src/components/atoms/Links/Links";
import DashboardHeader from "../../../../../elaview-mvp/src/components/molecules/DashboardHeader/DashboardHeader";
import CampaignsList from "../../../../../elaview-mvp/src/components/templates/CampaignsLIst";

type CampaignTab = "all" | "active" | "pending" | "completed";

const tabs: Array<{
  id: CampaignTab;
  label: string;
  icon?: typeof TrendingUp;
}> = [
  { id: "all", label: "All Campaigns" },
  { id: "active", label: "Active", icon: TrendingUp },
  { id: "pending", label: "Pending", icon: Clock },
  { id: "completed", label: "Completed" },
];

export default function CampaignsPage() {
  const [activeTab, setActiveTab] = useState<CampaignTab>("all");
  const [expandedCampaigns, setExpandedCampaigns] = useState<Set<string>>(new Set());

  // CRITICAL FIX: Ensure user exists in database before loading campaigns
  // This handles the race condition where Clerk webhook hasn't completed yet
  const { data: currentUser, isLoading: isLoadingUser } = api.user.getCurrentUser.useQuery();

  // Only load campaigns and bookings after user is confirmed to exist
  const { data: campaigns, isLoading: isLoadingCampaigns } =
    api.campaigns.getAdvertiserCampaigns.useQuery(undefined, { enabled: !!currentUser });
  const { data: bookings } = api.bookings.getAdvertiserBookings.useQuery(undefined, {
    enabled: !!currentUser,
  });

  const isLoading = isLoadingUser || isLoadingCampaigns;

  const filteredCampaigns = campaigns?.filter((campaign) => {
    const campaignBookings = bookings?.filter((b) => b.campaignId === campaign.id) || [];

    switch (activeTab) {
      case "active":
        return campaignBookings.some((b) =>
          ["CONFIRMED", "PENDING_BALANCE", "ACTIVE"].includes(b.status)
        );
      case "pending":
        return campaignBookings.some((b) => ["PENDING_APPROVAL", "APPROVED"].includes(b.status));
      case "completed":
        return campaignBookings.every((b) => ["COMPLETED", "CANCELLED"].includes(b.status));
      default:
        return true;
    }
  });

  const getCampaignStats = (campaignId: string) => {
    const campaignBookings = bookings?.filter((b) => b.campaignId === campaignId) || [];
    return {
      total: campaignBookings.length,
      pending: campaignBookings.filter((b) => b.status === "PENDING_APPROVAL").length,
      awaitingPayment: campaignBookings.filter((b) => b.status === "APPROVED").length,
      active: campaignBookings.filter((b) =>
        ["CONFIRMED", "PENDING_BALANCE", "ACTIVE"].includes(b.status)
      ).length,
      rejected: campaignBookings.filter((b) => b.status === "REJECTED").length,
      completed: campaignBookings.filter((b) => b.status === "COMPLETED").length,
      totalSpend: campaignBookings
        .filter((b) => b.status !== "REJECTED" && b.status !== "CANCELLED")
        .reduce((sum, b) => {
          const subtotal = Number(b.totalAmount);
          const platformFee = Number(b.platformFee);
          const stripeFee = Number(b.stripeFee || 0);
          return sum + subtotal + platformFee + stripeFee;
        }, 0),
    };
  };

  const toggleExpanded = (campaignId: string) => {
    const newExpanded = new Set(expandedCampaigns);
    if (newExpanded.has(campaignId)) {
      newExpanded.delete(campaignId);
    } else {
      newExpanded.add(campaignId);
    }
    setExpandedCampaigns(newExpanded);
  };

  return (
    <div className="h-full w-full p-4">
      <div className="flex h-full flex-col overflow-hidden rounded-xl border border-slate-800 bg-slate-900 shadow-xl">
        {/* Header - Fixed at top of container */}
        <div className="flex-shrink-0 border-b border-slate-800 p-6">
          <div className="flex items-center justify-between">
            <DashboardHeader
              title="My Campaigns"
              subtitle="Manage your advertising campaigns and track their performance."
            />
            <Links icon={PlusCircle} href="/campaigns/new" label="Create Campaign" variant="main" />
          </div>
        </div>

        {/* Tabs - Fixed below header */}
        <div className="flex-shrink-0 border-b border-slate-800 bg-slate-900/50">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <Button
                  key={tab.id}
                  handleClick={() => setActiveTab(tab.id)}
                  icon={tab.icon}
                  className={
                    isActive
                      ? "border-blue-500 text-blue-400"
                      : "border-transparent text-slate-400 hover:border-slate-700 hover:text-slate-300"
                  }
                >
                  {tab.label}
                </Button>
              );
            })}
          </nav>
        </div>

        {/* Content - Scrollable area */}
        <div className="flex-1 overflow-y-auto p-6">
          {isLoading && (
            <div className="flex items-center justify-center py-12">
              <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-blue-500"></div>
            </div>
          )}

          {/* new condition */}
          {!isLoading && (!filteredCampaigns || filteredCampaigns.length === 0) && (
            <div className="py-12 text-center">
              <Megaphone className="mx-auto h-10 w-10 text-slate-700" />
              <p className="mt-4 text-sm text-slate-400">
                No {activeTab !== "all" ? activeTab : ""} campaigns yet
              </p>
              {activeTab === "all" && (
                <Links
                  href="/campaigns/new"
                  icon={PlusCircle}
                  label="Create Campaign"
                  variant="small"
                />
              )}
            </div>
          )}
          {/* existing condition */}
          {!isLoading && filteredCampaigns && filteredCampaigns.length > 0 && (
            <CampaignsList
              filteredCampaigns={filteredCampaigns}
              getCampaignStats={getCampaignStats}
              bookings={bookings}
              expandedCampaigns={expandedCampaigns}
              toggleExpanded={toggleExpanded}
            />
          )}
        </div>
      </div>
    </div>
  );
}
