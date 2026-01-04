"use client";

import { useEffect, useState } from "react";
import { api } from "../../../../../elaview-mvp/src/trpc/react";
import { format, formatDistanceToNow } from "date-fns";
import { AlertCircle, CheckCircle, Clock, Play, XCircle } from "lucide-react";

export default function PayoutSchedulePanel() {
  const [currentTime, setCurrentTime] = useState(new Date());

  const { data: cronStatus } = api.admin.system.getCronJobStatus.useQuery(
    undefined,
    {
      refetchInterval: 30000, // Refresh every 30 seconds
    }
  );

  const { data: upcomingPayouts } =
    api.admin.finance.getUpcomingPayouts.useQuery(
      { hours: 24 },
      { refetchInterval: 30000 }
    );

  const triggerCronJob = api.admin.system.triggerCronJob.useMutation({
    onSuccess: (data) => {
      alert(
        `Cron job completed successfully! Processed ${data.itemsProcessed} items in ${data.duration}ms`
      );
    },
    onError: (error) => {
      alert(`Cron job failed: ${error.message}`);
    },
  });

  // Update current time every second for countdown
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatCountdown = (targetDate: Date) => {
    const diff = targetDate.getTime() - currentTime.getTime();
    if (diff <= 0) return "Running...";

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    if (hours > 0) return `${hours}h ${minutes}m ${seconds}s`;
    if (minutes > 0) return `${minutes}m ${seconds}s`;
    return `${seconds}s`;
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "SUCCESS":
        return (
          <span className="inline-flex items-center gap-1 rounded bg-green-500/20 px-2 py-1 text-xs text-green-300">
            <CheckCircle className="h-3 w-3" /> Success
          </span>
        );
      case "FAILED":
        return (
          <span className="inline-flex items-center gap-1 rounded bg-red-500/20 px-2 py-1 text-xs text-red-300">
            <XCircle className="h-3 w-3" /> Failed
          </span>
        );
      case "PARTIAL":
        return (
          <span className="inline-flex items-center gap-1 rounded bg-yellow-500/20 px-2 py-1 text-xs text-yellow-300">
            <AlertCircle className="h-3 w-3" /> Partial
          </span>
        );
      default:
        return (
          <span className="rounded bg-slate-700 px-2 py-1 text-xs text-slate-400">
            Unknown
          </span>
        );
    }
  };

  const isPastDue = (scheduledFor: Date) => {
    return new Date(scheduledFor) < currentTime;
  };

  return (
    <div className="rounded-lg border border-slate-700 bg-slate-800 p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-xl font-bold text-white">
          <Clock className="h-5 w-5 text-blue-400" />
          Payout Schedule & Cron Jobs
        </h2>
      </div>

      {/* Cron Job Status Cards */}
      <div className="mb-6 grid grid-cols-3 gap-4">
        {cronStatus && (
          <>
            {/* Payouts Cron */}
            <div className="rounded-lg border border-slate-600 bg-slate-900/50 p-4">
              <div className="mb-3 flex items-start justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-white">
                    Processing Payouts
                  </h3>
                  <p className="mt-1 text-xs text-slate-400">
                    {cronStatus.payoutsCron.description}
                  </p>
                </div>
                {getStatusBadge(cronStatus.payoutsCron.status)}
              </div>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400">Schedule:</span>
                  <span className="font-mono text-white">Every 30 min</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Next Run:</span>
                  <span className="font-semibold text-blue-400">
                    {formatCountdown(new Date(cronStatus.payoutsCron.nextRun))}
                  </span>
                </div>
                {cronStatus.payoutsCron.lastRun && (
                  <div className="flex justify-between">
                    <span className="text-slate-400">Last Run:</span>
                    <span className="text-white">
                      {formatDistanceToNow(
                        new Date(cronStatus.payoutsCron.lastRun),
                        {
                          addSuffix: true,
                        }
                      )}
                    </span>
                  </div>
                )}
                {cronStatus.payoutsCron.lastItemsProcessed !== undefined && (
                  <div className="flex justify-between">
                    <span className="text-slate-400">Last Processed:</span>
                    <span className="text-white">
                      {cronStatus.payoutsCron.lastItemsProcessed} items
                    </span>
                  </div>
                )}
              </div>
              <button
                onClick={() => {
                  if (confirm("Manually trigger payout processing cron job?")) {
                    triggerCronJob.mutate({ jobName: "process-payouts" });
                  }
                }}
                disabled={triggerCronJob.isPending}
                className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-3 py-2 text-xs font-medium text-white transition-colors hover:bg-blue-700 disabled:bg-slate-700"
              >
                <Play className="h-3 w-3" />
                Run Now
              </button>
            </div>

            {/* Balance Charges Cron */}
            <div className="rounded-lg border border-slate-600 bg-slate-900/50 p-4">
              <div className="mb-3 flex items-start justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-white">
                    Balance Charges
                  </h3>
                  <p className="mt-1 text-xs text-slate-400">
                    {cronStatus.balanceChargesCron.description}
                  </p>
                </div>
                {getStatusBadge(cronStatus.balanceChargesCron.status)}
              </div>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400">Schedule:</span>
                  <span className="font-mono text-white">Daily 2 AM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Next Run:</span>
                  <span className="font-semibold text-blue-400">
                    {formatCountdown(
                      new Date(cronStatus.balanceChargesCron.nextRun)
                    )}
                  </span>
                </div>
                {cronStatus.balanceChargesCron.lastRun && (
                  <div className="flex justify-between">
                    <span className="text-slate-400">Last Run:</span>
                    <span className="text-white">
                      {formatDistanceToNow(
                        new Date(cronStatus.balanceChargesCron.lastRun),
                        {
                          addSuffix: true,
                        }
                      )}
                    </span>
                  </div>
                )}
                {cronStatus.balanceChargesCron.lastItemsProcessed !==
                  undefined && (
                  <div className="flex justify-between">
                    <span className="text-slate-400">Last Processed:</span>
                    <span className="text-white">
                      {cronStatus.balanceChargesCron.lastItemsProcessed} items
                    </span>
                  </div>
                )}
              </div>
              <button
                onClick={() => {
                  if (confirm("Manually trigger balance charges cron job?")) {
                    triggerCronJob.mutate({ jobName: "charge-balances" });
                  }
                }}
                disabled={triggerCronJob.isPending}
                className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-3 py-2 text-xs font-medium text-white transition-colors hover:bg-blue-700 disabled:bg-slate-700"
              >
                <Play className="h-3 w-3" />
                Run Now
              </button>
            </div>

            {/* Proof Check Cron */}
            <div className="rounded-lg border border-slate-600 bg-slate-900/50 p-4">
              <div className="mb-3 flex items-start justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-white">
                    Auto-Approve Proofs
                  </h3>
                  <p className="mt-1 text-xs text-slate-400">
                    {cronStatus.proofCheckCron.description}
                  </p>
                </div>
                {getStatusBadge(cronStatus.proofCheckCron.status)}
              </div>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400">Schedule:</span>
                  <span className="font-mono text-white">Every 6 hours</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Next Run:</span>
                  <span className="font-semibold text-blue-400">
                    {formatCountdown(
                      new Date(cronStatus.proofCheckCron.nextRun)
                    )}
                  </span>
                </div>
                {cronStatus.proofCheckCron.lastRun && (
                  <div className="flex justify-between">
                    <span className="text-slate-400">Last Run:</span>
                    <span className="text-white">
                      {formatDistanceToNow(
                        new Date(cronStatus.proofCheckCron.lastRun),
                        {
                          addSuffix: true,
                        }
                      )}
                    </span>
                  </div>
                )}
                {cronStatus.proofCheckCron.lastItemsProcessed !== undefined && (
                  <div className="flex justify-between">
                    <span className="text-slate-400">Last Processed:</span>
                    <span className="text-white">
                      {cronStatus.proofCheckCron.lastItemsProcessed} items
                    </span>
                  </div>
                )}
              </div>
              <button
                onClick={() => {
                  if (
                    confirm("Manually trigger auto-approve proofs cron job?")
                  ) {
                    triggerCronJob.mutate({ jobName: "auto-approve-proofs" });
                  }
                }}
                disabled={triggerCronJob.isPending}
                className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-3 py-2 text-xs font-medium text-white transition-colors hover:bg-blue-700 disabled:bg-slate-700"
              >
                <Play className="h-3 w-3" />
                Run Now
              </button>
            </div>
          </>
        )}
      </div>

      {/* Upcoming Payouts Table */}
      {upcomingPayouts && upcomingPayouts.payouts.length > 0 && (
        <div className="mt-6">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="font-semibold text-white">
              Upcoming Payouts (Next 24 Hours)
            </h3>
            <div className="flex gap-4 text-sm">
              <span className="text-slate-400">
                Total:{" "}
                <span className="font-semibold text-white">
                  {upcomingPayouts.totalCount}
                </span>
              </span>
              <span className="text-slate-400">
                Amount:{" "}
                <span className="font-semibold text-white">
                  ${upcomingPayouts.totalAmount.toFixed(2)}
                </span>
              </span>
              {upcomingPayouts.overdueCount > 0 && (
                <span className="text-red-400">
                  Overdue:{" "}
                  <span className="font-semibold">
                    {upcomingPayouts.overdueCount}
                  </span>
                </span>
              )}
              {upcomingPayouts.failedCount > 0 && (
                <span className="text-red-400">
                  Failed:{" "}
                  <span className="font-semibold">
                    {upcomingPayouts.failedCount}
                  </span>
                </span>
              )}
            </div>
          </div>

          <div className="overflow-hidden rounded-lg border border-slate-600">
            <table className="w-full text-sm">
              <thead className="border-b border-slate-600 bg-slate-900/50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-slate-300">
                    Booking
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-slate-300">
                    Type
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-slate-300">
                    Space
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-slate-300">
                    Owner
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-slate-300">
                    Scheduled For
                  </th>
                  <th className="px-4 py-2 text-right text-xs font-medium text-slate-300">
                    Amount
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-slate-300">
                    Status
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-slate-300">
                    Attempts
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-600">
                {upcomingPayouts.payouts.map((payout, index) => (
                  <tr
                    key={`${payout.bookingId}-${payout.type}`}
                    className={`${
                      isPastDue(payout.scheduledFor)
                        ? "bg-red-500/10"
                        : payout.status === "FAILED"
                          ? "bg-yellow-500/10"
                          : index % 2 === 0
                            ? "bg-slate-900/30"
                            : "bg-slate-900/50"
                    } transition-colors hover:bg-blue-500/10`}
                  >
                    <td className="px-4 py-2 font-mono text-xs text-slate-400">
                      {payout.bookingId.slice(0, 8)}...
                    </td>
                    <td className="px-4 py-2">
                      <span
                        className={`inline-flex rounded px-2 py-1 text-xs font-medium ${
                          payout.type === "INSTALLATION"
                            ? "bg-green-500/20 text-green-300"
                            : payout.type === "FIRST_RENTAL"
                              ? "bg-blue-500/20 text-blue-300"
                              : "bg-purple-500/20 text-purple-300"
                        }`}
                      >
                        {payout.type}
                      </span>
                    </td>
                    <td className="max-w-37.5 truncate px-4 py-2 text-white">
                      {payout.spaceTitle}
                    </td>
                    <td className="max-w-30 truncate px-4 py-2 text-slate-300">
                      {payout.ownerName ?? payout.ownerEmail}
                    </td>
                    <td className="px-4 py-2">
                      <div className="text-white">
                        {format(new Date(payout.scheduledFor), "MMM d, h:mm a")}
                      </div>
                      {isPastDue(payout.scheduledFor) && (
                        <span className="text-xs font-semibold text-red-400">
                          ⚠️ OVERDUE
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-2 text-right font-semibold text-white">
                      ${payout.amount.toFixed(2)}
                    </td>
                    <td className="px-4 py-2">
                      <span
                        className={`inline-flex rounded px-2 py-1 text-xs ${
                          payout.status === "COMPLETED"
                            ? "bg-green-500/20 text-green-300"
                            : payout.status === "FAILED"
                              ? "bg-red-500/20 text-red-300"
                              : "bg-slate-700 text-slate-400"
                        }`}
                      >
                        {payout.status}
                      </span>
                    </td>
                    <td className="px-4 py-2 text-slate-400">
                      {payout.attemptCount || 0} / 3
                      {!payout.hasStripeAccount && (
                        <span className="ml-2 text-xs text-red-400">
                          ⚠️ No account
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {upcomingPayouts?.payouts.length === 0 && (
        <div className="py-8 text-center text-slate-400">
          <Clock className="mx-auto mb-2 h-12 w-12 text-slate-600" />
          <p>No payouts scheduled in the next 24 hours</p>
        </div>
      )}
    </div>
  );
}
