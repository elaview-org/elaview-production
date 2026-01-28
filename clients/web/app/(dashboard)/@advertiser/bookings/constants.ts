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
      placeholder: "Status",
      fields: [
        { value: "pending", label: "Pending Approval" },
        { value: "approved", label: "Approved" },
        { value: "active", label: "Active" },
        { value: "verification", label: "Needs Verification" },
        { value: "completed", label: "Completed" },
        { value: "disputed", label: "Disputed" },
      ],
    },
  ],
  sort: {
    fields: [
      { value: "startDate", label: "Start Date" },
      { value: "createdAt", label: "Booking Date" },
      { value: "totalPrice", label: "Amount" },
    ],
  },
  views: new Set([ViewOptions.Grid, ViewOptions.Table]),
};
