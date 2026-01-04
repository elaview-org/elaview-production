"use client";

import { api } from "../../../../../elaview-mvp/src/trpc/react";
import { AlertTriangle, DollarSign, Calendar } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface StuckPayout {
  id: string;
  campaignName: string;
  spaceTitle: string;
  amount: number;
  endDate: Date;
  daysStuck: number;
}

interface StuckPayoutAlertsProps {
  stuckPayouts: {
    count: number;
    totalAmount: number;
    bookings: StuckPayout[];
  };
}

export function StuckPayoutAlerts({ stuckPayouts }: StuckPayoutAlertsProps) {
  const router = useRouter();
  const processPayoutMutation = api.admin.finance.manuallyProcessFinalPayout.useMutation({
    onSuccess: () => {
      alert("Payout processed successfully!");
      router.refresh();
    },
    onError: (error) => {
      alert(`Failed to process payout: ${error.message}`);
    },
  });

  const [processing, setProcessing] = useState<string | null>(null);

  if (stuckPayouts.count === 0) {
    return null; // Don't show if no stuck payouts
  }

  const handleProcessPayout = async (bookingId: string) => {
    if (
      !confirm(
        "Are you sure you want to manually process this final payout? This will create a Stripe transfer immediately."
      )
    ) {
      return;
    }

    setProcessing(bookingId);
    try {
      await processPayoutMutation.mutateAsync({ bookingId });
    } finally {
      setProcessing(null);
    }
  };

  return (
    <div className="rounded-lg border border-red-500/50 bg-red-500/10 p-6">
      <div className="mb-4 flex items-center gap-2">
        <AlertTriangle className="h-6 w-6 text-red-400" />
        <h2 className="text-xl font-semibold text-red-400">Stuck Payouts Requiring Attention</h2>
      </div>

      <div className="mb-4 text-sm text-red-300">
        {stuckPayouts.count} booking{stuckPayouts.count !== 1 ? "s" : ""} with stuck final payout
        {stuckPayouts.totalAmount > 0 && (
          <span className="ml-2 font-semibold">
            (Total: ${stuckPayouts.totalAmount.toFixed(2)})
          </span>
        )}
      </div>

      <div className="space-y-3">
        {stuckPayouts.bookings.map((booking) => (
          <div key={booking.id} className="rounded-lg border border-red-500/30 bg-slate-900 p-4">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0 flex-1">
                <div className="mb-2 flex items-center gap-2">
                  <h3 className="truncate font-medium text-white">{booking.campaignName}</h3>
                  <span className="text-xs text-slate-500">→</span>
                  <span className="truncate text-sm text-slate-400">{booking.spaceTitle}</span>
                </div>

                <div className="flex flex-wrap items-center gap-4 text-sm text-slate-400">
                  <div className="flex items-center gap-1">
                    <DollarSign className="h-4 w-4" />
                    <span>${booking.amount.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>Ended: {new Date(booking.endDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <AlertTriangle className="h-4 w-4 text-red-400" />
                    <span className="font-medium text-red-400">{booking.daysStuck} days stuck</span>
                  </div>
                </div>

                <div className="mt-2 text-xs text-slate-500">Booking ID: {booking.id}</div>
              </div>

              <div className="flex shrink-0 gap-2">
                <button
                  onClick={() => handleProcessPayout(booking.id)}
                  disabled={processing === booking.id || processPayoutMutation.isPending}
                  className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {processing === booking.id ? "Processing..." : "Process Payout"}
                </button>
                <a
                  href={`/payment-flows?bookingId=${booking.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
                >
                  View Details
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
