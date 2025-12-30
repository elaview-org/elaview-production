"use client";

import { api } from "../../../../../elaview-mvp/src/trpc/react";
import { CheckCircle, XCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import type { Decimal } from "@prisma/client-runtime-utils";

interface DisputedBooking {
  id: string;
  totalAmount: Decimal;
  adminNotes: string | null;
  space: {
    title: string;
    owner: {
      email: string;
    };
  };
  campaign: {
    name: string;
    advertiser: {
      email: string;
    };
  };
}

interface DisputedBookingsSectionProps {
  bookings: DisputedBooking[];
  total: number;
}

export function DisputedBookingsSection({
  bookings,
  total,
}: DisputedBookingsSectionProps) {
  const router = useRouter();

  const approveDispute = api.admin.bookings.approveDisputedProof.useMutation({
    onSuccess: () => {
      alert("Dispute approved and payout processed!");
      router.refresh();
    },
  });

  const rejectDispute = api.admin.bookings.rejectDisputedProof.useMutation({
    onSuccess: () => {
      alert("Dispute rejected and refund processed!");
      router.refresh();
    },
  });

  if (bookings.length === 0) {
    return null;
  }

  return (
    <div className="rounded-lg border border-slate-700 bg-slate-800 p-6">
      <h2 className="mb-4 text-xl font-semibold text-white">
        Disputed Bookings ({total})
      </h2>
      <div className="space-y-4">
        {bookings.map((booking) => (
          <div
            key={booking.id}
            className="rounded-lg border border-red-500/20 bg-red-500/5 p-4"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="font-medium text-white">
                  {booking.space.title}
                </h3>
                <p className="mt-1 text-sm text-slate-400">
                  Campaign: {booking.campaign.name}
                </p>
                <div className="mt-2 flex items-center gap-4 text-xs text-slate-500">
                  <span>Advertiser: {booking.campaign.advertiser.email}</span>
                  <span>Owner: {booking.space.owner.email}</span>
                  <span>Amount: ${Number(booking.totalAmount).toFixed(2)}</span>
                </div>
                {booking.adminNotes && (
                  <p className="mt-2 rounded bg-slate-900/50 p-2 text-sm text-slate-400">
                    Notes: {booking.adminNotes}
                  </p>
                )}
              </div>
              <div className="ml-4 flex gap-2">
                <button
                  onClick={() => {
                    const notes = prompt("Admin notes (min 10 chars):");
                    if (notes && notes.length >= 10) {
                      approveDispute.mutate({
                        bookingId: booking.id,
                        adminNotes: notes,
                      });
                    }
                  }}
                  disabled={approveDispute.isPending}
                  className="rounded-lg bg-green-600 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-green-700 disabled:opacity-50"
                >
                  <CheckCircle className="h-4 w-4" />
                </button>
                <button
                  onClick={() => {
                    const notes = prompt("Admin notes (min 10 chars):");
                    if (notes && notes.length >= 10) {
                      rejectDispute.mutate({
                        bookingId: booking.id,
                        adminNotes: notes,
                      });
                    }
                  }}
                  disabled={rejectDispute.isPending}
                  className="rounded-lg bg-red-600 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-red-700 disabled:opacity-50"
                >
                  <XCircle className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
