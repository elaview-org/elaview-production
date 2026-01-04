import Link from "next/link";
import { Mail, UserCircle, BarChart3, Users, Target } from "lucide-react";
import EmptyState from "@/shared/components/atoms/EmptyState";
import useMarketingMetrics from "@/shared/hooks/api/getters/useMarketingMetrics/useMarketingMetrics";

function MarketingMetricCardSkeleton() {
  return (
    <div className="animate-pulse rounded-lg border border-slate-700 bg-slate-800 p-6 shadow-sm">
      <div className="mb-4 h-12 rounded bg-slate-900/50"></div>
      <div className="mb-2 h-8 rounded bg-slate-900/50"></div>
      <div className="h-4 w-1/2 rounded bg-slate-900/50"></div>
    </div>
  );
}

function UserBreakdownCardSkeleton() {
  return (
    <div className="space-y-3">
      <div className="h-6 animate-pulse rounded bg-slate-900/50"></div>
      <div className="h-6 animate-pulse rounded bg-slate-900/50"></div>
      <div className="h-6 animate-pulse rounded bg-slate-900/50"></div>
    </div>
  );
}

export default function MarketingDashboard() {

  const {metrics, isLoading} = useMarketingMetrics();

  const stats = [
    {
      name: "Total Users",
      value: metrics?.totalUsers.toLocaleString() || "0",
      change: `+${metrics?.newUsersThisWeek || 0} this week`,
      changeType: (metrics?.newUsersThisWeek || 0) > 0 ? "increase" : "neutral",
      icon: UserCircle,
    },
    {
      name: "Demo Requests",
      value: metrics?.totalDemoRequests.toLocaleString() || "0",
      change: `+${metrics?.newDemoRequestsThisWeek || 0} this week`,
      changeType:
        (metrics?.newDemoRequestsThisWeek || 0) > 0 ? "increase" : "neutral",
      icon: Mail,
    },
    {
      name: "Active Campaigns",
      value: metrics?.activeCampaigns.toLocaleString() || "0",
      change: "User campaigns",
      changeType: "neutral",
      icon: Target,
    },
    {
      name: "Conversion Rate",
      value: `${metrics?.conversionRate || "0.0"}%`,
      change: "Advertisers → Campaigns",
      changeType: "neutral",
      icon: BarChart3,
    },
  ];

  return (
    <div className="h-full w-full p-4">
      <div className="flex h-full flex-col overflow-hidden rounded-xl border border-slate-800 bg-slate-900 shadow-xl">
        {/* Header - Fixed */}
        <div className="flex-shrink-0 border-b border-slate-700 p-6">
          <h2 className="text-3xl font-bold text-white">Marketing Overview</h2>
          <p className="mt-2 text-slate-400">
            Track leads, signups, and platform growth metrics
          </p>
        </div>

        {/* Content - Scrollable */}
        <div className="flex-1 space-y-8 overflow-y-auto p-6">
          {/* Stats Grid */}
          {isLoading ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {[1, 2, 3, 4].map((i) => (
                <MarketingMetricCardSkeleton key={i} />
              ))}
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {stats.map((stat) => {
                const Icon = stat.icon;
                return (
                  <div
                    key={stat.name}
                    className="rounded-lg border border-slate-700 bg-slate-800 p-6 shadow-sm transition-all hover:border-purple-500/50 hover:shadow-lg hover:shadow-purple-500/10"
                  >
                    <div className="flex items-center justify-between">
                      <div className="rounded-lg bg-purple-500/10 p-3">
                        <Icon className="h-6 w-6 text-purple-400" />
                      </div>
                      <span
                        className={`text-sm font-medium ${
                          stat.changeType === "increase"
                            ? "text-green-400"
                            : "text-slate-400"
                        }`}
                      >
                        {stat.change}
                      </span>
                    </div>
                    <p className="mt-4 text-3xl font-bold text-white">
                      {stat.value}
                    </p>
                    <p className="mt-1 text-sm text-slate-400">{stat.name}</p>
                  </div>
                );
              })}
            </div>
          )}

          {/* Detailed Metrics */}
          <div className="grid gap-6 md:grid-cols-2">
            {/* User Breakdown */}
            <div className="rounded-lg border border-slate-700 bg-slate-800 p-6 shadow-sm">
              <h3 className="mb-4 text-lg font-semibold text-white">
                User Breakdown
              </h3>
              {isLoading ? (
                <UserBreakdownCardSkeleton />
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Total Users</span>
                    <span className="font-semibold text-white">
                      {metrics?.totalUsers.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Advertisers</span>
                    <span className="font-semibold text-white">
                      {metrics?.totalAdvertisers.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Space Owners</span>
                    <span className="font-semibold text-white">
                      {metrics?.totalSpaceOwners.toLocaleString()}
                    </span>
                  </div>
                  <div className="border-t border-slate-700 pt-3">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">New This Month</span>
                      <span className="font-semibold text-green-400">
                        +{metrics?.newUsersThisMonth.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Recent Activity */}
            <div className="rounded-lg border border-slate-700 bg-slate-800 p-6 shadow-sm">
              <h3 className="mb-4 text-lg font-semibold text-white">
                Quick Links
              </h3>
              <div className="space-y-3">
                <Link
                  href="/inbound"
                  className="flex items-center justify-between rounded-lg bg-slate-900/50 p-3 transition-colors hover:bg-slate-900/70"
                >
                  <div className="flex items-center gap-3">
                    <Users className="h-5 w-5 text-purple-400" />
                    <span className="font-medium text-white">
                      View Demo Requests
                    </span>
                  </div>
                  <span className="text-sm text-purple-400">
                    {metrics?.totalDemoRequests} total
                  </span>
                </Link>
                <Link
                  href="/users"
                  className="flex items-center justify-between rounded-lg bg-slate-900/50 p-3 transition-colors hover:bg-slate-900/70"
                >
                  <div className="flex items-center gap-3">
                    <UserCircle className="h-5 w-5 text-purple-400" />
                    <span className="font-medium text-white">Manage Users</span>
                  </div>
                  <span className="text-sm text-purple-400">
                    {metrics?.totalUsers} users
                  </span>
                </Link>
                <Link
                  href="/analytics"
                  className="flex items-center justify-between rounded-lg bg-slate-900/50 p-3 transition-colors hover:bg-slate-900/70"
                >
                  <div className="flex items-center gap-3">
                    <BarChart3 className="h-5 w-5 text-purple-400" />
                    <span className="font-medium text-white">
                      Platform Analytics
                    </span>
                  </div>
                  <span className="text-sm text-purple-400">
                    {metrics?.activeCampaigns} campaigns
                  </span>
                </Link>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="rounded-lg border border-slate-700 bg-slate-800 p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-white">Quick Actions</h3>
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <Link
                href="/campaigns/new"
                className="flex items-center gap-3 rounded-lg border-2 border-dashed border-slate-700 p-4 transition-all hover:border-purple-500 hover:bg-purple-500/5"
              >
                <div className="rounded-lg bg-purple-500/10 p-2">
                  <Mail className="h-6 w-6 text-purple-400" />
                </div>
                <div>
                  <p className="font-medium text-white">Send Campaign</p>
                  <p className="text-sm text-slate-400">
                    Create a new campaign
                  </p>
                </div>
              </Link>
              <Link
                href="/audiences"
                className="flex items-center gap-3 rounded-lg border-2 border-dashed border-slate-700 p-4 transition-all hover:border-purple-500 hover:bg-purple-500/5"
              >
                <div className="rounded-lg bg-purple-500/10 p-2">
                  <UserCircle className="h-6 w-6 text-purple-400" />
                </div>
                <div>
                  <p className="font-medium text-white">Create Audience</p>
                  <p className="text-sm text-slate-400">Segment your users</p>
                </div>
              </Link>
              <Link
                href="/analytics"
                className="flex items-center gap-3 rounded-lg border-2 border-dashed border-slate-700 p-4 transition-all hover:border-purple-500 hover:bg-purple-500/5"
              >
                <div className="rounded-lg bg-purple-500/10 p-2">
                  <BarChart3 className="h-6 w-6 text-purple-400" />
                </div>
                <div>
                  <p className="font-medium text-white">View Reports</p>
                  <p className="text-sm text-slate-400">Campaign performance</p>
                </div>
              </Link>
            </div>
          </div>

          {/* Recent Campaigns - Placeholder for Future */}
          <div className="rounded-lg border border-slate-700 bg-slate-800 shadow-sm">
            <div className="border-b border-slate-700 px-6 py-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-white">
                  Email Campaigns
                </h3>
                <Link
                  href="/campaigns"
                  className="text-sm font-medium text-purple-400 hover:text-purple-300"
                >
                  View all
                </Link>
              </div>
            </div>
            <EmptyState
              icon={Mail}
              title="Email campaign feature coming soon"
              description="For now, use demo requests to connect with leads directly"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
