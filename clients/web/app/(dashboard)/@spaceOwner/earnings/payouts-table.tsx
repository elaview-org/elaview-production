"use client";

import {
  IconCircleCheckFilled,
  IconClock,
  IconLoader,
  IconAlertCircle,
} from "@tabler/icons-react";
import TableView, {
  TableViewSkeleton,
  badgeColumn,
  createSelectColumn,
  currencyColumn,
  dateColumn,
  stackColumn,
  textColumn,
} from "@/components/composed/table-view";
import { PAYOUT_STAGE, PAYOUT_STATUS } from "@/lib/constants";
import { PayoutStage, PayoutStatus, graphql } from "@/types/gql";

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
];

type Props = {
  data: PayoutData[];
};

export default function PayoutsTable({ data }: Props) {
  return (
    <TableView
      data={data}
      columns={columns}
      getRowId={(row) => row.id}
      emptyMessage="No payouts found."
    />
  );
}

export function PayoutsTableSkeleton() {
  return <TableViewSkeleton columns={columns} rows={5} />;
}
