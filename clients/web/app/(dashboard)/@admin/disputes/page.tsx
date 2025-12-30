import { AlertTriangle } from "lucide-react";
import { api } from "../../../../../elaview-mvp/src/trpc/server";
import { DisputesList } from "./DisputesList";

export default async function DisputesPage() {
  const data = await api.admin.bookings.getDisputedBookings({ limit: 20 });

  return (
    <div className="h-full w-full p-4">
      <div className="flex h-full flex-col overflow-hidden rounded-xl border border-slate-800 bg-slate-900 shadow-xl">
        {/* Header - Fixed */}
        <div className="shrink-0 border-b border-slate-700 p-6">
          <h1 className="text-3xl font-bold text-white">Disputed Installations</h1>
          <p className="mt-2 text-slate-400">Review and resolve installation disputes</p>
        </div>

        {/* Content - Scrollable */}
        <div className="flex-1 space-y-6 overflow-y-auto p-6">
          {/* Stats Card */}
          <div className="rounded-lg border border-slate-700 bg-slate-800 p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <AlertTriangle className="h-6 w-6 text-red-400" />
                <div>
                  <h2 className="text-2xl font-bold text-white">{data?.total ?? 0}</h2>
                  <p className="text-sm text-slate-400">Disputes Requiring Review</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-slate-400">Average Response Time</p>
                <p className="text-lg font-semibold text-white">{"<"} 24h</p>
              </div>
            </div>
          </div>

          {/* Disputes List */}
          <DisputesList initialBookings={data?.bookings ?? []} />
        </div>
      </div>
    </div>
  );
}
