"use client";

import { Button } from "@/components/primitives/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
} from "@/components/primitives/dialog";

interface ConfirmModalProps {
  isOpen: boolean;
  handleOpenChange: React.Dispatch<React.SetStateAction<boolean>>;
  onConfirm?: () => void;
}

export default function ConfirmModal({
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

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>Approve Installation?</DialogHeader>
        <DialogDescription>
          Please confirm installation is correct.
        </DialogDescription>
        <div className="mt-4 flex w-full justify-between">
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button onClick={handleConfirm}>Confirm Approval</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
