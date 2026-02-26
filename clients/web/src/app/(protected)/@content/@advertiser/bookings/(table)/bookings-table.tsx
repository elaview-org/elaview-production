"use client";

import { useState, useCallback, useTransition } from "react";
import {
  IconCircleCheckFilled,
  IconClock,
  IconCreditCard,
  IconAlertTriangle,
  IconCheck,
  IconX,
  IconLoader,
  IconLoader2,
  IconMessage,
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
import { Button } from "@/components/primitives/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/primitives/dialog";
import { Textarea } from "@/components/primitives/textarea";
import {
  BookingStatus,
  FragmentType,
  getFragmentData,
  graphql,
} from "@/types/gql";
import type { BookingsTable_AdvertiserBookingFragmentFragment } from "@/types/gql/graphql";
import { BOOKING_STATUS } from "@/lib/core/constants";
import { type FilterTabKey } from "../constants";
import { cancelBookingAction, approveProofAction } from "../bookings.actions";
import Placeholder from "./placeholder";
import ExportButton from "./export-button";

export const BookingsTable_AdvertiserBookingFragment = graphql(`
  fragment BookingsTable_AdvertiserBookingFragment on Booking {
    id
    status
    startDate
    endDate
    totalAmount
    space {
      title
      images
      city
      state
      owner {
        businessName
      }
    }
    campaign {
      name
    }
  }
`);

type Props = {
  data: FragmentType<typeof BookingsTable_AdvertiserBookingFragment>[];
  tabKey: FilterTabKey;
};

export default function BookingsTable({ data, tabKey }: Props) {
  const bookings = getFragmentData(
    BookingsTable_AdvertiserBookingFragment,
    data
  );

  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [cancelBookingId, setCancelBookingId] = useState<string | null>(null);
  const [cancelReason, setCancelReason] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleCancelClick = useCallback((id: string) => {
    setCancelBookingId(id);
    setCancelDialogOpen(true);
  }, []);

  const handleCancelConfirm = () => {
    if (!cancelBookingId || !cancelReason.trim()) return;

    startTransition(async () => {
      const result = await cancelBookingAction(
        cancelBookingId,
        cancelReason.trim()
      );
      setCancelDialogOpen(false);
      setCancelBookingId(null);
      setCancelReason("");
      if (result.success) {
        toast.success("Booking cancelled");
      } else {
        toast.error(result.error ?? "Failed to cancel booking");
      }
    });
  };

  const handleApproveProof = useCallback(
    (id: string) => {
      startTransition(async () => {
        const result = await approveProofAction(id);
        if (result.success) {
          toast.success("Installation approved");
        } else {
          toast.error(result.error ?? "Failed to approve installation");
        }
      });
    },
    [startTransition]
  );

  const columns = createColumns({
    onCancel: handleCancelClick,
    onApproveProof: handleApproveProof,
  });

  return (
    <MaybePlaceholder data={data} placeholder={<Placeholder tabKey={tabKey} />}>
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-end gap-4">
          <ExportButton bookings={bookings} />
        </div>
        <TableView
          data={bookings}
          columns={columns}
          getRowId={(row) => row.id as string}
        />
      </div>

      <Dialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancel booking?</DialogTitle>
            <DialogDescription>
              The space owner will be notified. Please provide a reason.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Textarea
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              placeholder="Reason for cancellation..."
              rows={3}
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setCancelDialogOpen(false);
                setCancelBookingId(null);
                setCancelReason("");
              }}
            >
              Keep Booking
            </Button>
            <Button
              variant="destructive"
              onClick={handleCancelConfirm}
              disabled={!cancelReason.trim() || isPending}
            >
              {isPending && <IconLoader2 className="size-4 animate-spin" />}
              Cancel Booking
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </MaybePlaceholder>
  );
}

export function BookingsTableSkeleton() {
  const columns = createColumns({
    onCancel: () => {},
    onApproveProof: () => {},
  });
  return <TableViewSkeleton columns={columns} rows={5} />;
}

type BookingData = BookingsTable_AdvertiserBookingFragmentFragment;

function StatusIcon({ status }: { status: BookingStatus }) {
  switch (status) {
    case BookingStatus.Completed:
      return (
        <IconCircleCheckFilled className="fill-green-500 dark:fill-green-400" />
      );
    case BookingStatus.Verified:
      return <IconCheck className="text-green-500" />;
    case BookingStatus.Installed:
    case BookingStatus.FileDownloaded:
    case BookingStatus.Paid:
      return <IconLoader className="text-blue-500" />;
    case BookingStatus.Approved:
      return <IconCreditCard className="text-blue-500" />;
    case BookingStatus.PendingApproval:
      return <IconClock className="text-yellow-500" />;
    case BookingStatus.Disputed:
      return <IconAlertTriangle className="text-destructive" />;
    case BookingStatus.Cancelled:
    case BookingStatus.Rejected:
      return <IconX className="text-muted-foreground" />;
    default:
      return <IconClock className="text-muted-foreground" />;
  }
}

type ColumnActions = {
  onCancel: (id: string) => void;
  onApproveProof: (id: string) => void;
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
      key: "owner",
      header: "Space Owner",
      primary: (row) => row.space?.owner?.businessName,
      secondary: (row) =>
        row.space ? `${row.space.city}, ${row.space.state}` : undefined,
    }),
    stackColumn<BookingData>({
      key: "campaign",
      header: "Campaign",
      primary: (row) => row.campaign?.name,
      secondary: () => undefined,
    }),
    dateRangeColumn<BookingData>({
      key: "dates",
      header: "Dates",
      start: (row) => row.startDate as string,
      end: (row) => row.endDate as string,
    }),
    currencyColumn<BookingData>({
      key: "price",
      header: "Amount",
      value: (row) => row.totalAmount,
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
              label: "Cancel Request",
              icon: <IconX className="mr-2 size-4" />,
              variant: "destructive" as const,
              onClick: () => actions.onCancel(id),
            },
          ];
        }

        if (status === BookingStatus.Approved) {
          return [
            ...baseItems,
            {
              label: "Cancel",
              icon: <IconX className="mr-2 size-4" />,
              variant: "destructive" as const,
              onClick: () => actions.onCancel(id),
            },
          ];
        }

        if (status === BookingStatus.Verified) {
          return [
            ...baseItems,
            {
              label: "Approve Installation",
              icon: <IconCheck className="mr-2 size-4" />,
              onClick: () => actions.onApproveProof(id),
            },
            {
              label: "Dispute",
              icon: <IconAlertTriangle className="mr-2 size-4" />,
              variant: "destructive" as const,
              href: () => `/bookings/${id}`,
            },
          ];
        }

        if (status === BookingStatus.Disputed) {
          return [
            ...baseItems.slice(0, -1),
            {
              label: "View Dispute",
              href: () => `/bookings/${id}`,
            },
          ];
        }

        return baseItems.slice(0, -1);
      },
    }),
  ];
}
