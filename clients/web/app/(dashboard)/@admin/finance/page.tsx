import { Suspense } from "react";
import { RefreshCw } from "lucide-react";
import { api } from "../../../../../elaview-mvp/src/trpc/server";
import { PayoutHealthSection } from "./PayoutHealthSection";
import { StuckPayoutAlerts } from "./StuckPayoutAlerts";
import { RevenueBreakdown } from "./RevenueBreakdown";
import { DisputedBookings } from "./DisputedBookings";
import { FailedPayouts } from "./FailedPayouts";
import { MetricsCards } from "./MetricsCards";

export default async function FinanceDashboard() {
  // Only fetch shared data (payoutHealth is used by StuckPayoutAlerts + PayoutHealthSection)
  // All other components fetch their own data - Next.js automatically parallelizes them!
  const payoutHealth = await api.admin.finance.getPayoutHealth();

  return (
    <div className="h-full w-full p-4">
      <div className="flex h-full flex-col overflow-hidden rounded-xl border border-slate-800 bg-slate-900 shadow-xl">
        {/* Header - Fixed */}
        <div className="shrink-0 border-b border-slate-700 p-6">
          <h1 className="text-3xl font-bold text-white">Financial Dashboard</h1>
          <p className="mt-1 text-slate-400">Monitor revenue, disputes, and payouts</p>
        </div>

        {/* Content - Scrollable */}
        <div className="flex-1 space-y-6 overflow-y-auto p-6">
          {/* Stuck Payout Alerts - uses shared payoutHealth */}
          <StuckPayoutAlerts stuckPayouts={payoutHealth.stuck} />

          {/* Payout Health - uses shared payoutHealth */}
          <PayoutHealthSection initialData={payoutHealth} />

          {/* Revenue Breakdown - fetches own data, parallelized automatically */}
          <Suspense fallback={<LoadingCard />}>
            <RevenueBreakdown />
          </Suspense>

          {/* Metrics Cards - fetches own data, parallelized automatically */}
          <Suspense fallback={<LoadingCard />}>
            <MetricsCards />
          </Suspense>

          {/* Disputed Bookings - fetches own data, parallelized automatically */}
          <Suspense fallback={<LoadingCard />}>
            <DisputedBookings />
          </Suspense>

          {/* Failed Payouts - fetches own data, parallelized automatically */}
          <Suspense fallback={<LoadingCard />}>
            <FailedPayouts />
          </Suspense>
        </div>
      </div>
    </div>
  );
}

function LoadingCard() {
  return (
    <div className="rounded-lg border border-slate-700 bg-slate-800 p-6">
      <div className="flex h-32 items-center justify-center">
        <RefreshCw className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    </div>
  );
}
