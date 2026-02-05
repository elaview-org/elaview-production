"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/primitives/card";
import TableView, {
  badgeColumn,
  currencyColumn,
  dateColumn,
  textColumn,
} from "@/components/composed/table-view";
import {
  ACTIVITY_TYPES,
  ACTIVITY_STATUS,
  type ActivityType,
  type ActivityStatus,
} from "./constants";
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

const columns = [
  dateColumn<ActivityData>({
    key: "date",
    header: "Date",
    value: (row) => row.date,
  }),
  badgeColumn<ActivityData, ActivityType>({
    key: "type",
    header: "Type",
    value: (row) => row.type,
    labels: ACTIVITY_TYPES,
  }),
  textColumn<ActivityData>({
    key: "description",
    header: "Description",
    value: (row) => row.description,
    truncate: false,
  }),
  textColumn<ActivityData>({
    key: "space",
    header: "Space",
    value: (row) => row.space,
    muted: true,
  }),
  currencyColumn<ActivityData>({
    key: "amount",
    header: "Amount",
    value: (row) =>
      row.amount ? parseFloat(row.amount.replace(/[$,]/g, "")) : null,
  }),
  badgeColumn<ActivityData, ActivityStatus>({
    key: "status",
    header: "Status",
    value: (row) => row.status,
    labels: Object.fromEntries(
      Object.entries(ACTIVITY_STATUS).map(([k, v]) => [k, v.label])
    ) as Record<ActivityStatus, string>,
    icon: (status) => {
      const config = ACTIVITY_STATUS[status];
      const Icon = config.icon;
      return <Icon className={config.className} />;
    },
  }),
];

export default function RecentActivity() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>Latest bookings and transactions</CardDescription>
      </CardHeader>
      <CardContent>
        <TableView
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
