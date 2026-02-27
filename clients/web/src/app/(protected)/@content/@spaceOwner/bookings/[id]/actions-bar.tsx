"use client";

import { useState, useTransition } from "react";
import { IconDownload, IconLoader2 } from "@tabler/icons-react";
import { toast } from "sonner";
import { Button } from "@/components/primitives/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/primitives/dialog";
import { Textarea } from "@/components/primitives/textarea";
import { BookingStatus } from "@/types/gql/graphql";
import {
  approveBookingAction,
  rejectBookingAction,
  markFileDownloadedAction,
  markInstalledAction,
} from "../bookings.actions";

type Props = {
  booking: {
    id: unknown;
    status: BookingStatus;
    campaign?: {
      imageUrl: string;
    } | null;
  };
};

export default function ActionsBar({ booking }: Props) {
  const id = booking.id as string;
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleApprove = () => {
    startTransition(async () => {
      const result = await approveBookingAction(id);
      if (result.success) {
        toast.success("Booking approved successfully");
      } else {
        toast.error(result.error ?? "Failed to approve booking");
      }
    });
  };

  const handleRejectConfirm = () => {
    if (!rejectReason.trim()) return;

    startTransition(async () => {
      const result = await rejectBookingAction(id, rejectReason.trim());
      setRejectDialogOpen(false);
      setRejectReason("");
      if (result.success) {
        toast.success("Booking rejected");
      } else {
        toast.error(result.error ?? "Failed to reject booking");
      }
    });
  };

  const handleDownloadFile = () => {
    if (booking.campaign?.imageUrl) {
      window.open(booking.campaign.imageUrl, "_blank");
    }
    startTransition(async () => {
      const result = await markFileDownloadedAction(id);
      if (result.success) {
        toast.success("File marked as downloaded");
      } else {
        toast.error(result.error ?? "Failed to mark file as downloaded");
      }
    });
  };

  const handleMarkInstalled = () => {
    startTransition(async () => {
      const result = await markInstalledAction(id);
      if (result.success) {
        toast.success("Marked as installed");
      } else {
        toast.error(result.error ?? "Failed to mark as installed");
      }
    });
  };

  const renderActions = () => {
    switch (booking.status) {
      case BookingStatus.PendingApproval:
        return (
          <>
            <Button
              variant="outline"
              onClick={() => setRejectDialogOpen(true)}
              disabled={isPending}
            >
              Reject
            </Button>
            <Button onClick={handleApprove} disabled={isPending}>
              {isPending && <IconLoader2 className="size-4 animate-spin" />}
              Accept Booking
            </Button>
          </>
        );

      case BookingStatus.Paid:
        return (
          <Button onClick={handleDownloadFile} disabled={isPending}>
            {isPending ? (
              <IconLoader2 className="size-4 animate-spin" />
            ) : (
              <IconDownload className="size-4" />
            )}
            Download Creative File
          </Button>
        );

      case BookingStatus.FileDownloaded:
        return (
          <Button onClick={handleMarkInstalled} disabled={isPending}>
            {isPending && <IconLoader2 className="size-4 animate-spin" />}
            Mark as Installed
          </Button>
        );

      default:
        return null;
    }
  };

  const actions = renderActions();

  if (!actions) return null;

  return (
    <>
      <div className="bg-background/80 fixed inset-x-0 bottom-0 z-10 border-t backdrop-blur-sm">
        <div className="container flex items-center justify-end gap-3 py-4">
          {actions}
        </div>
      </div>

      <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject booking?</DialogTitle>
            <DialogDescription>
              The advertiser will be notified of the rejection. Please provide a
              reason.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Reason for rejection..."
              rows={3}
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setRejectDialogOpen(false);
                setRejectReason("");
              }}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleRejectConfirm}
              disabled={!rejectReason.trim() || isPending}
            >
              {isPending && <IconLoader2 className="size-4 animate-spin" />}
              Reject Booking
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
