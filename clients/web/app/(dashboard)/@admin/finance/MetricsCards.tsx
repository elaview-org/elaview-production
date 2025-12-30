import { DollarSign, AlertTriangle, TrendingUp, Clock } from "lucide-react";
import { api } from "../../../../../elaview-mvp/src/trpc/server";

export async function MetricsCards() {
  const metrics = await api.admin.finance.getFinancialMetrics({});

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
      <div className="rounded-lg border border-slate-700 bg-slate-800 p-6">
        <div className="mb-2 flex items-center justify-between">
          <h3 className="text-sm font-medium text-slate-400">Platform Revenue</h3>
          <DollarSign className="h-5 w-5 text-green-400" />
        </div>
        <p className="text-3xl font-bold text-white">
          ${metrics?.platformRevenue.toFixed(2) || "0.00"}
        </p>
        <p className="mt-1 text-xs text-slate-500">This month</p>
      </div>

      <div className="rounded-lg border border-slate-700 bg-slate-800 p-6">
        <div className="mb-2 flex items-center justify-between">
          <h3 className="text-sm font-medium text-slate-400">Pending Payouts</h3>
          <Clock className="h-5 w-5 text-yellow-400" />
        </div>
        <p className="text-3xl font-bold text-white">
          ${metrics?.totalPendingAmount.toFixed(2) || "0.00"}
        </p>
        <p className="mt-1 text-xs text-slate-500">{metrics?.pendingPayouts || 0} bookings</p>
      </div>

      <div className="rounded-lg border border-slate-700 bg-slate-800 p-6">
        <div className="mb-2 flex items-center justify-between">
          <h3 className="text-sm font-medium text-slate-400">Disputes</h3>
          <AlertTriangle className="h-5 w-5 text-red-400" />
        </div>
        <p className="text-3xl font-bold text-white">{metrics?.disputes || 0}</p>
        <p className="mt-1 text-xs text-slate-500">Requiring review</p>
      </div>

      <div className="rounded-lg border border-slate-700 bg-slate-800 p-6">
        <div className="mb-2 flex items-center justify-between">
          <h3 className="text-sm font-medium text-slate-400">Refunds</h3>
          <TrendingUp className="h-5 w-5 text-blue-400" />
        </div>
        <p className="text-3xl font-bold text-white">
          ${metrics?.refundsThisMonth.toFixed(2) || "0.00"}
        </p>
        <p className="mt-1 text-xs text-slate-500">{metrics?.refundsCount || 0} this month</p>
      </div>
    </div>
  );
}