"use client";

import { type ColumnDef } from "@tanstack/react-table";
import { IconStar } from "@tabler/icons-react";
import { Skeleton } from "@/components/primitives/skeleton";
import { Badge } from "@/components/primitives/badge";
import TableView, {
  TableViewSkeleton,
  createSelectColumn,
  currencyColumn,
  imageTextColumn,
  numberColumn,
} from "@/components/composed/table-view";
import mock from "./mock.json";

type SpacePerformance = {
  id: string;
  title: string;
  totalBookings: number;
  totalRevenue: number;
  averageRating: number | null;
  occupancyRate: number;
  image: string;
};

function getOccupancyVariant(
  rate: number
): "default" | "secondary" | "destructive" {
  if (rate >= 70) return "default";
  if (rate >= 40) return "secondary";
  return "destructive";
}

const occupancyColumn: ColumnDef<SpacePerformance> = {
  id: "occupancy",
  header: () => <div className="text-right">Occupancy</div>,
  cell: ({ row }) => (
    <div className="flex justify-end">
      <Badge
        variant={getOccupancyVariant(row.original.occupancyRate)}
        className="tabular-nums"
      >
        {row.original.occupancyRate.toFixed(0)}%
      </Badge>
    </div>
  ),
  meta: { skeleton: "badge", headerAlign: "right" },
};

const ratingColumn: ColumnDef<SpacePerformance> = {
  id: "rating",
  header: () => <div className="text-right">Rating</div>,
  cell: ({ row }) => (
    <div className="flex items-center justify-end gap-1 tabular-nums">
      {row.original.averageRating !== null ? (
        <>
          <IconStar className="size-4 fill-yellow-400 text-yellow-400" />
          <span>{row.original.averageRating.toFixed(1)}</span>
        </>
      ) : (
        <span className="text-muted-foreground">—</span>
      )}
    </div>
  ),
  meta: { skeleton: "number", headerAlign: "right" },
};

const columns = [
  createSelectColumn<SpacePerformance>(),
  imageTextColumn<SpacePerformance>({
    key: "space",
    header: "Space",
    image: (row) => row.image,
    text: (row) => row.title,
    href: (row) => `/listings/${row.id}`,
  }),
  numberColumn<SpacePerformance>({
    key: "bookings",
    header: "Bookings",
    value: (row) => row.totalBookings,
  }),
  currencyColumn<SpacePerformance>({
    key: "revenue",
    header: "Revenue",
    value: (row) => row.totalRevenue,
  }),
  occupancyColumn,
  ratingColumn,
];

export default function PerformanceTable() {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <h3 className="text-lg font-semibold">Space Performance</h3>
        <p className="text-muted-foreground text-sm">
          Performance metrics for each of your spaces
        </p>
      </div>
      <TableView
        data={mock.spacePerformance as SpacePerformance[]}
        columns={columns}
        getRowId={(row) => row.id}
        emptyMessage="No spaces found."
      />
    </div>
  );
}

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