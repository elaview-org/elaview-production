"use client";

import { type ColumnDef } from "@tanstack/react-table";
import {
  IconCircleCheckFilled,
  IconClock,
  IconDotsVertical,
  IconDownload,
  IconLoader,
  IconPhotoCheck,
} from "@tabler/icons-react";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/primitives/badge";
import { Button } from "@/components/primitives/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/primitives/dropdown-menu";
import { Skeleton } from "@/components/primitives/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/primitives/table";
import DataTable, {
  createSelectColumn,
} from "@/components/composed/data-table";
import {
  BookingStatus,
  FragmentType,
  getFragmentData,
  graphql,
} from "@/types/gql";
import type { BookingsTable_BookingFragmentFragment } from "@/types/gql/graphql";
import { STATUS_LABELS } from "./constants";

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
};

export default function BookingsTable({ data }: Props) {
  const bookings = getFragmentData(BookingsTable_BookingFragment, data);

  return (
    <DataTable
      data={bookings}
      columns={columns}
      getRowId={(row) => row.id as string}
      emptyMessage="No bookings found."
    />
  );
}

type BookingData = BookingsTable_BookingFragmentFragment;

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

function formatCurrency(amount: string | number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(Number(amount));
}

function StatusIcon({ status }: { status: BookingStatus | string }) {
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

const columns: ColumnDef<BookingData>[] = [
  createSelectColumn<BookingData>(),
  {
    accessorKey: "space",
    header: "Space",
    cell: ({ row }) => {
      const space = row.original.space;
      return (
        <div className="flex items-center gap-3">
          <div className="bg-muted relative size-10 shrink-0 overflow-hidden rounded">
            {space?.images[0] ? (
              <Image
                src={space.images[0]}
                alt={space.title}
                fill
                className="object-cover"
                sizes="40px"
              />
            ) : (
              <div className="bg-muted size-full" />
            )}
          </div>
          <span className="truncate font-medium">
            {space?.title ?? "Unknown"}
          </span>
        </div>
      );
    },
    enableHiding: false,
  },
  {
    accessorKey: "campaign",
    header: "Advertiser",
    cell: ({ row }) => {
      const campaign = row.original.campaign;
      return (
        <div className="flex flex-col">
          <span className="truncate">
            {campaign?.advertiserProfile?.companyName ?? "Unknown"}
          </span>
          <span className="text-muted-foreground truncate text-xs">
            {campaign?.name ?? "Unknown Campaign"}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "startDate",
    header: "Dates",
    cell: ({ row }) => (
      <span className="text-muted-foreground text-sm whitespace-nowrap">
        {formatDate(row.original.startDate as string)} –{" "}
        {formatDate(row.original.endDate as string)}
      </span>
    ),
  },
  {
    accessorKey: "ownerPayoutAmount",
    header: () => <div className="text-right">Payout</div>,
    cell: ({ row }) => (
      <div className="text-right font-medium tabular-nums">
        {formatCurrency(row.original.ownerPayoutAmount as string)}
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status as BookingStatus;
      return (
        <Badge variant="outline" className="text-muted-foreground gap-1 px-1.5">
          <StatusIcon status={status} />
          {STATUS_LABELS[status] ?? status}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const status = row.original.status as BookingStatus;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="data-[state=open]:bg-muted text-muted-foreground flex size-8"
              size="icon"
            >
              <IconDotsVertical />
              <span className="sr-only">Open menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuItem asChild>
              <Link href={`/bookings/${row.original.id}`}>View Details</Link>
            </DropdownMenuItem>
            <DropdownMenuItem>Message</DropdownMenuItem>
            <DropdownMenuSeparator />
            {status === BookingStatus.PendingApproval && (
              <>
                <DropdownMenuItem>Accept</DropdownMenuItem>
                <DropdownMenuItem variant="destructive">
                  Reject
                </DropdownMenuItem>
              </>
            )}
            {status === BookingStatus.Paid && (
              <DropdownMenuItem>
                <IconDownload className="mr-2 size-4" />
                Download File
              </DropdownMenuItem>
            )}
            {status === BookingStatus.FileDownloaded && (
              <DropdownMenuItem>Mark Installed</DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

export function BookingsTableSkeleton() {
  return (
    <div className="overflow-hidden rounded-lg border">
      <Table>
        <TableHeader className="bg-muted">
          <TableRow>
            <TableHead className="w-8" />
            <TableHead>Space</TableHead>
            <TableHead>Advertiser</TableHead>
            <TableHead>Dates</TableHead>
            <TableHead className="text-right">Payout</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-8" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: 5 }).map((_, i) => (
            <TableRow key={i}>
              <TableCell>
                <Skeleton className="size-4" />
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-3">
                  <Skeleton className="size-10 rounded" />
                  <Skeleton className="h-4 w-32" />
                </div>
              </TableCell>
              <TableCell>
                <div className="flex flex-col gap-1">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-3 w-20" />
                </div>
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-28" />
              </TableCell>
              <TableCell>
                <Skeleton className="ml-auto h-4 w-16" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-5 w-20 rounded-full" />
              </TableCell>
              <TableCell>
                <Skeleton className="size-8" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}