"use client";

import { type ColumnDef } from "@tanstack/react-table";
import { IconTrendingUp } from "@tabler/icons-react";
import { Skeleton } from "@/components/primitives/skeleton";
import { Badge } from "@/components/primitives/badge";
import TableView, {
  TableViewSkeleton,
  createSelectColumn,
  currencyColumn,
  imageTextColumn,
  numberColumn,
} from "@/components/composed/table-view";
import type { AdvertiserSpacePerformance } from "@/types/gql";

function getRoiVariant(roi: number): "default" | "secondary" | "destructive" {
  if (roi >= 3) return "default";
  if (roi >= 2) return "secondary";
  return "destructive";
}

const roiColumn: ColumnDef<AdvertiserSpacePerformance> = {
  id: "roi",
  header: () => <div className="text-right">ROI</div>,
  cell: ({ row }) => (
    <div className="flex items-center justify-end gap-1">
      <Badge
        variant={getRoiVariant(Number(row.original.roi ?? 0))}
        className="tabular-nums"
      >
        <IconTrendingUp className="mr-1 size-3" />
        {Number(row.original.roi ?? 0).toFixed(1)}x
      </Badge>
    </div>
  ),
  meta: { skeleton: "badge", headerAlign: "right" },
};

const impressionsColumn: ColumnDef<AdvertiserSpacePerformance> = {
  id: "impressions",
  header: () => <div className="text-right">Impressions</div>,
  cell: ({ row }) => (
    <div className="text-right tabular-nums">
      {Number(row.original.impressions).toLocaleString()}
    </div>
  ),
  meta: { skeleton: "number", headerAlign: "right" },
};

const columns: ColumnDef<AdvertiserSpacePerformance>[] = [
  createSelectColumn<AdvertiserSpacePerformance>(),
  imageTextColumn<AdvertiserSpacePerformance>({
    key: "space",
    header: "Space",
    image: (row) => row.image ?? "",
    text: (row) => row.title,
    href: (row) => `/discover/${row.id}`,
  }),
  numberColumn<AdvertiserSpacePerformance>({
    key: "bookings",
    header: "Bookings",
    value: (row) => row.totalBookings,
  }),
  currencyColumn<AdvertiserSpacePerformance>({
    key: "spend",
    header: "Spend",
    value: (row) => Number(row.totalSpend ?? 0),
  }),
  impressionsColumn,
  roiColumn,
];

export function PerformanceTableSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <Skeleton className="h-6 w-40" />
        <Skeleton className="mt-1 h-4 w-64" />
      </div>
      <TableViewSkeleton columns={columns} rows={5} />
    </div>
  );
}

type Props = {
  data: AdvertiserSpacePerformance[];
};

export default function PerformanceTable({ data }: Props) {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <h3 className="text-lg font-semibold">Space Performance</h3>
        <p className="text-muted-foreground text-sm">
          Performance metrics for each space you&apos;ve advertised on
        </p>
      </div>
      <TableView
        data={data}
        columns={columns}
        getRowId={(row) => row.id}
        emptyMessage="No spaces found."
      />
    </div>
  );
}
