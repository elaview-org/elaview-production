"use client";

import { useState, useTransition } from "react";
import {
  IconCircleCheckFilled,
  IconClock,
  IconEdit,
  IconLoader2,
  IconPlayerPlay,
  IconSend,
} from "@tabler/icons-react";
import { toast } from "sonner";
import TableView, {
  actionsColumn,
  badgeColumn,
  createSelectColumn,
  currencyColumn,
  dateRangeColumn,
  imageTextColumn,
  numberColumn,
  TableViewSkeleton,
} from "@/components/composed/table-view";
import MaybePlaceholder from "@/components/status/maybe-placeholder";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/primitives/dialog";
import { Button } from "@/components/primitives/button";
import { Input } from "@/components/primitives/input";
import {
  CampaignStatus,
  FragmentType,
  getFragmentData,
  graphql,
} from "@/types/gql";
import type { CampaignsTable_CampaignFragmentFragment } from "@/types/gql/graphql";
import { CAMPAIGN_STATUS } from "@/lib/core/constants";
import { type FilterTabKey } from "../constants";
import {
  submitCampaignAction,
  cancelCampaignAction,
  deleteCampaignAction,
} from "../campaigns.actions";
import Placeholder from "./placeholder";

export const CampaignsTable_CampaignFragment = graphql(`
  fragment CampaignsTable_CampaignFragment on Campaign {
    id
    name
    description
    status
    startDate
    endDate
    totalBudget
    imageUrl
    bookings {
      nodes {
        id
      }
    }
  }
`);

type Props = {
  data: FragmentType<typeof CampaignsTable_CampaignFragment>[];
  tabKey: FilterTabKey;
};

export default function CampaignsTable({ data, tabKey }: Props) {
  const campaigns = getFragmentData(CampaignsTable_CampaignFragment, data);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteCampaignId, setDeleteCampaignId] = useState<string | null>(null);
  const [deleteCampaignName, setDeleteCampaignName] = useState("");
  const [deleteConfirmation, setDeleteConfirmation] = useState("");
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [cancelCampaignId, setCancelCampaignId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (id: string) => {
    startTransition(async () => {
      const result = await submitCampaignAction(id);
      if (result.success) {
        toast.success("Campaign submitted for review");
      } else {
        toast.error(result.error ?? "Failed to submit campaign");
      }
    });
  };

  const handleDeleteClick = (id: string, name: string) => {
    setDeleteCampaignId(id);
    setDeleteCampaignName(name);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (!deleteCampaignId || deleteConfirmation !== deleteCampaignName) return;

    startTransition(async () => {
      const result = await deleteCampaignAction(deleteCampaignId);
      setDeleteDialogOpen(false);
      setDeleteCampaignId(null);
      setDeleteCampaignName("");
      setDeleteConfirmation("");
      if (!result.success) {
        toast.error(result.error ?? "Failed to delete campaign");
      }
    });
  };

  const handleCancelClick = (id: string) => {
    setCancelCampaignId(id);
    setCancelDialogOpen(true);
  };

  const handleCancelConfirm = () => {
    if (!cancelCampaignId) return;

    startTransition(async () => {
      const result = await cancelCampaignAction(cancelCampaignId);
      setCancelDialogOpen(false);
      setCancelCampaignId(null);
      if (result.success) {
        toast.success("Campaign cancelled");
      } else {
        toast.error(result.error ?? "Failed to cancel campaign");
      }
    });
  };

  const columns = createColumns({
    onSubmit: handleSubmit,
    onDelete: handleDeleteClick,
    onCancel: handleCancelClick,
  });

  return (
    <MaybePlaceholder data={data} placeholder={<Placeholder tabKey={tabKey} />}>
      <TableView
        data={campaigns}
        columns={columns}
        getRowId={(row) => row.id as string}
      />

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Campaign</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete your
              campaign.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <p className="text-sm">
              Type <span className="font-semibold">{deleteCampaignName}</span>{" "}
              to confirm deletion:
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
                setDeleteDialogOpen(false);
                setDeleteCampaignId(null);
                setDeleteCampaignName("");
                setDeleteConfirmation("");
              }}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteConfirm}
              disabled={deleteConfirmation !== deleteCampaignName || isPending}
            >
              {isPending && <IconLoader2 className="size-4 animate-spin" />}
              Delete Campaign
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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
              onClick={() => {
                setCancelDialogOpen(false);
                setCancelCampaignId(null);
              }}
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
    </MaybePlaceholder>
  );
}

export function CampaignsTableSkeleton() {
  const columns = createColumns({
    onSubmit: () => {},
    onDelete: () => {},
    onCancel: () => {},
  });
  return <TableViewSkeleton columns={columns} rows={5} />;
}

type CampaignData = CampaignsTable_CampaignFragmentFragment;

function StatusIcon({ status }: { status: CampaignStatus }) {
  switch (status) {
    case CampaignStatus.Completed:
      return (
        <IconCircleCheckFilled className="fill-green-500 dark:fill-green-400" />
      );
    case CampaignStatus.Active:
      return <IconPlayerPlay className="text-green-500" />;
    case CampaignStatus.Submitted:
      return <IconSend className="text-blue-500" />;
    case CampaignStatus.Draft:
      return <IconEdit className="text-muted-foreground" />;
    default:
      return <IconClock className="text-muted-foreground" />;
  }
}

type ColumnActions = {
  onSubmit: (id: string) => void;
  onDelete: (id: string, name: string) => void;
  onCancel: (id: string) => void;
};

function createColumns(actions: ColumnActions) {
  return [
    createSelectColumn<CampaignData>(),
    imageTextColumn<CampaignData>({
      key: "campaign",
      header: "Campaign",
      image: (row) => row.imageUrl,
      text: (row) => row.name,
    }),
    dateRangeColumn<CampaignData>({
      key: "duration",
      header: "Duration",
      start: (row) => row.startDate as string,
      end: (row) => row.endDate as string,
    }),
    currencyColumn<CampaignData>({
      key: "budget",
      header: "Budget",
      value: (row) => row.totalBudget,
    }),
    numberColumn<CampaignData>({
      key: "bookings",
      header: "Bookings",
      value: (row) => row.bookings?.nodes?.length ?? 0,
    }),
    badgeColumn<CampaignData, CampaignStatus>({
      key: "status",
      header: "Status",
      value: (row) => row.status,
      labels: CAMPAIGN_STATUS.labels,
      icon: (status) => <StatusIcon status={status} />,
    }),
    actionsColumn<CampaignData>({
      items: (row) => {
        const status = row.status;
        const id = row.id as string;
        const baseItems = [
          { label: "View Details", href: () => `/campaigns/${id}` },
          { separator: true as const },
        ];

        if (status === CampaignStatus.Draft) {
          return [
            ...baseItems,
            {
              label: "Edit Campaign",
              href: () => `/campaigns/${id}`,
            },
            {
              label: "Submit for Review",
              onClick: () => actions.onSubmit(id),
            },
            {
              label: "Delete",
              variant: "destructive" as const,
              onClick: () => actions.onDelete(id, row.name),
            },
          ];
        }

        if (status === CampaignStatus.Submitted) {
          return [
            ...baseItems,
            {
              label: "Cancel Campaign",
              variant: "destructive" as const,
              onClick: () => actions.onCancel(id),
            },
          ];
        }

        if (status === CampaignStatus.Active) {
          return [
            ...baseItems,
            {
              label: "Cancel Campaign",
              variant: "destructive" as const,
              onClick: () => actions.onCancel(id),
            },
          ];
        }

        return baseItems.slice(0, -1);
      },
    }),
  ];
}
