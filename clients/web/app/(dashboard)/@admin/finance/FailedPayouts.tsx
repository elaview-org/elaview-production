import { api } from "../../../../../elaview-mvp/src/trpc/server";

export async function FailedPayouts() {
  const failedPayouts = await api.admin.finance.getFailedPayouts();

  if (!failedPayouts || failedPayouts.length === 0) {
    return null;
  }

  return (
    <div className="rounded-lg border border-slate-700 bg-slate-800 p-6">
      <h2 className="mb-4 text-xl font-semibold text-white">
        Failed Payouts ({failedPayouts.length})
      </h2>
      <div className="space-y-3">
        {failedPayouts.map((booking) => (
          <div
            key={booking.id}
            className="rounded-lg border border-yellow-500/20 bg-yellow-500/5 p-4"
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-medium text-white">{booking.space.title}</h3>
                <p className="mt-1 text-sm text-slate-400">
                  Owner: {booking.space.owner.email}
                </p>
                <p className="mt-2 text-sm text-red-400">Error: {booking.payoutError}</p>
              </div>
              <span className="text-sm font-medium text-white">
                ${Number(booking.transferAmount ?? 0).toFixed(2)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}