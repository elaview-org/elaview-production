"use client";

import { type ColumnDef } from "@tanstack/react-table";
import {
  IconCircleCheckFilled,
  IconClock,
  IconLoader,
  IconAlertCircle,
} from "@tabler/icons-react";
import { Badge } from "@/components/primitives/badge";
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
import { PayoutStage, PayoutStatus, graphql } from "@/types/gql";
import {
  PAYOUT_STATUS_LABELS,
  PAYOUT_STATUS_VARIANTS,
  PAYOUT_STAGE_LABELS,
  PAYOUT_STAGE_DESCRIPTIONS,
} from "./constants";

export const PayoutsTable_PayoutFragment = graphql(`
  fragment PayoutsTable_PayoutFragment on Payout {
    id
    amount
    stage
    status
    processedAt
    booking {
      id
      space {
        title
      }
    }
  }
`);

type PayoutData = {
  id: string;
  amount: string;
  stage: PayoutStage | string;
  status: PayoutStatus | string;
  processedAt: string | null;
  booking: {
    id: string;
    space: {
      title: string;
    } | null;
  } | null;
};

function formatDate(date: string | null) {
  if (!date) return "—";
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatCurrency(amount: string | number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(Number(amount));
}

function StatusIcon({ status }: { status: PayoutStatus | string }) {
  switch (status) {
    case PayoutStatus.Completed:
      return (
        <IconCircleCheckFilled className="fill-green-500 dark:fill-green-400" />
      );
    case PayoutStatus.Processing:
      return <IconLoader className="text-blue-500" />;
    case PayoutStatus.Pending:
      return <IconClock className="text-yellow-500" />;
    case PayoutStatus.Failed:
    case PayoutStatus.PartiallyPaid:
      return <IconAlertCircle className="text-destructive" />;
    default:
      return <IconClock className="text-muted-foreground" />;
  }
}

const columns: ColumnDef<PayoutData>[] = [
  createSelectColumn<PayoutData>(),
  {
    accessorKey: "processedAt",
    header: "Date",
    cell: ({ row }) => (
      <span className="text-muted-foreground whitespace-nowrap text-sm">
        {formatDate(row.original.processedAt)}
      </span>
    ),
  },
  {
    accessorKey: "booking",
    header: "Space",
    cell: ({ row }) => (
      <span className="truncate font-medium">
        {row.original.booking?.space?.title ?? "Unknown"}
      </span>
    ),
    enableHiding: false,
  },
  {
    accessorKey: "stage",
    header: "Stage",
    cell: ({ row }) => {
      const stage = row.original.stage as PayoutStage;
      return (
        <div className="flex flex-col">
          <span className="text-sm font-medium">
            {PAYOUT_STAGE_LABELS[stage] ?? stage}
          </span>
          <span className="text-muted-foreground text-xs">
            {PAYOUT_STAGE_DESCRIPTIONS[stage] ?? ""}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "amount",
    header: () => <div className="text-right">Amount</div>,
    cell: ({ row }) => (
      <div className="text-right font-medium tabular-nums">
        {formatCurrency(row.original.amount)}
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status as PayoutStatus;
      return (
        <Badge
          variant={PAYOUT_STATUS_VARIANTS[status] ?? "outline"}
          className="gap-1 px-1.5"
        >
          <StatusIcon status={status} />
          {PAYOUT_STATUS_LABELS[status] ?? status}
        </Badge>
      );
    },
  },
];

type Props = {
  data: PayoutData[];
};

export default function PayoutsTable({ data }: Props) {
  return (
    <DataTable
      data={data}
      columns={columns}
      getRowId={(row) => row.id}
      emptyMessage="No payouts found."
    />
  );
}

export function PayoutsTableSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      <div className="overflow-hidden rounded-lg border">
        <Table>
          <TableHeader className="bg-muted">
            <TableRow>
              <TableHead className="w-8" />
              <TableHead>Date</TableHead>
              <TableHead>Space</TableHead>
              <TableHead>Stage</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 5 }).map((_, i) => (
              <TableRow key={i}>
                <TableCell>
                  <Skeleton className="size-4" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-24" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-32" />
                </TableCell>
                <TableCell>
                  <div className="flex flex-col gap-1">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-3 w-20" />
                  </div>
                </TableCell>
                <TableCell>
                  <Skeleton className="ml-auto h-4 w-16" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-5 w-20 rounded-full" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-between px-2">
        <Skeleton className="hidden h-4 w-32 lg:block" />
        <div className="flex items-center gap-4">
          <Skeleton className="hidden h-8 w-32 lg:block" />
          <Skeleton className="h-4 w-24" />
          <div className="flex gap-2">
            <Skeleton className="size-8" />
            <Skeleton className="size-8" />
          </div>
        </div>
      </div>
    </div>
  );
}