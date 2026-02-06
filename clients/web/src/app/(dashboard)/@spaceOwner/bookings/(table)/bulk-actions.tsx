"use client";

import { useState, useTransition } from "react";
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
import { IconCheck, IconLoader2, IconX } from "@tabler/icons-react";
import { toast } from "sonner";
import {
  bulkApproveBookingsAction,
  bulkRejectBookingsAction,
} from "../bookings.actions";

type Props = {
  selectedIds: string[];
  onClearSelection: () => void;
};

export default function BulkActions({ selectedIds, onClearSelection }: Props) {
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [isPending, startTransition] = useTransition();

  const count = selectedIds.length;

  const handleApprove = () => {
    startTransition(async () => {
      const result = await bulkApproveBookingsAction(selectedIds);
      if (result.success) {
        toast.success(`Approved ${result.successCount} bookings`);
        onClearSelection();
      } else if (result.successCount > 0) {
        toast.success(
          `Approved ${result.successCount} bookings, ${result.failedCount} failed`
        );
        onClearSelection();
      } else {
        toast.error("Failed to approve bookings");
      }
    });
  };

  const handleReject = () => {
    if (!rejectReason.trim()) {
      toast.error("Please provide a reason for rejection");
      return;
    }

    startTransition(async () => {
      const result = await bulkRejectBookingsAction(
        selectedIds,
        rejectReason.trim()
      );
      setRejectDialogOpen(false);
      setRejectReason("");
      if (result.success) {
        toast.success(`Rejected ${result.successCount} bookings`);
        onClearSelection();
      } else if (result.successCount > 0) {
        toast.success(
          `Rejected ${result.successCount} bookings, ${result.failedCount} failed`
        );
        onClearSelection();
      } else {
        toast.error("Failed to reject bookings");
      }
    });
  };

  if (count === 0) return null;

  return (
    <>
      <div className="bg-muted/50 flex items-center gap-3 rounded-lg border px-4 py-2">
        <span className="text-sm font-medium">
          {count} {count === 1 ? "booking" : "bookings"} selected
        </span>
        <div className="bg-border h-4 w-px" />
        <Button
          variant="outline"
          size="sm"
          onClick={handleApprove}
          disabled={isPending}
        >
          {isPending ? (
            <IconLoader2 className="size-4 animate-spin" />
          ) : (
            <IconCheck className="size-4" />
          )}
          Accept
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setRejectDialogOpen(true)}
          disabled={isPending}
          className="text-destructive hover:text-destructive"
        >
          <IconX className="size-4" />
          Reject
        </Button>
        <div className="flex-1" />
        <Button
          variant="ghost"
          size="sm"
          onClick={onClearSelection}
          disabled={isPending}
        >
          <IconX className="size-4" />
          Clear
        </Button>
      </div>

      <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject {count} bookings?</DialogTitle>
            <DialogDescription>
              The advertisers will be notified of the rejection. Please provide
              a reason for rejecting these booking requests.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-2 py-4">
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
              onClick={handleReject}
              disabled={!rejectReason.trim() || isPending}
            >
              {isPending && <IconLoader2 className="size-4 animate-spin" />}
              Reject {count} bookings
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
