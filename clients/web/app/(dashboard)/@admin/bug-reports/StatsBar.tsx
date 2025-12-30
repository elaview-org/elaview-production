import { api } from "../../../../../elaview-mvp/src/trpc/server";

export function StatsBarSkeleton() {
  return (
    <div className="border-b border-slate-800 bg-slate-900/30 px-8 py-4">
      <div className="flex animate-pulse flex-wrap gap-6">
        {[...Array<number>(5)].map((_, i) => (
          <div key={i} className="flex flex-col">
            <div className="h-8 w-16 rounded bg-slate-700" />
            <div className="mt-1 h-4 w-20 rounded bg-slate-700" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default async function StatsBar() {
  const stats = await api.bugReports.getStats();

  return (
    <div className="border-b border-slate-800 bg-slate-900/30 px-8 py-4">
      <div className="flex flex-wrap gap-6">
        <div className="flex flex-col">
          <span className="text-2xl font-bold text-white">{stats.total}</span>
          <span className="text-sm text-slate-400">Total Reports</span>
        </div>
        <div className="flex flex-col">
          <span className="text-2xl font-bold text-purple-400">
            {stats.byStatus.find((s) => s.status === "NEW")?._count ?? 0}
          </span>
          <span className="text-sm text-slate-400">New</span>
        </div>
        <div className="flex flex-col">
          <span className="text-2xl font-bold text-blue-400">
            {stats.byStatus.find((s) => s.status === "IN_PROGRESS")?._count ?? 0}
          </span>
          <span className="text-sm text-slate-400">In Progress</span>
        </div>
        <div className="flex flex-col">
          <span className="text-2xl font-bold text-green-400">
            {stats.byStatus.find((s) => s.status === "FIXED")?._count ?? 0}
          </span>
          <span className="text-sm text-slate-400">Fixed</span>
        </div>
        <div className="flex flex-col">
          <span className="text-2xl font-bold text-cyan-400">{stats.newThisWeek}</span>
          <span className="text-sm text-slate-400">This Week</span>
        </div>
      </div>
    </div>
  );
}
