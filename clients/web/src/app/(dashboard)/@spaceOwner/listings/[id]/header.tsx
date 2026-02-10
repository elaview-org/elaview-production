"use client";

import { useState, useTransition } from "react";
import { Badge } from "@/components/primitives/badge";
import { Button } from "@/components/primitives/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/primitives/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/primitives/dropdown-menu";
import { Input } from "@/components/primitives/input";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/primitives/tooltip";
import { SPACE_STATUS } from "@/lib/core/constants";
import {
  FragmentType,
  getFragmentData,
  graphql,
  SpaceStatus,
} from "@/types/gql";
import {
  IconChevronLeft,
  IconDots,
  IconLoader2,
  IconPlayerPlay,
  IconPlayerPause,
  IconTrash,
} from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import {
  deactivateSpaceAction,
  reactivateSpaceAction,
  deleteSpaceAction,
} from "../listings.actions";
import { toast } from "sonner";

const Header_SpaceFragment = graphql(`
  fragment Header_SpaceFragment on Space {
    id
    title
    status
  }
`);

type Props = {
  data: FragmentType<typeof Header_SpaceFragment>;
};

export default function Header({ data }: Props) {
  const router = useRouter();
  const space = getFragmentData(Header_SpaceFragment, data);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState("");
  const [pending, startTransition] = useTransition();

  const handleDeactivate = () => {
    startTransition(async () => {
      const result = await deactivateSpaceAction(space.id);
      if (result.success) {
        toast.success("Space deactivated");
      } else {
        toast.error(result.error ?? "Failed to deactivate space");
      }
    });
  };

  const handleReactivate = () => {
    startTransition(async () => {
      const result = await reactivateSpaceAction(space.id);
      if (result.success) {
        toast.success("Space reactivated");
      } else {
        toast.error(result.error ?? "Failed to reactivate space");
      }
    });
  };

  const handleDelete = () => {
    if (deleteConfirmation !== space.title) return;

    startTransition(async () => {
      const result = await deleteSpaceAction(space.id);
      if (!result.success) {
        toast.error(result.error ?? "Failed to delete space");
      }
    });
  };

  return (
    <>
      <div className="flex items-center gap-4">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" onClick={() => router.back()}>
              <IconChevronLeft className="size-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom">Go back</TooltipContent>
        </Tooltip>
        <h1 className="text-2xl font-semibold">{space.title}</h1>
        <Badge variant={SPACE_STATUS.variants[space.status]}>
          {SPACE_STATUS.labels[space.status]}
        </Badge>
        <div className="ml-auto">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" disabled={pending}>
                {pending ? (
                  <IconLoader2 className="size-4 animate-spin" />
                ) : (
                  <IconDots className="size-4" />
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {space.status === SpaceStatus.Active && (
                <DropdownMenuItem onClick={handleDeactivate}>
                  <IconPlayerPause className="size-4" />
                  Deactivate
                </DropdownMenuItem>
              )}
              {space.status === SpaceStatus.Inactive && (
                <DropdownMenuItem onClick={handleReactivate}>
                  <IconPlayerPlay className="size-4" />
                  Reactivate
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => setShowDeleteDialog(true)}
                className="text-destructive focus:text-destructive"
              >
                <IconTrash className="size-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Space</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete your
              space and all associated data.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <p className="text-sm">
              Type <span className="font-semibold">{space.title}</span> to
              confirm deletion:
            </p>
            <Input
              value={deleteConfirmation}
              onChange={(e) => setDeleteConfirmation(e.target.value)}
              placeholder="Enter space title to confirm"
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowDeleteDialog(false);
                setDeleteConfirmation("");
              }}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleteConfirmation !== space.title || pending}
            >
              {pending && <IconLoader2 className="size-4 animate-spin" />}
              Delete Space
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
