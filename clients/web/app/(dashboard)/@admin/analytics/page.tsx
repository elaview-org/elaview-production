import PeriodSelector, { type Period } from "./PeriodSelector";
import KeyMetrics, { KeyMetricsSkeleton } from "./KeyMetrics";
import TopPerformers, { TopPerformersSkeleton } from "./TopPerformers";
import { Suspense } from "react";

const defaultPeriod: Period = "30d";
const defaultLimit = 10;

export default async function AnalyticsDashboard({
  searchParams,
}: {
  searchParams: Promise<{ period?: Period }>;
}) {
  const period = (await searchParams).period ?? defaultPeriod;

  return (
    <div className="h-full w-full p-4">
      <div className="flex h-full flex-col overflow-hidden rounded-xl border border-slate-800 bg-slate-900 shadow-xl">
        {/* Header - Fixed */}
        <div className="shrink-0 border-b border-slate-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white">Analytics</h1>
              <p className="mt-1 text-slate-400">Platform performance metrics</p>
            </div>
            <PeriodSelector period={period ?? defaultPeriod} />
          </div>
        </div>

        {/* Content - Scrollable */}
        <div className="flex-1 space-y-6 overflow-y-auto p-6">
          {/* Key Metrics */}
          <Suspense fallback={<KeyMetricsSkeleton />}>
            <KeyMetrics period={period} />
          </Suspense>

          {/* Top Performers */}
          <Suspense fallback={<TopPerformersSkeleton />}>
            <TopPerformers limit={defaultLimit} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
