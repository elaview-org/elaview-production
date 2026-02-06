"use client";

import { type ColumnDef } from "@tanstack/react-table";
import { IconStar } from "@tabler/icons-react";
import { Skeleton } from "@/components/primitives/skeleton";
import { Badge } from "@/components/primitives/badge";
import TableView, {
  createSelectColumn,
  currencyColumn,
  imageTextColumn,
  numberColumn,
  TableViewSkeleton,
} from "@/components/composed/table-view";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/primitives/card";

type TableRow = {
  id: string;
  title: string;
  totalBookings: number;
  totalRevenue: number;
  averageRating: number | null;
  occupancyRate: number;
  image: string | null;
};

function getOccupancyVariant(
  rate: number
): "default" | "secondary" | "destructive" {
  if (rate >= 70) return "default";
  if (rate >= 40) return "secondary";
  return "destructive";
}

const occupancyColumn: ColumnDef<TableRow> = {
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

const ratingColumn: ColumnDef<TableRow> = {
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
  createSelectColumn<TableRow>(),
  imageTextColumn<TableRow>({
    key: "space",
    header: "Space",
    image: (row) => row.image ?? undefined,
    text: (row) => row.title,
    href: (row) => `/listings/${row.id}`,
  }),
  numberColumn<TableRow>({
    key: "bookings",
    header: "Bookings",
    value: (row) => row.totalBookings,
  }),
  currencyColumn<TableRow>({
    key: "revenue",
    header: "Revenue",
    value: (row) => row.totalRevenue,
  }),
  occupancyColumn,
  ratingColumn,
];

type SpacePerformanceItem = {
  id: string;
  title: string;
  image: string | null;
  totalBookings: number;
  totalRevenue: number | null;
  averageRating: number | null;
  occupancyRate: number | null;
};

type Props = {
  data: SpacePerformanceItem[];
};

export default function PerformanceTable({ data }: Props) {
  const tableData: TableRow[] = data.map((item) => ({
    id: item.id,
    title: item.title,
    totalBookings: item.totalBookings,
    totalRevenue: Number(item.totalRevenue ?? 0),
    averageRating: item.averageRating ?? null,
    occupancyRate: Number(item.occupancyRate ?? 0),
    image: item.image ?? null,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Space Performance</CardTitle>
        <CardDescription>
          Performance metrics for each of your spaces
        </CardDescription>
      </CardHeader>
      <CardContent>
        <TableView
          data={tableData}
          columns={columns}
          getRowId={(row) => row.id}
          emptyMessage="No spaces found."
        />
      </CardContent>
    </Card>
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
