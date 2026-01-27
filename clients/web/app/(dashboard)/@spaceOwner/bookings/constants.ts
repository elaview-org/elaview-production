import { BookingStatus } from "@/types/gql/graphql";
import { ViewOptions } from "@/types/constants";

export const STATUS_LABELS: Record<BookingStatus, string> = {
  [BookingStatus.PendingApproval]: "Pending",
  [BookingStatus.Approved]: "Approved",
  [BookingStatus.Paid]: "Paid",
  [BookingStatus.FileDownloaded]: "Downloaded",
  [BookingStatus.Installed]: "Installed",
  [BookingStatus.Verified]: "Verified",
  [BookingStatus.Completed]: "Completed",
  [BookingStatus.Disputed]: "Disputed",
  [BookingStatus.Rejected]: "Rejected",
  [BookingStatus.Cancelled]: "Cancelled",
};

export const STATUS_VARIANTS: Record<
  BookingStatus,
  "default" | "secondary" | "destructive" | "outline"
> = {
  [BookingStatus.PendingApproval]: "outline",
  [BookingStatus.Approved]: "secondary",
  [BookingStatus.Paid]: "default",
  [BookingStatus.FileDownloaded]: "default",
  [BookingStatus.Installed]: "default",
  [BookingStatus.Verified]: "default",
  [BookingStatus.Completed]: "default",
  [BookingStatus.Disputed]: "destructive",
  [BookingStatus.Rejected]: "destructive",
  [BookingStatus.Cancelled]: "secondary",
};

export const STATUS_INDICATORS: Record<BookingStatus, string> = {
  [BookingStatus.PendingApproval]: "bg-amber-500",
  [BookingStatus.Approved]: "bg-blue-500",
  [BookingStatus.Paid]: "bg-blue-500",
  [BookingStatus.FileDownloaded]: "bg-blue-500",
  [BookingStatus.Installed]: "bg-blue-500",
  [BookingStatus.Verified]: "bg-emerald-500",
  [BookingStatus.Completed]: "bg-emerald-500",
  [BookingStatus.Disputed]: "bg-destructive",
  [BookingStatus.Rejected]: "bg-destructive",
  [BookingStatus.Cancelled]: "bg-muted-foreground",
};

export const FILTER_TABS = [
  {
    key: "incoming",
    label: "Incoming",
    statuses: [BookingStatus.PendingApproval],
  },
  {
    key: "active",
    label: "Active",
    statuses: [
      BookingStatus.Paid,
      BookingStatus.FileDownloaded,
      BookingStatus.Installed,
      BookingStatus.Verified,
    ],
  },
  {
    key: "completed",
    label: "Completed",
    statuses: [BookingStatus.Completed],
  },
  {
    key: "all",
    label: "All",
    statuses: null,
  },
] as const;

export type FilterTabKey = (typeof FILTER_TABS)[number]["key"];

export function getStatusFilter(tabKey: FilterTabKey) {
  const tab = FILTER_TABS.find((t) => t.key === tabKey);
  if (!tab || tab.statuses === null) return undefined;
  return { status: { in: [...tab.statuses] } };
}

export const TOOLBAR_PROPS = {
  searchTarget: "spaces",
  filters: [
    {
      placeholder: "Status",
      fields: [
        { value: "active", label: "Active" },
        { value: "inactive", label: "Inactive" },
        { value: "pending", label: "Pending Approval" },
        { value: "rejected", label: "Rejected" },
        { value: "suspended", label: "Suspended" },
      ],
    },
  ],
  sort: {
    fields: [
      { value: "createdAt", label: "Posted Date" },
      { value: "price", label: "Price" },
      { value: "bookings", label: "Most bookings" },
    ],
  },
  views: new Set([ViewOptions.Grid, ViewOptions.Table]),
};
