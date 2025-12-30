import { Settings } from "lucide-react";

export default function MarketingSettingsPage() {
  return (
    <div className="h-full w-full p-4">
      <div className="flex h-full flex-col overflow-hidden rounded-xl border border-slate-800 bg-slate-900 shadow-xl">
        {/* Header - Fixed */}
        <div className="shrink-0 border-b border-slate-700 p-6">
          <h2 className="text-3xl font-bold text-white">Marketing Settings</h2>
          <p className="mt-2 text-slate-400">
            Configure your marketing tools and integrations
          </p>
        </div>

        {/* Content - Scrollable */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="rounded-lg border border-slate-700 bg-slate-800 p-12 text-center shadow-sm">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-purple-500/10">
              <Settings className="h-8 w-8 text-purple-400" />
            </div>
            <p className="mt-4 text-lg font-medium text-white">Coming Soon</p>
            <p className="mt-2 text-slate-400">
              Settings features are currently in development
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
