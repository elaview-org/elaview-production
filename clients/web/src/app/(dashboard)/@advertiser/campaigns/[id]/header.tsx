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
import { CAMPAIGN_STATUS } from "@/lib/core/constants";
import {
  FragmentType,
  getFragmentData,
  graphql,
  CampaignStatus,
} from "@/types/gql";
import {
  IconChevronLeft,
  IconDots,
  IconLoader2,
  IconSend,
  IconX,
  IconTrash,
} from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import {
  submitCampaignAction,
  cancelCampaignAction,
  deleteCampaignAction,
} from "../campaigns.actions";
import { toast } from "sonner";

const Header_CampaignFragment = graphql(`
  fragment Header_CampaignFragment on Campaign {
    id
    name
    status
  }
`);

type Props = {
  data: FragmentType<typeof Header_CampaignFragment>;
};

export default function Header({ data }: Props) {
  const router = useRouter();
  const campaign = getFragmentData(Header_CampaignFragment, data);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState("");
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [pending, startTransition] = useTransition();

  const handleSubmit = () => {
    startTransition(async () => {
      const result = await submitCampaignAction(campaign.id);
      if (result.success) {
        toast.success("Campaign submitted for review");
      } else {
        toast.error(result.error ?? "Failed to submit campaign");
      }
    });
  };

  const handleCancel = () => {
    startTransition(async () => {
      const result = await cancelCampaignAction(campaign.id);
      setShowCancelDialog(false);
      if (result.success) {
        toast.success("Campaign cancelled");
      } else {
        toast.error(result.error ?? "Failed to cancel campaign");
      }
    });
  };

  const handleDelete = () => {
    if (deleteConfirmation !== campaign.name) return;

    startTransition(async () => {
      const result = await deleteCampaignAction(campaign.id);
      if (!result.success) {
        toast.error(result.error ?? "Failed to delete campaign");
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
        <h1 className="text-2xl font-semibold">{campaign.name}</h1>
        <Badge variant={CAMPAIGN_STATUS.variants[campaign.status]}>
          {CAMPAIGN_STATUS.labels[campaign.status]}
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
              {campaign.status === CampaignStatus.Draft && (
                <>
                  <DropdownMenuItem onClick={handleSubmit}>
                    <IconSend className="size-4" />
                    Submit for Review
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => setShowDeleteDialog(true)}
                    className="text-destructive focus:text-destructive"
                  >
                    <IconTrash className="size-4" />
                    Delete Campaign
                  </DropdownMenuItem>
                </>
              )}
              {(campaign.status === CampaignStatus.Submitted ||
                campaign.status === CampaignStatus.Active) && (
                <DropdownMenuItem
                  onClick={() => setShowCancelDialog(true)}
                  className="text-destructive focus:text-destructive"
                >
                  <IconX className="size-4" />
                  Cancel Campaign
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Campaign</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete your
              campaign and all associated data.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <p className="text-sm">
              Type <span className="font-semibold">{campaign.name}</span> to
              confirm deletion:
            </p>
            <Input
              value={deleteConfirmation}
              onChange={(e) => setDeleteConfirmation(e.target.value)}
              placeholder="Enter campaign name to confirm"
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
              disabled={deleteConfirmation !== campaign.name || pending}
            >
              {pending && <IconLoader2 className="size-4 animate-spin" />}
              Delete Campaign
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancel Campaign</DialogTitle>
            <DialogDescription>
              Are you sure you want to cancel this campaign? Active bookings may
              be affected.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowCancelDialog(false)}
            >
              Keep Campaign
            </Button>
            <Button
              variant="destructive"
              onClick={handleCancel}
              disabled={pending}
            >
              {pending && <IconLoader2 className="size-4 animate-spin" />}
              Cancel Campaign
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
