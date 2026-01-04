import Link from "next/link";
import { PlusCircle, Mail, Plus } from "lucide-react";
import EmptyState from "@/shared/components/atoms/EmptyState";

export default function MarketingCampaignsPage() {
  return (
    <div className="h-full w-full p-4">
      <div className="flex h-full flex-col overflow-hidden rounded-xl border border-slate-800 bg-slate-900 shadow-xl">
        {/* Header - Fixed */}
        <div className="shrink-0 border-b border-slate-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold text-white">
                Marketing Campaigns
              </h2>
              <p className="mt-2 text-slate-400">
                Create and manage email and SMS campaigns
              </p>
            </div>
            <Link
              href="/campaigns/new"
              className="inline-flex items-center gap-2 rounded-lg bg-purple-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-purple-700 focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-slate-950 focus:outline-none"
            >
              <PlusCircle className="h-5 w-5" />
              New Campaign
            </Link>
          </div>
        </div>

        {/* Content - Scrollable */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="rounded-lg border border-slate-700 bg-slate-800 shadow-sm">
            <EmptyState
              icon={Mail}
              title="No campaigns yet"
              description="Get started by creating your first marketing campaign"
            >
              <EmptyState.Button
                icon={PlusCircle}
                href="/campaigns/new"
                label="Create Campaign"
              />
            </EmptyState>
          </div>
        </div>
      </div>
    </div>
  );
}
