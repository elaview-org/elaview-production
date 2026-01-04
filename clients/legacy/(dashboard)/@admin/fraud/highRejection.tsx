import { AlertTriangle } from "lucide-react";
import { api } from "../../../../../elaview-mvp/src/trpc/server";
import SuspendButton from "./suspendButton";

export default async function HighRejection() {
  const highRejection = await api.admin.users.getHighRejectionAdvertisers({});

  return (
    <div className="rounded-lg border border-slate-700 bg-slate-800 p-6">
      <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold text-white">
        <AlertTriangle className="h-5 w-5 text-red-400" />
        High Rejection Advertisers
      </h2>
      {highRejection && highRejection.length > 0 ? (
        <div className="space-y-3">
          {highRejection.map((advertiser) => (
            <div
              key={advertiser.userId}
              className="rounded-lg border border-red-500/20 bg-red-500/5 p-4"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-medium text-white">{advertiser.name ?? advertiser.email}</h3>
                  <div className="mt-2 flex items-center gap-4 text-sm">
                    <span className="text-slate-400">Bookings: {advertiser.totalBookings}</span>
                    <span className="font-medium text-red-400">
                      Rejection Rate: {(advertiser.rejectionRate * 100).toFixed(1)}%
                    </span>
                    <span className="text-slate-400">
                      Refunds: ${advertiser.totalRefunds.toFixed(2)}
                    </span>
                  </div>
                </div>
                <SuspendButton userId={advertiser.userId} />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="py-4 text-center text-slate-400">No high-rejection advertisers found</p>
      )}
    </div>
  );
}
