"use client";

import {
  IconCircleCheckFilled,
  IconClock,
  IconDownload,
  IconLoader,
  IconPhotoCheck,
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
import type { BookingsTable_BookingFragmentFragment } from "@/types/gql/graphql";
import { BOOKING_STATUS } from "@/lib/constants";
import { type FilterTabKey } from "../constants";
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

const columns = [
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
    value: (row) => row.ownerPayoutAmount as string,
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
          { label: "Accept" },
          { label: "Reject", variant: "destructive" as const },
        ];
      }

      if (status === BookingStatus.Paid) {
        return [
          ...baseItems,
          {
            label: "Download File",
            icon: <IconDownload className="mr-2 size-4" />,
          },
        ];
      }

      if (status === BookingStatus.FileDownloaded) {
        return [...baseItems, { label: "Mark Installed" }];
      }

      return baseItems.slice(0, -1);
    },
  }),
];
