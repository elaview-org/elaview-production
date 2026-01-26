"use client";

import { type ColumnDef } from "@tanstack/react-table";
import { IconStar } from "@tabler/icons-react";
import Image from "next/image";
import Link from "next/link";
import { Skeleton } from "@/components/primitives/skeleton";
import { Badge } from "@/components/primitives/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/primitives/table";
import DataTable, { createSelectColumn } from "@/components/composed/data-table";
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

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

function getOccupancyVariant(rate: number): "default" | "secondary" | "destructive" | "outline" {
  if (rate >= 70) return "default";
  if (rate >= 40) return "secondary";
  return "destructive";
}

const columns: ColumnDef<SpacePerformance>[] = [
  createSelectColumn<SpacePerformance>(),
  {
    accessorKey: "title",
    header: "Space",
    cell: ({ row }) => (
      <Link
        href={`/listings/${row.original.id}`}
        className="flex items-center gap-3 hover:underline"
      >
        <div className="relative size-10 shrink-0 overflow-hidden rounded-md">
          <Image
            src={row.original.image}
            alt={row.original.title}
            fill
            className="object-cover"
          />
        </div>
        <span className="truncate font-medium">{row.original.title}</span>
      </Link>
    ),
    enableHiding: false,
  },
  {
    accessorKey: "totalBookings",
    header: () => <div className="text-right">Bookings</div>,
    cell: ({ row }) => (
      <div className="text-right tabular-nums">{row.original.totalBookings}</div>
    ),
  },
  {
    accessorKey: "totalRevenue",
    header: () => <div className="text-right">Revenue</div>,
    cell: ({ row }) => (
      <div className="text-right font-medium tabular-nums">
        {formatCurrency(row.original.totalRevenue)}
      </div>
    ),
  },
  {
    accessorKey: "occupancyRate",
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
  },
  {
    accessorKey: "averageRating",
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
  },
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
      <DataTable
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
      <div className="overflow-hidden rounded-lg border">
        <Table>
          <TableHeader className="bg-muted">
            <TableRow>
              <TableHead className="w-8" />
              <TableHead>Space</TableHead>
              <TableHead className="text-right">Bookings</TableHead>
              <TableHead className="text-right">Revenue</TableHead>
              <TableHead className="text-right">Occupancy</TableHead>
              <TableHead className="text-right">Rating</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 5 }).map((_, i) => (
              <TableRow key={i}>
                <TableCell>
                  <Skeleton className="size-4" />
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Skeleton className="size-10 rounded-md" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                </TableCell>
                <TableCell>
                  <Skeleton className="ml-auto h-4 w-8" />
                </TableCell>
                <TableCell>
                  <Skeleton className="ml-auto h-4 w-16" />
                </TableCell>
                <TableCell>
                  <Skeleton className="ml-auto h-5 w-12 rounded-full" />
                </TableCell>
                <TableCell>
                  <Skeleton className="ml-auto h-4 w-12" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}