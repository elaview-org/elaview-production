import Link from "next/link";
import { Activity, AlertTriangle, DollarSign, Users } from "lucide-react";
import { api } from "../../../../../elaview-mvp/src/trpc/server";

async function FinancialMetricsWrapper() {
  const financialMetrics = await api.admin.finance.getFinancialMetrics({});

  return (
    <>
      <Link
        href="/finance"
        className="rounded-lg border border-slate-700 bg-slate-800 p-6 transition-colors hover:border-blue-500/50"
      >
        <div className="mb-2 flex items-center justify-between">
          <h3 className="text-sm font-medium text-slate-400">Platform Revenue</h3>
          <DollarSign className="h-5 w-5 text-green-400" />
        </div>
        <p className="text-3xl font-bold text-white">
          ${financialMetrics?.platformRevenue.toFixed(2) ?? "0.00"}
        </p>
        <p className="mt-1 text-xs text-slate-500">View financial dashboard →</p>
      </Link>

      <Link
        href="/disputes"
        className="rounded-lg border border-slate-700 bg-slate-800 p-6 transition-colors hover:border-red-500/50"
      >
        <div className="mb-2 flex items-center justify-between">
          <h3 className="text-sm font-medium text-slate-400">Disputes</h3>
          <AlertTriangle className="h-5 w-5 text-red-400" />
        </div>
        <p className="text-3xl font-bold text-white">{financialMetrics?.disputes ?? 0}</p>
        <p className="mt-1 text-xs text-slate-500">Requiring review →</p>
      </Link>
    </>
  );
}

async function HealthWrapper() {
  const health = await api.admin.system.getSystemHealth();

  return (
    <>
      <Link
        href="/analytics"
        className="rounded-lg border border-slate-700 bg-slate-800 p-6 transition-colors hover:border-purple-500/50"
      >
        <div className="mb-2 flex items-center justify-between">
          <h3 className="text-sm font-medium text-slate-400">Total Users</h3>
          <Users className="h-5 w-5 text-purple-400" />
        </div>
        <p className="text-3xl font-bold text-white">{health?.database.users ?? 0}</p>
        <p className="mt-1 text-xs text-slate-500">View analytics →</p>
      </Link>

      <Link
        href="/system"
        className="rounded-lg border border-slate-700 bg-slate-800 p-6 transition-colors hover:border-cyan-500/50"
      >
        <div className="mb-2 flex items-center justify-between">
          <h3 className="text-sm font-medium text-slate-400">System Health</h3>
          <Activity className="h-5 w-5 text-cyan-400" />
        </div>
        <p
          className={`text-3xl font-bold ${
            health?.status === "HEALTHY" ? "text-green-400" : "text-yellow-400"
          }`}
        >
          {health?.status ?? "UNKNOWN"}
        </p>
        <p className="mt-1 text-xs text-slate-500">View system status →</p>
      </Link>
    </>
  );
}

export default async function QuickStats() {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
      <FinancialMetricsWrapper />
      <HealthWrapper />
    </div>
  );
}
