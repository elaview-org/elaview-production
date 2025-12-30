import { UserX } from "lucide-react";
import { api } from "../../../../../elaview-mvp/src/trpc/server";
import SuspendButton from "./suspendButton";

export default async function LowApproval() {
  const lowApproval = await api.admin.users.getLowApprovalOwners({});

  return (
    <div className="rounded-lg border border-slate-700 bg-slate-800 p-6">
      <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold text-white">
        <UserX className="h-5 w-5 text-yellow-400" />
        Low Approval Space Owners
      </h2>
      {lowApproval && lowApproval.length > 0 ? (
        <div className="space-y-3">
          {lowApproval.map((owner) => (
            <div
              key={owner.userId}
              className="rounded-lg border border-yellow-500/20 bg-yellow-500/5 p-4"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-medium text-white">{owner.name ?? owner.email}</h3>
                  <div className="mt-2 flex items-center gap-4 text-sm">
                    <span className="text-slate-400">Bookings: {owner.totalBookings}</span>
                    <span className="font-medium text-yellow-400">
                      Approval Rate: {(owner.approvalRate * 100).toFixed(1)}%
                    </span>
                  </div>
                </div>
                <SuspendButton userId={owner.userId} />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="py-4 text-center text-slate-400">No low-approval space owners found</p>
      )}
    </div>
  );
}
