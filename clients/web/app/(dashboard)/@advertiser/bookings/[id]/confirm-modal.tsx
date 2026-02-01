"use client";

import { Button } from "@/components/primitives/button";
import Modal from "@/components/composed/modal";

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
    <Modal
      open={isOpen}
      onOpenChange={handleOpenChange}
      title="Approve Installation?"
      description="Please confirm installation is correct."
    >
      <div className="mt-4 flex w-full justify-between">
        <Button variant="outline" onClick={handleCancel}>
          Cancel
        </Button>
        <Button onClick={handleConfirm}>Confirm Approval</Button>
      </div>
    </Modal>
  );
}
