"use client";

import {
  IconCircleCheckFilled,
  IconClock,
  IconAlertCircle,
  IconArrowBackUp,
} from "@tabler/icons-react";
import TableView, {
  TableViewSkeleton,
  badgeColumn,
  createSelectColumn,
  currencyColumn,
  dateColumn,
  imageTextColumn,
  textColumn,
} from "@/components/composed/table-view";
import { PAYMENT_STATUS } from "@/lib/constants";
import { PaymentStatus } from "@/types/gql/graphql";

type PaymentData = {
  id: string;
  amount: string;
  status: PaymentStatus | string;
  createdAt: string;
  booking: {
    id: string;
    space: {
      title: string;
      images: string[];
    } | null;
    campaign: {
      name: string;
    } | null;
  } | null;
};

function StatusIcon({ status }: { status: PaymentStatus | string }) {
  switch (status) {
    case PaymentStatus.Succeeded:
      return (
        <IconCircleCheckFilled className="fill-green-500 dark:fill-green-400" />
      );
    case PaymentStatus.Pending:
      return <IconClock className="text-yellow-500" />;
    case PaymentStatus.Failed:
      return <IconAlertCircle className="text-destructive" />;
    case PaymentStatus.Refunded:
    case PaymentStatus.PartiallyRefunded:
      return <IconArrowBackUp className="text-blue-500" />;
    default:
      return <IconClock className="text-muted-foreground" />;
  }
}

const columns = [
  createSelectColumn<PaymentData>(),
  dateColumn<PaymentData>({
    key: "date",
    header: "Date",
    value: (row) => row.createdAt,
    format: "medium",
  }),
  imageTextColumn<PaymentData>({
    key: "space",
    header: "Space",
    image: (row) => row.booking?.space?.images[0],
    text: (row) => row.booking?.space?.title,
  }),
  textColumn<PaymentData>({
    key: "campaign",
    header: "Campaign",
    value: (row) => row.booking?.campaign?.name,
  }),
  currencyColumn<PaymentData>({
    key: "amount",
    header: "Amount",
    value: (row) => row.amount,
  }),
  badgeColumn<PaymentData, PaymentStatus>({
    key: "status",
    header: "Status",
    value: (row) => row.status as PaymentStatus,
    labels: PAYMENT_STATUS.labels,
    icon: (status) => <StatusIcon status={status} />,
    variant: (status) => PAYMENT_STATUS.variants[status] ?? "outline",
  }),
];

type Props = {
  data: PaymentData[];
};

export default function PaymentsTable({ data }: Props) {
  return (
    <TableView
      data={data}
      columns={columns}
      getRowId={(row) => row.id}
      emptyMessage="No payments found."
    />
  );
}

export function PaymentsTableSkeleton() {
  return <TableViewSkeleton columns={columns} rows={5} />;
}
