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
  dateColumn,
  textColumn,
} from "@/components/composed/table-view";
import { NotificationType } from "@/types/gql";

type NotificationData = {
  id: string;
  type: NotificationType;
  title: string;
  body: string;
  createdAt: string;
  isRead: boolean;
};

type Props = {
  data: NotificationData[];
};

const NOTIFICATION_TYPE_LABELS: Record<NotificationType, string> = {
  [NotificationType.BookingApproved]: "Approved",
  [NotificationType.BookingCancelled]: "Cancelled",
  [NotificationType.BookingRejected]: "Rejected",
  [NotificationType.BookingRequested]: "Requested",
  [NotificationType.DisputeFiled]: "Dispute",
  [NotificationType.DisputeResolved]: "Resolved",
  [NotificationType.MessageReceived]: "Message",
  [NotificationType.PaymentFailed]: "Failed",
  [NotificationType.PaymentReceived]: "Payment",
  [NotificationType.PaymentReminder]: "Reminder",
  [NotificationType.PayoutProcessed]: "Payout",
  [NotificationType.ProofApproved]: "Approved",
  [NotificationType.ProofDisputed]: "Disputed",
  [NotificationType.ProofRejected]: "Rejected",
  [NotificationType.ProofUploaded]: "Proof",
  [NotificationType.RefundProcessed]: "Refund",
  [NotificationType.SessionExpired]: "Session",
  [NotificationType.SpaceApproved]: "Space",
  [NotificationType.SpaceReactivated]: "Space",
  [NotificationType.SpaceRejected]: "Space",
  [NotificationType.SpaceSuspended]: "Space",
  [NotificationType.SystemUpdate]: "System",
};

const columns = [
  dateColumn<NotificationData>({
    key: "createdAt",
    header: "Date",
    value: (row) => row.createdAt,
  }),
  badgeColumn<NotificationData, NotificationType>({
    key: "type",
    header: "Type",
    value: (row) => row.type,
    labels: NOTIFICATION_TYPE_LABELS,
  }),
  textColumn<NotificationData>({
    key: "title",
    header: "Event",
    value: (row) => row.title,
    truncate: false,
  }),
  textColumn<NotificationData>({
    key: "body",
    header: "Details",
    value: (row) => row.body,
    muted: true,
  }),
];

export default function RecentActivity({ data }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>Latest bookings and transactions</CardDescription>
      </CardHeader>
      <CardContent>
        <TableView
          data={data}
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
