"use client";

import { IconDownload } from "@tabler/icons-react";
import { Button } from "@/components/primitives/button";
import type { BookingsTable_AdvertiserBookingFragmentFragment } from "@/types/gql/graphql";
import { BOOKING_STATUS } from "@/lib/core/constants";
import { formatDate, formatCurrency } from "@/lib/core/utils";

type Props = {
  bookings: BookingsTable_AdvertiserBookingFragmentFragment[];
};

export default function ExportButton({ bookings }: Props) {
  const handleExport = () => {
    const headers = [
      "ID",
      "Space",
      "Owner",
      "Campaign",
      "Start Date",
      "End Date",
      "Status",
      "Amount",
    ];

    const rows = bookings.map((booking) => [
      booking.id,
      booking.space?.title ?? "",
      booking.space?.owner?.businessName ?? "",
      booking.campaign?.name ?? "",
      formatDate(booking.startDate as string, {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }),
      formatDate(booking.endDate as string, {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }),
      BOOKING_STATUS.labels[booking.status],
      formatCurrency(booking.totalAmount as number, { decimals: true }),
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
    link.download = `bookings-${new Date().toISOString().split("T")[0]}.csv`;
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
      disabled={bookings.length === 0}
    >
      <IconDownload className="size-4" />
      Export CSV
    </Button>
  );
}
