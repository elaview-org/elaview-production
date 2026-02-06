"use client";

import { useState, useTransition } from "react";
import type { Row } from "@tanstack/react-table";
import {
  IconCircleCheckFilled,
  IconClock,
  IconLoader,
  IconAlertCircle,
  IconRefresh,
} from "@tabler/icons-react";
import { toast } from "sonner";
import TableView, {
  TableViewSkeleton,
  badgeColumn,
  createSelectColumn,
  currencyColumn,
  dateColumn,
  stackColumn,
  textColumn,
} from "@/components/composed/table-view";
import { Button } from "@/components/primitives/button";
import { PAYOUT_STAGE, PAYOUT_STATUS } from "@/lib/constants";
import { PayoutStage, PayoutStatus, graphql } from "@/types/gql";
import { retryPayoutAction } from "./payouts.actions";

export const PayoutsHistoryTable_PayoutFragment = graphql(`
  fragment PayoutsHistoryTable_PayoutFragment on Payout {
    id
    amount
    stage
    status
    processedAt
    failureReason
    attemptCount
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
  failureReason: string | null;
  attemptCount: number;
  booking: {
    id: string;
    space: {
      title: string;
    } | null;
  } | null;
};

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

type Props = {
  data: PayoutData[];
};

export default function PayoutsHistoryTable({ data }: Props) {
  const [retryingId, setRetryingId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleRetry = (payoutId: string) => {
    setRetryingId(payoutId);
    startTransition(async () => {
      const result = await retryPayoutAction(payoutId);
      if (result.success) {
        toast.success("Payout retry initiated");
      } else {
        toast.error(result.error ?? "Failed to retry payout");
      }
      setRetryingId(null);
    });
  };

  const columns = [
    createSelectColumn<PayoutData>(),
    dateColumn<PayoutData>({
      key: "date",
      header: "Date",
      value: (row) => row.processedAt,
      format: "medium",
    }),
    textColumn<PayoutData>({
      key: "space",
      header: "Space",
      value: (row) => row.booking?.space?.title,
      enableHiding: false,
    }),
    stackColumn<PayoutData>({
      key: "stage",
      header: "Stage",
      primary: (row) =>
        PAYOUT_STAGE.labels[row.stage as PayoutStage] ?? row.stage,
      secondary: (row) =>
        PAYOUT_STAGE.descriptions[row.stage as PayoutStage] ?? "",
    }),
    currencyColumn<PayoutData>({
      key: "amount",
      header: "Amount",
      value: (row) => row.amount,
    }),
    badgeColumn<PayoutData, PayoutStatus>({
      key: "status",
      header: "Status",
      value: (row) => row.status as PayoutStatus,
      labels: PAYOUT_STATUS.labels,
      icon: (status) => <StatusIcon status={status} />,
      variant: (status) => PAYOUT_STATUS.variants[status] ?? "outline",
    }),
    {
      id: "actions",
      header: "",
      cell: ({ row }: { row: Row<PayoutData> }) => {
        const data = row.original;
        const isFailed =
          data.status === PayoutStatus.Failed ||
          data.status === PayoutStatus.PartiallyPaid;

        if (!isFailed) return null;

        const isRetrying = retryingId === data.id && isPending;

        return (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleRetry(data.id)}
            disabled={isRetrying}
          >
            <IconRefresh
              className={`size-4 ${isRetrying ? "animate-spin" : ""}`}
            />
            Retry
          </Button>
        );
      },
      enableSorting: false,
      enableHiding: false,
    },
  ];

  return (
    <TableView
      data={data}
      columns={columns}
      getRowId={(row) => row.id}
      emptyMessage="No payouts found."
    />
  );
}

export function PayoutsHistoryTableSkeleton() {
  const skeletonColumns = [
    createSelectColumn<PayoutData>(),
    dateColumn<PayoutData>({
      key: "date",
      header: "Date",
      value: (row) => row.processedAt,
      format: "medium",
    }),
    textColumn<PayoutData>({
      key: "space",
      header: "Space",
      value: () => "",
    }),
    textColumn<PayoutData>({
      key: "stage",
      header: "Stage",
      value: () => "",
    }),
    currencyColumn<PayoutData>({
      key: "amount",
      header: "Amount",
      value: () => "0",
    }),
    textColumn<PayoutData>({
      key: "status",
      header: "Status",
      value: () => "",
    }),
  ];

  return <TableViewSkeleton columns={skeletonColumns} rows={10} />;
}
