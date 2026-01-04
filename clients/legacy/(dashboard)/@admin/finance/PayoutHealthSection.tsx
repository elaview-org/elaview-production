"use client";

import { api } from "../../../../../elaview-mvp/src/trpc/react";
import { DollarSign, TrendingUp, AlertTriangle, Clock, CheckCircle } from "lucide-react";

interface PayoutHealthSectionProps {
  initialData: {
    today: {
      firstPayoutsCount: number;
      firstPayoutsTotal: number;
      finalPayoutsCount: number;
      finalPayoutsTotal: number;
      failedCount: number;
    };
    pending: {
      awaitingProof: number;
      awaitingProofAmount: number;
      inQualityPeriod: number;
      inQualityPeriodAmount: number;
    };
    stuck: {
      count: number;
      totalAmount: number;
      bookingIds: string[];
      bookings: Array<{
        id: string;
        campaignName: string;
        spaceTitle: string;
        amount: number;
        endDate: Date;
        daysStuck: number;
      }>;
    };
    metrics: {
      averageTimeToFinalPayout: number;
      payoutSuccessRate: number;
    };
  };
}

export function PayoutHealthSection({ initialData }: PayoutHealthSectionProps) {
  // Still fetch client-side for auto-refresh, but start with server data
  const { data: health } = api.admin.finance.getPayoutHealth.useQuery(undefined, {
    initialData,
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  const totalToday = health.today.firstPayoutsTotal + health.today.finalPayoutsTotal;
  const totalPending = health.pending.awaitingProofAmount + health.pending.inQualityPeriodAmount;

  return (
    <div className="rounded-lg border border-slate-700 bg-slate-800 p-6">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-white">💰 Payout Health Status</h2>
        <span className="text-xs text-slate-400">Auto-refreshes every 30s</span>
      </div>

      {/* Summary Cards */}
      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
        {/* Today's Payouts */}
        <div className="rounded-lg border border-slate-700 bg-slate-900/50 p-4">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm text-slate-400">Processed Today</span>
            <CheckCircle className="h-5 w-5 text-green-400" />
          </div>
          <p className="text-2xl font-bold text-white">${totalToday.toFixed(2)}</p>
          <div className="mt-2 space-y-1 text-xs text-slate-500">
            <div>
              First Payouts: {health.today.firstPayoutsCount} ($
              {health.today.firstPayoutsTotal.toFixed(2)})
            </div>
            <div>
              Final Payouts: {health.today.finalPayoutsCount} ($
              {health.today.finalPayoutsTotal.toFixed(2)})
            </div>
          </div>
        </div>

        {/* Pending Payouts */}
        <div className="rounded-lg border border-slate-700 bg-slate-900/50 p-4">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm text-slate-400">Pending Total</span>
            <Clock className="h-5 w-5 text-yellow-400" />
          </div>
          <p className="text-2xl font-bold text-white">${totalPending.toFixed(2)}</p>
          <div className="mt-2 space-y-1 text-xs text-slate-500">
            <div>
              Awaiting Proof: {health.pending.awaitingProof} ($
              {health.pending.awaitingProofAmount.toFixed(2)})
            </div>
            <div>
              In Quality Period: {health.pending.inQualityPeriod} ($
              {health.pending.inQualityPeriodAmount.toFixed(2)})
            </div>
          </div>
        </div>

        {/* Failed/Stuck */}
        <div
          className={`rounded-lg border bg-slate-900/50 p-4 ${
            health.stuck.count > 0 || health.today.failedCount > 0
              ? "border-red-500/50 bg-red-500/5"
              : "border-slate-700"
          }`}
        >
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm text-slate-400">Issues</span>
            {health.stuck.count > 0 || health.today.failedCount > 0 ? (
              <AlertTriangle className="h-5 w-5 text-red-400" />
            ) : (
              <CheckCircle className="h-5 w-5 text-green-400" />
            )}
          </div>
          <div className="space-y-1">
            <div
              className={`text-lg font-semibold ${
                health.stuck.count > 0 ? "text-red-400" : "text-green-400"
              }`}
            >
              Stuck: {health.stuck.count}
            </div>
            <div
              className={`text-sm ${
                health.today.failedCount > 0 ? "text-red-400" : "text-slate-500"
              }`}
            >
              Failed: {health.today.failedCount}
            </div>
          </div>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 gap-4 border-t border-slate-700 pt-4 md:grid-cols-2">
        <div className="flex items-center gap-3">
          <TrendingUp className="h-5 w-5 text-blue-400" />
          <div>
            <div className="text-sm text-slate-400">Avg Time to Final Payout</div>
            <div className="text-lg font-semibold text-white">
              {health.metrics.averageTimeToFinalPayout.toFixed(1)} days
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <DollarSign className="h-5 w-5 text-green-400" />
          <div>
            <div className="text-sm text-slate-400">Payout Success Rate</div>
            <div className="text-lg font-semibold text-white">
              {health.metrics.payoutSuccessRate.toFixed(1)}%
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
