import { BookingStatus } from "@/types/gql/graphql";

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