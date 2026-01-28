"use client";

import {
  IconCircleCheckFilled,
  IconClock,
  IconCreditCard,
  IconAlertTriangle,
  IconCheck,
  IconX,
  IconLoader,
} from "@tabler/icons-react";
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
  BookingStatus,
  FragmentType,
  getFragmentData,
  graphql,
} from "@/types/gql";
import type { BookingsTable_AdvertiserBookingFragmentFragment } from "@/types/gql/graphql";
import { BOOKING_STATUS } from "@/lib/constants";
import { type FilterTabKey } from "../constants";
import Placeholder from "./placeholder";

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

  return (
    <MaybePlaceholder data={data} placeholder={<Placeholder tabKey={tabKey} />}>
      <TableView
        data={bookings}
        columns={columns}
        getRowId={(row) => row.id as string}
      />
    </MaybePlaceholder>
  );
}

export function BookingsTableSkeleton() {
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

const columns = [
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
      const baseItems = [
        { label: "View Details", href: () => `/bookings/${row.id}` },
        { label: "Message" },
        { separator: true as const },
      ];

      if (status === BookingStatus.PendingApproval) {
        return [
          ...baseItems,
          { label: "Cancel Request", variant: "destructive" as const },
        ];
      }

      if (status === BookingStatus.Approved) {
        return [
          ...baseItems,
          {
            label: "Pay Now",
            icon: <IconCreditCard className="mr-2 size-4" />,
          },
          { label: "Cancel", variant: "destructive" as const },
        ];
      }

      if (status === BookingStatus.Verified) {
        return [
          ...baseItems,
          {
            label: "Approve Installation",
            icon: <IconCheck className="mr-2 size-4" />,
          },
          {
            label: "Dispute",
            icon: <IconAlertTriangle className="mr-2 size-4" />,
            variant: "destructive" as const,
          },
        ];
      }

      if (status === BookingStatus.Disputed) {
        return [...baseItems, { label: "View Dispute" }];
      }

      return baseItems.slice(0, -1);
    },
  }),
];
