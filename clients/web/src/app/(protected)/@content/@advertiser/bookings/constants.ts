import { BookingStatus } from "@/types/gql/graphql";
import { ViewOptions } from "@/types/constants";

export const FILTER_TABS = [
  {
    key: "pending",
    label: "Pending",
    statuses: [BookingStatus.PendingApproval],
  },
  {
    key: "approved",
    label: "Approved",
    statuses: [BookingStatus.Approved],
  },
  {
    key: "active",
    label: "Active",
    statuses: [
      BookingStatus.Paid,
      BookingStatus.FileDownloaded,
      BookingStatus.Installed,
    ],
  },
  {
    key: "verification",
    label: "Verification",
    statuses: [BookingStatus.Verified],
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
  searchTarget: "bookings",
  filters: [
    {
      key: "status",
      placeholder: "Status",
      fields: [
        { value: BookingStatus.PendingApproval, label: "Pending" },
        { value: BookingStatus.Approved, label: "Approved" },
        { value: BookingStatus.Paid, label: "Paid" },
        { value: BookingStatus.FileDownloaded, label: "Downloaded" },
        { value: BookingStatus.Installed, label: "Installed" },
        { value: BookingStatus.Verified, label: "Verified" },
        { value: BookingStatus.Completed, label: "Completed" },
        { value: BookingStatus.Disputed, label: "Disputed" },
        { value: BookingStatus.Cancelled, label: "Cancelled" },
      ],
    },
  ],
  sort: {
    fields: [
      { value: "startDate", label: "Start Date" },
      { value: "endDate", label: "End Date" },
      { value: "createdAt", label: "Created Date" },
      { value: "totalAmount", label: "Amount" },
    ],
  },
  views: new Set([ViewOptions.Grid, ViewOptions.Table]),
};
