"use client";

import { type ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/primitives/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/primitives/card";
import DataTable from "@/components/composed/data-table";
import { ACTIVITY_TYPES, ACTIVITY_STATUS, type ActivityType, type ActivityStatus } from "./constants";
import mock from "./mock.json";

type ActivityData = {
  id: string;
  type: ActivityType;
  description: string;
  space: string;
  status: ActivityStatus;
  date: string;
  amount?: string;
};

const columns: ColumnDef<ActivityData>[] = [
  {
    accessorKey: "date",
    header: "Date",
    cell: ({ row }) => (
      <span className="text-muted-foreground whitespace-nowrap text-sm">
        {new Date(row.original.date).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        })}
      </span>
    ),
  },
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => (
      <Badge variant="outline" className="text-muted-foreground">
        {ACTIVITY_TYPES[row.original.type]}
      </Badge>
    ),
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => (
      <span className="font-medium">{row.original.description}</span>
    ),
  },
  {
    accessorKey: "space",
    header: "Space",
    cell: ({ row }) => (
      <span className="text-muted-foreground truncate">
        {row.original.space}
      </span>
    ),
  },
  {
    accessorKey: "amount",
    header: () => <div className="text-right">Amount</div>,
    cell: ({ row }) =>
      row.original.amount ? (
        <div className="text-right font-medium tabular-nums">
          {row.original.amount}
        </div>
      ) : (
        <div className="text-muted-foreground text-right">—</div>
      ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const config = ACTIVITY_STATUS[row.original.status];
      const Icon = config.icon;
      return (
        <Badge variant="outline" className="text-muted-foreground gap-1 px-1.5">
          <Icon className={config.className} />
          {config.label}
        </Badge>
      );
    },
  },
];

export default function RecentActivity() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>Latest bookings and transactions</CardDescription>
      </CardHeader>
      <CardContent>
        <DataTable
          data={mock.activity as ActivityData[]}
          columns={columns}
          getRowId={(row) => row.id}
          emptyMessage="No recent activity."
          pageSize={5}
          enableSelection={false}
        />
      </CardContent>
    </Card>
  );
}