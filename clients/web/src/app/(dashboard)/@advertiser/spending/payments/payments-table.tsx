"use client";

import { useState } from "react";
import {
  IconCircleCheckFilled,
  IconClock,
  IconAlertCircle,
  IconArrowBackUp,
  IconEye,
} from "@tabler/icons-react";
import TableView, {
  TableViewSkeleton,
  badgeColumn,
  createSelectColumn,
  currencyColumn,
  dateColumn,
  imageTextColumn,
  stackColumn,
  textColumn,
} from "@/components/composed/table-view";
import { Button } from "@/components/primitives/button";
import { PAYMENT_STATUS } from "@/lib/constants";
import { PaymentStatus, graphql } from "@/types/gql";
import { PAYMENT_TYPE_LABELS } from "../constants";
import PaymentDetail from "../payment-detail";
import type { Row } from "@tanstack/react-table";

export const PaymentsHistoryTable_PaymentFragment = graphql(`
  fragment PaymentsHistoryTable_PaymentFragment on Payment {
    id
    amount
    status
    type
    createdAt
    paidAt
    failureReason
    receiptUrl
    booking {
      id
      space {
        title
        images
      }
      campaign {
        name
      }
    }
  }
`);

export type PaymentHistoryData = {
  id: string;
  amount: number;
  status: PaymentStatus | string;
  type: string;
  createdAt: string;
  paidAt: string | null;
  failureReason: string | null;
  receiptUrl: string | null;
  booking: {
    id: string;
    space: {
      title: string;
      images: string[];
    } | null;
    campaign: {
      name: string;
    } | null;
  };
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

type Props = {
  data: PaymentHistoryData[];
};

export default function PaymentsHistoryTable({ data }: Props) {
  const [selectedPayment, setSelectedPayment] =
    useState<PaymentHistoryData | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);

  const columns = [
    createSelectColumn<PaymentHistoryData>(),
    dateColumn<PaymentHistoryData>({
      key: "date",
      header: "Date",
      value: (row) => row.createdAt,
      format: "medium",
    }),
    imageTextColumn<PaymentHistoryData>({
      key: "space",
      header: "Space",
      image: (row) => row.booking?.space?.images[0],
      text: (row) => row.booking?.space?.title,
    }),
    textColumn<PaymentHistoryData>({
      key: "campaign",
      header: "Campaign",
      value: (row) => row.booking?.campaign?.name,
    }),
    stackColumn<PaymentHistoryData>({
      key: "type",
      header: "Type",
      primary: (row) => PAYMENT_TYPE_LABELS[row.type] ?? row.type,
      secondary: (row) =>
        row.type === "DEPOSIT"
          ? "Initial payment"
          : row.type === "BALANCE"
            ? "Remaining amount"
            : "",
    }),
    currencyColumn<PaymentHistoryData>({
      key: "amount",
      header: "Amount",
      value: (row) => row.amount,
    }),
    badgeColumn<PaymentHistoryData, PaymentStatus>({
      key: "status",
      header: "Status",
      value: (row) => row.status as PaymentStatus,
      labels: PAYMENT_STATUS.labels,
      icon: (status) => <StatusIcon status={status} />,
      variant: (status) => PAYMENT_STATUS.variants[status] ?? "outline",
    }),
    {
      id: "actions",
      header: "",
      cell: ({ row }: { row: Row<PaymentHistoryData> }) => {
        const payment = row.original;
        return (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setSelectedPayment(payment);
              setSheetOpen(true);
            }}
          >
            <IconEye className="size-4" />
          </Button>
        );
      },
      enableSorting: false,
      enableHiding: false,
    },
  ];

  return (
    <>
      <TableView
        data={data}
        columns={columns}
        getRowId={(row) => row.id}
        emptyMessage="No payments found."
      />
      <PaymentDetail
        payment={selectedPayment}
        open={sheetOpen}
        onOpenChange={setSheetOpen}
      />
    </>
  );
}

export function PaymentsHistoryTableSkeleton() {
  const skeletonColumns = [
    createSelectColumn<PaymentHistoryData>(),
    dateColumn<PaymentHistoryData>({
      key: "date",
      header: "Date",
      value: (row) => row.createdAt,
      format: "medium",
    }),
    textColumn<PaymentHistoryData>({
      key: "space",
      header: "Space",
      value: () => "",
    }),
    textColumn<PaymentHistoryData>({
      key: "campaign",
      header: "Campaign",
      value: () => "",
    }),
    textColumn<PaymentHistoryData>({
      key: "type",
      header: "Type",
      value: () => "",
    }),
    currencyColumn<PaymentHistoryData>({
      key: "amount",
      header: "Amount",
      value: () => 0,
    }),
    textColumn<PaymentHistoryData>({
      key: "status",
      header: "Status",
      value: () => "",
    }),
  ];

  return <TableViewSkeleton columns={skeletonColumns} rows={10} />;
}
