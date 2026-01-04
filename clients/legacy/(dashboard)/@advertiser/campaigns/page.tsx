import Link from "next/link";
import { PlusCircle, Megaphone } from "lucide-react";

export default function CampaignsPage() {
  return (
    <div className="h-full w-full p-4">
      <div className="flex h-full flex-col overflow-hidden rounded-xl border border-slate-800 bg-slate-900 shadow-xl">
        {/* Header - Fixed */}
        <div className="shrink-0 border-b border-slate-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold text-white">My Campaigns</h2>
              <p className="mt-2 text-slate-400">
                Manage your advertising campaigns and track their performance.
              </p>
            </div>
            <Link
              href="/campaigns/new"
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-950 focus:outline-none"
            >
              <PlusCircle className="h-5 w-5" />
              Create Campaign
            </Link>
          </div>
        </div>

        {/* Content - Scrollable */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="rounded-lg border border-slate-700 bg-slate-800 shadow-sm">
            <div className="p-6">
              <div className="py-12 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-500/10">
                  <Megaphone className="h-8 w-8 text-blue-400" />
                </div>
                <p className="mt-4 text-lg font-medium text-white">
                  No campaigns yet
                </p>
                <p className="mt-2 text-slate-400">
                  Get started by creating your first advertising campaign
                </p>
                <Link
                  href="/campaigns/new"
                  className="mt-6 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                >
                  <PlusCircle className="h-5 w-5" />
                  Create Campaign
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
