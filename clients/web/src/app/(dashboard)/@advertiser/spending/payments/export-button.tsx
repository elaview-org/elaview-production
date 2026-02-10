"use client";

import {
  IconDownload,
  IconFileTypeCsv,
  IconPrinter,
} from "@tabler/icons-react";
import { Button } from "@/components/primitives/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/primitives/dropdown-menu";
import { PAYMENT_STATUS } from "@/lib/core/constants";
import { formatDate, formatCurrency } from "@/lib/core/utils";
import { PaymentStatus } from "@/types/gql";
import { PAYMENT_TYPE_LABELS } from "../constants";
import type { PaymentHistoryData } from "./payments-table";

type Props = {
  payments: PaymentHistoryData[];
};

export default function ExportButton({ payments }: Props) {
  const handleExportCSV = () => {
    const headers = [
      "ID",
      "Date",
      "Space",
      "Campaign",
      "Type",
      "Amount",
      "Status",
      "Failure Reason",
    ];

    const rows = payments.map((payment) => [
      payment.id,
      formatDate(payment.createdAt, {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }),
      payment.booking?.space?.title ?? "",
      payment.booking?.campaign?.name ?? "",
      PAYMENT_TYPE_LABELS[payment.type] ?? payment.type,
      formatCurrency(Number(payment.amount), { decimals: true }),
      PAYMENT_STATUS.labels[payment.status as PaymentStatus] ?? payment.status,
      payment.failureReason ?? "",
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) =>
        row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `payments-history-${new Date().toISOString().split("T")[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" disabled={payments.length === 0}>
          <IconDownload className="size-4" />
          Export
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={handleExportCSV}>
          <IconFileTypeCsv className="size-4" />
          Export CSV
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handlePrint}>
          <IconPrinter className="size-4" />
          Print / PDF
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
