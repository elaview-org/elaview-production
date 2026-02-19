"use client";

import { useState } from "react";
import { Button } from "@/components/primitives/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/primitives/dialog";
import { Input } from "@/components/primitives/input";
import {
  IconLoader2,
  IconToggleLeft,
  IconTrash,
  IconX,
} from "@tabler/icons-react";
import { toast } from "sonner";
import api from "@/api/client";

type Props = {
  selectedIds: string[];
  onClearSelection: () => void;
};

export default function BulkActions({ selectedIds, onClearSelection }: Props) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const { bulkDeactivate, isPending: isDeactivatePending } =
    api.listings.useBulkDeactivateSpaces();
  const { bulkDelete, isPending: isDeletePending } =
    api.listings.useBulkDeleteSpaces();
  const isPending = isDeactivatePending || isDeletePending;

  const count = selectedIds.length;
  const confirmValue = count.toString();
  const isConfirmValid = confirmText === confirmValue;

  const handleDeactivate = () => {
    bulkDeactivate(selectedIds, (result) => {
      if (result.success) {
        toast.success(`Deactivated ${result.successCount} spaces`);
        onClearSelection();
      } else if (result.successCount > 0) {
        toast.success(
          `Deactivated ${result.successCount} spaces, ${result.failedCount} failed`
        );
        onClearSelection();
      } else {
        toast.error("Failed to deactivate spaces");
      }
    });
  };

  const handleDelete = () => {
    bulkDelete(selectedIds, (result) => {
      setDeleteDialogOpen(false);
      setConfirmText("");
      if (result.success) {
        toast.success(`Deleted ${result.successCount} spaces`);
        onClearSelection();
      } else if (result.successCount > 0) {
        toast.success(
          `Deleted ${result.successCount} spaces, ${result.failedCount} failed`
        );
        onClearSelection();
      } else {
        toast.error("Failed to delete spaces");
      }
    });
  };

  if (count === 0) return null;

  return (
    <>
      <div className="bg-muted/50 flex items-center gap-3 rounded-lg border px-4 py-2">
        <span className="text-sm font-medium">
          {count} {count === 1 ? "space" : "spaces"} selected
        </span>
        <div className="bg-border h-4 w-px" />
        <Button
          variant="outline"
          size="sm"
          onClick={handleDeactivate}
          disabled={isPending}
        >
          {isPending ? (
            <IconLoader2 className="size-4 animate-spin" />
          ) : (
            <IconToggleLeft className="size-4" />
          )}
          Deactivate
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setDeleteDialogOpen(true)}
          disabled={isPending}
          className="text-destructive hover:text-destructive"
        >
          <IconTrash className="size-4" />
          Delete
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

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete {count} spaces?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. All selected spaces will be
              permanently deleted along with their bookings and reviews.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-2 py-4">
            <p className="text-sm">
              Type <span className="font-mono font-bold">{confirmValue}</span>{" "}
              to confirm deletion:
            </p>
            <Input
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder={confirmValue}
              autoComplete="off"
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setDeleteDialogOpen(false);
                setConfirmText("");
              }}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={!isConfirmValid || isPending}
            >
              {isPending && <IconLoader2 className="size-4 animate-spin" />}
              Delete {count} spaces
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
