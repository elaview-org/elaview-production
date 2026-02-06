"use client";

import { useCallback, useState, useTransition } from "react";
import {
  IconCheck,
  IconCircleCheckFilled,
  IconClock,
  IconDownload,
  IconLoader,
  IconLoader2,
  IconMessage,
  IconPhotoCheck,
  IconX,
} from "@tabler/icons-react";
import { toast } from "sonner";
import TableView, {
  actionsColumn,
  badgeColumn,
  createSelectColumn,
  currencyColumn,
  dateRangeColumn,
  imageTextColumn,
  stackColumn,
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
import { Textarea } from "@/components/primitives/textarea";
import {
  BookingStatus,
  FragmentType,
  getFragmentData,
  graphql,
} from "@/types/gql";
import type { BookingsTable_BookingFragmentFragment } from "@/types/gql/graphql";
import { BOOKING_STATUS } from "@/lib/constants";
import { type FilterTabKey } from "../constants";
import {
  approveBookingAction,
  markFileDownloadedAction,
  markInstalledAction,
  rejectBookingAction,
} from "../bookings.actions";
import BulkActions from "./bulk-actions";
import ExportButton from "./export-button";
import Placeholder from "./placeholder";

export const BookingsTable_BookingFragment = graphql(`
  fragment BookingsTable_BookingFragment on Booking {
    id
    status
    startDate
    endDate
    ownerPayoutAmount
    space {
      title
      images
    }
    campaign {
      name
      imageUrl
      advertiserProfile {
        companyName
      }
    }
  }
`);

type Props = {
  data: FragmentType<typeof BookingsTable_BookingFragment>[];
  tabKey: FilterTabKey;
};

export default function BookingsTable({ data, tabKey }: Props) {
  const bookings = getFragmentData(BookingsTable_BookingFragment, data);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [tableKey, setTableKey] = useState(0);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [rejectBookingId, setRejectBookingId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleClearSelection = useCallback(() => {
    setSelectedIds([]);
    setTableKey((k) => k + 1);
  }, []);

  const handleApprove = (id: string) => {
    startTransition(async () => {
      const result = await approveBookingAction(id);
      if (result.success) {
        toast.success("Booking approved");
      } else {
        toast.error(result.error ?? "Failed to approve booking");
      }
    });
  };

  const handleRejectClick = (id: string) => {
    setRejectBookingId(id);
    setRejectDialogOpen(true);
  };

  const handleRejectConfirm = () => {
    if (!rejectBookingId || !rejectReason.trim()) return;

    startTransition(async () => {
      const result = await rejectBookingAction(
        rejectBookingId,
        rejectReason.trim()
      );
      setRejectDialogOpen(false);
      setRejectBookingId(null);
      setRejectReason("");
      if (result.success) {
        toast.success("Booking rejected");
      } else {
        toast.error(result.error ?? "Failed to reject booking");
      }
    });
  };

  const handleDownloadFile = (id: string, fileUrl?: string | null) => {
    if (fileUrl) {
      window.open(fileUrl, "_blank");
    }
    startTransition(async () => {
      const result = await markFileDownloadedAction(id);
      if (result.success) {
        toast.success("File marked as downloaded");
      } else {
        toast.error(result.error ?? "Failed to mark file as downloaded");
      }
    });
  };

  const handleMarkInstalled = (id: string) => {
    startTransition(async () => {
      const result = await markInstalledAction(id);
      if (result.success) {
        toast.success("Marked as installed");
      } else {
        toast.error(result.error ?? "Failed to mark as installed");
      }
    });
  };

  const columns = createColumns({
    onApprove: handleApprove,
    onReject: handleRejectClick,
    onDownloadFile: handleDownloadFile,
    onMarkInstalled: handleMarkInstalled,
  });

  return (
    <MaybePlaceholder data={data} placeholder={<Placeholder tabKey={tabKey} />}>
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between gap-4">
          <BulkActions
            selectedIds={selectedIds}
            onClearSelection={handleClearSelection}
          />
          <ExportButton bookings={bookings} />
        </div>
        <TableView
          key={tableKey}
          data={bookings}
          columns={columns}
          getRowId={(row) => row.id as string}
          onSelectionChange={setSelectedIds}
        />
      </div>

      <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject booking?</DialogTitle>
            <DialogDescription>
              The advertiser will be notified of the rejection. Please provide a
              reason.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Reason for rejection..."
              rows={3}
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setRejectDialogOpen(false);
                setRejectBookingId(null);
                setRejectReason("");
              }}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleRejectConfirm}
              disabled={!rejectReason.trim() || isPending}
            >
              {isPending && <IconLoader2 className="size-4 animate-spin" />}
              Reject
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </MaybePlaceholder>
  );
}

export function BookingsTableSkeleton() {
  const columns = createColumns({
    onApprove: () => {},
    onReject: () => {},
    onDownloadFile: () => {},
    onMarkInstalled: () => {},
  });
  return <TableViewSkeleton columns={columns} rows={5} />;
}

type BookingData = BookingsTable_BookingFragmentFragment;

function StatusIcon({ status }: { status: BookingStatus }) {
  switch (status) {
    case BookingStatus.Completed:
      return (
        <IconCircleCheckFilled className="fill-green-500 dark:fill-green-400" />
      );
    case BookingStatus.Verified:
      return <IconPhotoCheck className="text-green-500" />;
    case BookingStatus.Installed:
    case BookingStatus.FileDownloaded:
    case BookingStatus.Paid:
      return <IconLoader className="text-blue-500" />;
    case BookingStatus.PendingApproval:
      return <IconClock className="text-yellow-500" />;
    default:
      return <IconClock className="text-muted-foreground" />;
  }
}

type ColumnActions = {
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  onDownloadFile: (id: string, fileUrl?: string | null) => void;
  onMarkInstalled: (id: string) => void;
};

function createColumns(actions: ColumnActions) {
  return [
    createSelectColumn<BookingData>(),
    imageTextColumn<BookingData>({
      key: "space",
      header: "Space",
      image: (row) => row.space?.images[0],
      text: (row) => row.space?.title,
    }),
    stackColumn<BookingData>({
      key: "advertiser",
      header: "Advertiser",
      primary: (row) => row.campaign?.advertiserProfile?.companyName,
      secondary: (row) => row.campaign?.name,
    }),
    dateRangeColumn<BookingData>({
      key: "dates",
      header: "Dates",
      start: (row) => row.startDate as string,
      end: (row) => row.endDate as string,
    }),
    currencyColumn<BookingData>({
      key: "payout",
      header: "Payout",
      value: (row) => row.ownerPayoutAmount,
    }),
    badgeColumn<BookingData, BookingStatus>({
      key: "status",
      header: "Status",
      value: (row) => row.status,
      labels: BOOKING_STATUS.labels,
      icon: (status) => <StatusIcon status={status} />,
    }),
    actionsColumn<BookingData>({
      items: (row) => {
        const status = row.status;
        const id = row.id as string;
        const baseItems = [
          { label: "View Details", href: () => `/bookings/${id}` },
          {
            label: "Message",
            icon: <IconMessage className="mr-2 size-4" />,
            href: () => `/messages`,
          },
          { separator: true as const },
        ];

        if (status === BookingStatus.PendingApproval) {
          return [
            ...baseItems,
            {
              label: "Accept",
              icon: <IconCheck className="mr-2 size-4" />,
              onClick: () => actions.onApprove(id),
            },
            {
              label: "Reject",
              icon: <IconX className="mr-2 size-4" />,
              variant: "destructive" as const,
              onClick: () => actions.onReject(id),
            },
          ];
        }

        if (status === BookingStatus.Paid) {
          return [
            ...baseItems,
            {
              label: "Download File",
              icon: <IconDownload className="mr-2 size-4" />,
              onClick: () => actions.onDownloadFile(id, row.campaign?.imageUrl),
            },
          ];
        }

        if (status === BookingStatus.FileDownloaded) {
          return [
            ...baseItems,
            {
              label: "Mark Installed",
              onClick: () => actions.onMarkInstalled(id),
            },
          ];
        }

        return baseItems.slice(0, -1);
      },
    }),
  ];
}
