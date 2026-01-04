import { Activity, DollarSign, TrendingUp, Users } from "lucide-react";
import { api } from "../../../../../elaview-mvp/src/trpc/server";
import { type Period } from "./PeriodSelector";

interface KeyMetricsProps {
  period: Period;
}

export function KeyMetricsSkeleton() {
  return <div className="text-white">Loading...</div>;
}

export default async function KeyMetrics(props: KeyMetricsProps) {
  const analytics = await api.admin.analytics.getPlatformAnalytics({
    period: props.period,
  });

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
      <div className="rounded-lg border border-slate-700 bg-slate-800 p-6">
        <div className="mb-2 flex items-center justify-between">
          <h3 className="text-sm font-medium text-slate-400">Revenue</h3>
          <DollarSign className="h-5 w-5 text-green-400" />
        </div>
        <p className="text-3xl font-bold text-white">${analytics?.revenue.toFixed(2) || "0.00"}</p>
        <p className="mt-1 text-xs text-green-400">
          +{analytics?.revenueGrowth.toFixed(1)}% vs prev period
        </p>
      </div>

      <div className="rounded-lg border border-slate-700 bg-slate-800 p-6">
        <div className="mb-2 flex items-center justify-between">
          <h3 className="text-sm font-medium text-slate-400">Bookings</h3>
          <Activity className="h-5 w-5 text-blue-400" />
        </div>
        <p className="text-3xl font-bold text-white">{analytics?.bookingsCount || 0}</p>
        <p className="mt-1 text-xs text-slate-500">{analytics?.activeBookings || 0} active</p>
      </div>

      <div className="rounded-lg border border-slate-700 bg-slate-800 p-6">
        <div className="mb-2 flex items-center justify-between">
          <h3 className="text-sm font-medium text-slate-400">New Users</h3>
          <Users className="h-5 w-5 text-purple-400" />
        </div>
        <p className="text-3xl font-bold text-white">
          {(analytics?.newAdvertisers || 0) + (analytics?.newSpaceOwners || 0)}
        </p>
        <p className="mt-1 text-xs text-slate-500">
          {analytics?.newAdvertisers} advertisers, {analytics?.newSpaceOwners} owners
        </p>
      </div>

      <div className="rounded-lg border border-slate-700 bg-slate-800 p-6">
        <div className="mb-2 flex items-center justify-between">
          <h3 className="text-sm font-medium text-slate-400">Avg Booking</h3>
          <TrendingUp className="h-5 w-5 text-cyan-400" />
        </div>
        <p className="text-3xl font-bold text-white">
          ${analytics?.avgBookingValue.toFixed(2) || "0.00"}
        </p>
        <p className="mt-1 text-xs text-slate-500">Per booking</p>
      </div>
    </div>
  );
}
