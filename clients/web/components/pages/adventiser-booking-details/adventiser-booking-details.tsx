"use client";

import { useState } from "react";
import { Button } from "@/components/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
} from "@/components/dialog";
import { Input } from "@/components/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/select";
import StatusTimeline from "./status-timeline";
import SpaceInfo from "./space-info";
import InstallationReviews from "./installation-review";
import PaymentSummary from "./payment-summary";

interface ModalProps {
  open: boolean;
  handleOpenChange: React.Dispatch<React.SetStateAction<boolean>>;
  body?: React.ReactNode;
  footer?: React.ReactNode;
  size?: "lg" | "sm";
}

function Modal({
  open,
  handleOpenChange,
  body,
  footer,
  size = "lg",
}: ModalProps) {
  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent size={size}>
        {body}
        {footer}
      </DialogContent>
    </Dialog>
  );
}

interface ConfirmModalProps {
  isOpen: boolean;
  handleOpenChange: React.Dispatch<React.SetStateAction<boolean>>;
  onConfirm?: () => void;
}

function ConfirmModal({
  isOpen,
  handleOpenChange,
  onConfirm,
}: ConfirmModalProps) {
  const handleConfirm = () => {
    onConfirm?.();
    handleOpenChange(false);
  };

  const handleCancel = () => {
    handleOpenChange(false);
  };

  const body = (
    <>
      <DialogHeader>Approve Installation?</DialogHeader>
      <DialogDescription>
        Please confirm installation is correct.
      </DialogDescription>
    </>
  );

  const footer = (
    <div className="flex w-full justify-between">
      <Button variant="outline" onClick={handleCancel}>
        Cancel
      </Button>
      <Button onClick={handleConfirm}>Confirm Approval</Button>
    </div>
  );

  return (
    <Modal
      open={isOpen}
      handleOpenChange={handleOpenChange}
      body={body}
      footer={footer}
    />
  );
}

interface DisputeModalProps {
  isOpen: boolean;
  handleOpenChange: React.Dispatch<React.SetStateAction<boolean>>;
  onSubmit?: (reason: string, details?: string) => void;
}

function DisputeModal({
  isOpen,
  handleOpenChange,
  onSubmit,
}: DisputeModalProps) {
  const [reason, setReason] = useState("");
  const [details, setDetails] = useState("");

  const handleSubmit = () => {
    onSubmit?.(reason, details);
    handleOpenChange(false);
    setReason("");
    setDetails("");
  };

  const handleCancel = () => {
    handleOpenChange(false);
    setReason("");
    setDetails("");
  };

  const body = (
    <div className="space-y-4">
      <div className="text-xl font-semibold">Open a Dispute</div>
      <p className="text-muted-foreground text-sm">
        Something not right? Opening a dispute will pause approval.
      </p>
      <div className="space-y-2">
        <label className="text-sm font-medium">Reason</label>
        <Select value={reason} onValueChange={setReason}>
          <SelectTrigger>
            <SelectValue placeholder="Select a reason" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="installation-issue">
              Installation Issue
            </SelectItem>
            <SelectItem value="quality-issue">Quality Issue</SelectItem>
            <SelectItem value="location-issue">Location Issue</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">Details (optional)</label>
        <textarea
          className="border-input placeholder:text-muted-foreground focus-visible:ring-ring/50 min-h-[80px] w-full rounded-md border bg-transparent px-3 py-2 text-sm shadow-xs focus-visible:ring-[3px] focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
          placeholder="Provide additional details"
          value={details}
          onChange={(e) => setDetails(e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">Add Photo (optional)</label>
        <Input type="file" accept="image/*" />
      </div>
    </div>
  );

  const footer = (
    <div className="flex justify-end gap-2">
      <Button variant="outline" onClick={handleCancel}>
        Cancel
      </Button>
      <Button onClick={handleSubmit} disabled={!reason}>
        Submit Dispute
      </Button>
    </div>
  );

  return (
    <Modal
      open={isOpen}
      handleOpenChange={handleOpenChange}
      body={body}
      footer={footer}
      size="sm"
    />
  );
}

interface BookingDetailsPageProps {
  bookingId?: string;
}

function BookingDetailsPage({ bookingId }: BookingDetailsPageProps) {
  const [openConfirmModal, setOpenConfirmModal] = useState(false);
  const [openDisputeModal, setOpenDisputeModal] = useState(false);

  const handleApproveInstallation = () => {
    // TODO: Implement approval logic with bookingId
    console.log("Approving installation for booking:", bookingId);
  };

  const handleSubmitDispute = (reason: string, details?: string) => {
    // TODO: Implement dispute submission logic with bookingId
    console.log("Submitting dispute for booking:", bookingId, {
      reason,
      details,
    });
  };

  return (
    <div className="space-y-4 p-2">
      <StatusTimeline />
      <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2">
        <div className="flex flex-col gap-4">
          <SpaceInfo />
          <InstallationReviews />
        </div>
        <div className="flex flex-col gap-4">
          <PaymentSummary />
          <div className="flex flex-col gap-2">
            <Button onClick={() => setOpenConfirmModal(true)}>
              Approve Installation
            </Button>
            <Button variant="outline" onClick={() => setOpenDisputeModal(true)}>
              Open Dispute
            </Button>
          </div>
        </div>
      </div>
      <ConfirmModal
        isOpen={openConfirmModal}
        handleOpenChange={setOpenConfirmModal}
        onConfirm={handleApproveInstallation}
      />
      <DisputeModal
        isOpen={openDisputeModal}
        handleOpenChange={setOpenDisputeModal}
        onSubmit={handleSubmitDispute}
      />
    </div>
  );
}

export default BookingDetailsPage;
