"use client";

import { IconDownload } from "@tabler/icons-react";
import { Button } from "@/components/primitives/button";
import { PAYMENT_STATUS } from "@/lib/constants";
import { formatDate, formatCurrency } from "@/lib/utils";
import { PaymentStatus } from "@/types/gql";
import type { PaymentData } from "./payments-table";

type Props = {
  payments: PaymentData[];
};

export default function ExportButton({ payments }: Props) {
  const handleExport = () => {
    const headers = ["ID", "Date", "Space", "Campaign", "Amount", "Status"];

    const rows = payments.map((payment) => [
      payment.id,
      formatDate(payment.createdAt, {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }),
      payment.booking?.space?.title ?? "",
      payment.booking?.campaign?.name ?? "",
      formatCurrency(Number(payment.amount), { decimals: true }),
      PAYMENT_STATUS.labels[payment.status as PaymentStatus] ?? payment.status,
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
    link.download = `spending-${new Date().toISOString().split("T")[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleExport}
      disabled={payments.length === 0}
    >
      <IconDownload className="size-4" />
      Export CSV
    </Button>
  );
}
