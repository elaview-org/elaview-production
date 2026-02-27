"use client";

import { useState, useTransition } from "react";
import { IconLoader2 } from "@tabler/icons-react";
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
import {
  CampaignStatus,
  FragmentType,
  getFragmentData,
  graphql,
} from "@/types/gql";
import {
  submitCampaignAction,
  cancelCampaignAction,
} from "../campaigns.actions";

const ActionsBar_CampaignFragment = graphql(`
  fragment ActionsBar_CampaignFragment on Campaign {
    id
    status
  }
`);

type Props = {
  data: FragmentType<typeof ActionsBar_CampaignFragment>;
};

export default function ActionsBar({ data }: Props) {
  const campaign = getFragmentData(ActionsBar_CampaignFragment, data);
  const id = campaign.id as string;
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = () => {
    startTransition(async () => {
      const result = await submitCampaignAction(id);
      if (result.success) {
        toast.success("Campaign submitted for review");
      } else {
        toast.error(result.error ?? "Failed to submit campaign");
      }
    });
  };

  const handleCancelConfirm = () => {
    startTransition(async () => {
      const result = await cancelCampaignAction(id);
      setCancelDialogOpen(false);
      if (result.success) {
        toast.success("Campaign cancelled");
      } else {
        toast.error(result.error ?? "Failed to cancel campaign");
      }
    });
  };

  const renderActions = () => {
    switch (campaign.status) {
      case CampaignStatus.Draft:
        return (
          <Button onClick={handleSubmit} disabled={isPending}>
            {isPending && <IconLoader2 className="size-4 animate-spin" />}
            Submit for Review
          </Button>
        );

      case CampaignStatus.Submitted:
      case CampaignStatus.Active:
        return (
          <Button
            variant="destructive"
            onClick={() => setCancelDialogOpen(true)}
            disabled={isPending}
          >
            Cancel Campaign
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
            <DialogTitle>Cancel Campaign</DialogTitle>
            <DialogDescription>
              Are you sure you want to cancel this campaign? Active bookings may
              be affected.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setCancelDialogOpen(false)}
            >
              Keep Campaign
            </Button>
            <Button
              variant="destructive"
              onClick={handleCancelConfirm}
              disabled={isPending}
            >
              {isPending && <IconLoader2 className="size-4 animate-spin" />}
              Cancel Campaign
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
