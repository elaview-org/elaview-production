"use client";

import { IconDownload } from "@tabler/icons-react";
import { Button } from "@/components/primitives/button";
import type { PayoutsTable_PayoutFragmentFragment } from "@/types/gql/graphql";
import { PAYOUT_STATUS, PAYOUT_STAGE } from "@/lib/constants";
import { formatDate, formatCurrency } from "@/lib/utils";
import { PayoutStage, PayoutStatus } from "@/types/gql";

type Props = {
  payouts: PayoutsTable_PayoutFragmentFragment[];
};

export default function ExportButton({ payouts }: Props) {
  const handleExport = () => {
    const headers = ["ID", "Date", "Space", "Stage", "Amount", "Status"];

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
    link.download = `payouts-${new Date().toISOString().split("T")[0]}.csv`;
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
      disabled={payouts.length === 0}
    >
      <IconDownload className="size-4" />
      Export CSV
    </Button>
  );
}
