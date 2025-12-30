"use client";

import { api } from "../../../../../elaview-mvp/src/trpc/react";
import { DisputeCard } from "./DisputeCard";
import { CheckCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import type { Decimal } from "@prisma/client-runtime-utils";

interface DisputesListProps {
  initialBookings: Array<{
    id: string;
    totalAmount: Decimal;
    startDate: Date;
    endDate: Date;
    disputeType: string | null;
    disputeReason: string | null;
    disputedAt: Date | null;
    disputePhotos: string[];
    adminNotes: string | null;
    space: {
      title: string;
      owner: {
        id: string;
        name: string | null;
        email: string;
      };
    };
    campaign: {
      name: string;
      advertiser: {
        id: string;
        name: string | null;
        email: string;
      };
    };
    messages: Array<{
      attachments: string[];
    }>;
  }>;
}

export function DisputesList({ initialBookings }: DisputesListProps) {
  const router = useRouter();

  const approveDispute = api.admin.bookings.approveDisputedProof.useMutation({
    onSuccess: () => {
      router.refresh();
    },
  });

  const rejectDispute = api.admin.bookings.rejectDisputedProof.useMutation({
    onSuccess: () => {
      router.refresh();
    },
  });

  const isProcessing = approveDispute.isPending || rejectDispute.isPending;

  if (initialBookings.length === 0) {
    return (
      <div className="rounded-lg border border-slate-700 bg-slate-800 p-12 text-center">
        <CheckCircle className="mx-auto mb-3 h-12 w-12 text-green-400" />
        <h3 className="mb-2 text-lg font-medium text-white">No Disputes</h3>
        <p className="text-slate-400">
          All installations have been approved or resolved!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {initialBookings.map((booking) => (
        <DisputeCard
          key={booking.id}
          booking={booking}
          onApprove={(notes: string) => {
            approveDispute.mutate({
              bookingId: booking.id,
              adminNotes: notes,
            });
          }}
          onReject={(notes: string) => {
            rejectDispute.mutate({
              bookingId: booking.id,
              adminNotes: notes,
            });
          }}
          isProcessing={isProcessing}
        />
      ))}
    </div>
  );
}
