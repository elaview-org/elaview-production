import RecentDisputes from "./RecentDisputes";
import QuickStats from "./QuickStats";
import QuickActions from "./QuickActions";
import { Suspense } from "react";

export default async function AdminDashboard() {
  return (
    <div className="h-full w-full p-4">
      <div className="flex h-full flex-col overflow-hidden rounded-xl border border-slate-800 bg-slate-900 shadow-xl">
        {/* Header - Fixed */}
        <div className="shrink-0 border-b border-slate-700 p-6">
          <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
          <p className="mt-1 text-slate-400">Platform overview and quick actions</p>
        </div>

        {/* Content - Scrollable */}
        <div className="flex-1 space-y-6 overflow-y-auto p-6">
          {/* Quick Stats */}
          <Suspense>
            <QuickStats />
          </Suspense>

          {/* Quick Actions */}
          <QuickActions />

          {/* Recent Disputes (if any) */}
          <Suspense>
            <RecentDisputes />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
