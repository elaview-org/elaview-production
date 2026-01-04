import { Award } from "lucide-react";
import { api } from "../../../../../elaview-mvp/src/trpc/server";

interface TopPerformersProps {
  limit: number;
}

export function TopPerformersSkeleton() {
  return <div className="text-white">Loading...</div>;
}

export default async function TopPerformers(props: TopPerformersProps) {
  const topPerformers = await api.admin.analytics.getTopPerformers({
    limit: props.limit,
  });

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      {/* Top Spaces */}
      <div className="rounded-lg border border-slate-700 bg-slate-800 p-6">
        <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold text-white">
          <Award className="h-5 w-5 text-yellow-400" />
          Top Spaces
        </h2>
        <div className="space-y-3">
          {topPerformers?.topSpaces.slice(0, 5).map((space, index) => (
            <div key={space.spaceId} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl font-bold text-slate-600">#{index + 1}</span>
                <div>
                  <p className="font-medium text-white">{space.title}</p>
                  <p className="text-xs text-slate-400">
                    {space.city}, {space.state} • {space.bookingsCount} bookings
                  </p>
                </div>
              </div>
              <span className="font-bold text-green-400">${space.totalRevenue.toFixed(0)}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Top Advertisers */}
      <div className="rounded-lg border border-slate-700 bg-slate-800 p-6">
        <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold text-white">
          <Award className="h-5 w-5 text-blue-400" />
          Top Advertisers
        </h2>
        <div className="space-y-3">
          {topPerformers?.topAdvertisers.slice(0, 5).map((advertiser, index) => (
            <div key={advertiser.userId} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl font-bold text-slate-600">#{index + 1}</span>
                <div>
                  <p className="font-medium text-white">{advertiser.name}</p>
                  <p className="text-xs text-slate-400">
                    {advertiser.campaignsCount} campaigns • {advertiser.bookingsCount} bookings
                  </p>
                </div>
              </div>
              <span className="font-bold text-blue-400">${advertiser.totalSpend.toFixed(0)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
