"use client";

import { api } from "../../../../../elaview-mvp/src/trpc/react";
import {
  Activity,
  Database,
  AlertCircle,
  TrendingUp,
  RefreshCw,
} from "lucide-react";

export default function SystemHealth() {
  const { data: health, isLoading } =
    api.admin.system.getSystemHealth.useQuery();

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <RefreshCw className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  const statusColor =
    health?.status === "HEALTHY" ? "text-green-400" : "text-yellow-400";

  return (
    <div className="h-full w-full p-4">
      <div className="flex h-full flex-col overflow-hidden rounded-xl border border-slate-800 bg-slate-900 shadow-xl">
        {/* Header - Fixed */}
        <div className="shrink-0 border-b border-slate-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white">System Health</h1>
              <p className="mt-1 text-slate-400">
                Monitor platform status and activity
              </p>
            </div>
            <div
              className={`rounded-lg border px-4 py-2 ${
                health?.status === "HEALTHY"
                  ? "border-green-500/20 bg-green-500/10"
                  : "border-yellow-500/20 bg-yellow-500/10"
              }`}
            >
              <span className={`text-sm font-medium ${statusColor}`}>
                {health?.status ?? "UNKNOWN"}
              </span>
            </div>
          </div>
        </div>

        {/* Content - Scrollable */}
        <div className="flex-1 space-y-6 overflow-y-auto p-6">
          {/* Database Stats */}
          <div className="rounded-lg border border-slate-700 bg-slate-800 p-6">
            <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold text-white">
              <Database className="h-5 w-5 text-blue-400" />
              Database Statistics
            </h2>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              <div className="rounded-lg bg-slate-900/50 p-4">
                <p className="text-sm text-slate-400">Users</p>
                <p className="mt-1 text-2xl font-bold text-white">
                  {health?.database.users.toLocaleString() ?? 0}
                </p>
              </div>
              <div className="rounded-lg bg-slate-900/50 p-4">
                <p className="text-sm text-slate-400">Campaigns</p>
                <p className="mt-1 text-2xl font-bold text-white">
                  {health?.database.campaigns.toLocaleString() ?? 0}
                </p>
              </div>
              <div className="rounded-lg bg-slate-900/50 p-4">
                <p className="text-sm text-slate-400">Bookings</p>
                <p className="mt-1 text-2xl font-bold text-white">
                  {health?.database.bookings.toLocaleString() ?? 0}
                </p>
              </div>
              <div className="rounded-lg bg-slate-900/50 p-4">
                <p className="text-sm text-slate-400">Spaces</p>
                <p className="mt-1 text-2xl font-bold text-white">
                  {health?.database.spaces.toLocaleString() ?? 0}
                </p>
              </div>
            </div>
          </div>

          {/* Active Items */}
          <div className="rounded-lg border border-slate-700 bg-slate-800 p-6">
            <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold text-white">
              <Activity className="h-5 w-5 text-green-400" />
              Active Items
            </h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="rounded-lg bg-slate-900/50 p-4">
                <p className="text-sm text-slate-400">Active Campaigns</p>
                <p className="mt-1 text-2xl font-bold text-white">
                  {health?.active.campaigns ?? 0}
                </p>
              </div>
              <div className="rounded-lg bg-slate-900/50 p-4">
                <p className="text-sm text-slate-400">Active Bookings</p>
                <p className="mt-1 text-2xl font-bold text-white">
                  {health?.active.bookings ?? 0}
                </p>
              </div>
            </div>
          </div>

          {/* Issues */}
          {health &&
            (health.issues.pendingDisputes > 0 ||
              health.issues.failedPayouts > 0) && (
              <div className="rounded-lg border border-yellow-500/20 bg-slate-800 p-6">
                <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold text-white">
                  <AlertCircle className="h-5 w-5 text-yellow-400" />
                  Issues Requiring Attention
                </h2>
                <div className="space-y-3">
                  {health.issues.pendingDisputes > 0 && (
                    <div className="flex items-center justify-between rounded-lg border border-yellow-500/20 bg-yellow-500/5 p-3">
                      <span className="text-white">Pending Disputes</span>
                      <span className="font-bold text-yellow-400">
                        {health.issues.pendingDisputes}
                      </span>
                    </div>
                  )}
                  {health.issues.failedPayouts > 0 && (
                    <div className="flex items-center justify-between rounded-lg border border-red-500/20 bg-red-500/5 p-3">
                      <span className="text-white">Failed Payouts</span>
                      <span className="font-bold text-red-400">
                        {health.issues.failedPayouts}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}

          {/* 24h Activity */}
          <div className="rounded-lg border border-slate-700 bg-slate-800 p-6">
            <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold text-white">
              <TrendingUp className="h-5 w-5 text-cyan-400" />
              Last 24 Hours
            </h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="rounded-lg bg-slate-900/50 p-4">
                <p className="text-sm text-slate-400">New Bookings</p>
                <p className="mt-1 text-2xl font-bold text-white">
                  {health?.activity24h.bookings ?? 0}
                </p>
              </div>
              <div className="rounded-lg bg-slate-900/50 p-4">
                <p className="text-sm text-slate-400">New Users</p>
                <p className="mt-1 text-2xl font-bold text-white">
                  {health?.activity24h.newUsers ?? 0}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
