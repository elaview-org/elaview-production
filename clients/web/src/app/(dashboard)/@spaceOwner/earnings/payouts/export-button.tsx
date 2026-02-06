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
import type { PayoutsHistoryTable_PayoutFragmentFragment } from "@/types/gql/graphql";
import { PAYOUT_STATUS, PAYOUT_STAGE } from "@/lib/constants";
import { formatDate, formatCurrency } from "@/lib/utils";
import { PayoutStage, PayoutStatus } from "@/types/gql";

type Props = {
  payouts: PayoutsHistoryTable_PayoutFragmentFragment[];
};

export default function ExportButton({ payouts }: Props) {
  const handleExportCSV = () => {
    const headers = [
      "ID",
      "Date",
      "Space",
      "Stage",
      "Amount",
      "Status",
      "Failure Reason",
    ];

    const rows = payouts.map((payout) => [
      payout.id,
      formatDate(payout.processedAt as string, {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }),
      payout.booking?.space?.title ?? "",
      PAYOUT_STAGE.labels[payout.stage as PayoutStage] ?? payout.stage,
      formatCurrency(payout.amount as number, { decimals: true }),
      PAYOUT_STATUS.labels[payout.status as PayoutStatus] ?? payout.status,
      payout.failureReason ?? "",
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
    link.download = `payouts-history-${new Date().toISOString().split("T")[0]}.csv`;
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
        <Button variant="outline" size="sm" disabled={payouts.length === 0}>
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
