"use client";

import { useState, useTransition } from "react";
import { IconAlertTriangle, IconLoader2 } from "@tabler/icons-react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/primitives/select";
import { BookingStatus, type DisputeIssueType } from "@/types/gql/graphql";
import {
  cancelBookingAction,
  approveProofAction,
  disputeProofAction,
} from "../bookings.actions";

type Props = {
  booking: {
    id: unknown;
    status: BookingStatus;
  };
};

export default function ActionsBar({ booking }: Props) {
  const id = booking.id as string;
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [disputeDialogOpen, setDisputeDialogOpen] = useState(false);
  const [disputeIssueType, setDisputeIssueType] = useState<
    DisputeIssueType | ""
  >("");
  const [disputeReason, setDisputeReason] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleApproveProof = () => {
    startTransition(async () => {
      const result = await approveProofAction(id);
      if (result.success) {
        toast.success("Installation approved");
      } else {
        toast.error(result.error ?? "Failed to approve installation");
      }
    });
  };

  const handleCancelConfirm = () => {
    if (!cancelReason.trim()) return;

    startTransition(async () => {
      const result = await cancelBookingAction(id, cancelReason.trim());
      setCancelDialogOpen(false);
      setCancelReason("");
      if (result.success) {
        toast.success("Booking cancelled");
      } else {
        toast.error(result.error ?? "Failed to cancel booking");
      }
    });
  };

  const handleDisputeConfirm = () => {
    if (!disputeIssueType || !disputeReason.trim()) return;

    startTransition(async () => {
      const result = await disputeProofAction(
        id,
        disputeIssueType,
        disputeReason.trim()
      );
      setDisputeDialogOpen(false);
      setDisputeIssueType("");
      setDisputeReason("");
      if (result.success) {
        toast.success("Dispute submitted");
      } else {
        toast.error(result.error ?? "Failed to submit dispute");
      }
    });
  };

  const renderActions = () => {
    switch (booking.status) {
      case BookingStatus.Verified:
        return (
          <>
            <Button
              variant="outline"
              onClick={() => setDisputeDialogOpen(true)}
              disabled={isPending}
            >
              <IconAlertTriangle className="size-4" />
              Open Dispute
            </Button>
            <Button onClick={handleApproveProof} disabled={isPending}>
              {isPending && <IconLoader2 className="size-4 animate-spin" />}
              Approve Installation
            </Button>
          </>
        );

      case BookingStatus.PendingApproval:
        return (
          <Button
            variant="destructive"
            onClick={() => setCancelDialogOpen(true)}
            disabled={isPending}
          >
            Cancel Request
          </Button>
        );

      case BookingStatus.Approved:
        return (
          <Button
            variant="destructive"
            onClick={() => setCancelDialogOpen(true)}
            disabled={isPending}
          >
            Cancel Booking
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

      <Dialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancel booking?</DialogTitle>
            <DialogDescription>
              The space owner will be notified. Please provide a reason.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Textarea
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              placeholder="Reason for cancellation..."
              rows={3}
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setCancelDialogOpen(false);
                setCancelReason("");
              }}
            >
              Keep Booking
            </Button>
            <Button
              variant="destructive"
              onClick={handleCancelConfirm}
              disabled={!cancelReason.trim() || isPending}
            >
              {isPending && <IconLoader2 className="size-4 animate-spin" />}
              Cancel Booking
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={disputeDialogOpen} onOpenChange={setDisputeDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Open a Dispute</DialogTitle>
            <DialogDescription>
              Something not right with the installation? Opening a dispute will
              pause auto-approval.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4 py-4">
            <Select
              value={disputeIssueType}
              onValueChange={(v) => setDisputeIssueType(v as DisputeIssueType)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select issue type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="POOR_QUALITY">Poor Quality</SelectItem>
                <SelectItem value="WRONG_LOCATION">Wrong Location</SelectItem>
                <SelectItem value="NOT_VISIBLE">Not Visible</SelectItem>
                <SelectItem value="DAMAGE_TO_CREATIVE">
                  Damage to Creative
                </SelectItem>
                <SelectItem value="MISLEADING_LISTING">
                  Misleading Listing
                </SelectItem>
                <SelectItem value="SAFETY_ISSUE">Safety Issue</SelectItem>
              </SelectContent>
            </Select>
            <Textarea
              value={disputeReason}
              onChange={(e) => setDisputeReason(e.target.value)}
              placeholder="Describe the issue..."
              rows={3}
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setDisputeDialogOpen(false);
                setDisputeIssueType("");
                setDisputeReason("");
              }}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDisputeConfirm}
              disabled={!disputeIssueType || !disputeReason.trim() || isPending}
            >
              {isPending && <IconLoader2 className="size-4 animate-spin" />}
              Submit Dispute
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
