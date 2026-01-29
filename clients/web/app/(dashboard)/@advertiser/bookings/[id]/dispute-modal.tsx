"use client";

import { useState } from "react";
import { Input } from "@/components/primitives/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/primitives/select";
import { Button } from "@/components/primitives/button";
import { Dialog, DialogContent } from "@/components/primitives/dialog";

interface DisputeModalProps {
  isOpen: boolean;
  handleOpenChange: React.Dispatch<React.SetStateAction<boolean>>;
  onSubmit?: (reason: string, details?: string) => void;
}

export default function DisputeModal({
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
          className="border-input placeholder:text-muted-foreground focus-visible:ring-ring/50 min-h-20 w-full rounded-md border bg-transparent px-3 py-2 text-sm shadow-xs focus-visible:ring-[3px] focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
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
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent size="sm">
        {body}
        {footer}
      </DialogContent>
    </Dialog>
  );
}
