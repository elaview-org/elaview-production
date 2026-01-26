import {
  IconCircleCheckFilled,
  IconClock,
  IconLoader,
  IconDownload,
  IconTool,
  IconCamera,
} from "@tabler/icons-react";

export const ACTIVITY_TYPES = {
  booking: "Booking",
  payout: "Payout",
  review: "Review",
} as const;

export type ActivityType = keyof typeof ACTIVITY_TYPES;

export const ACTIVITY_STATUS = {
  completed: {
    label: "Completed",
    icon: IconCircleCheckFilled,
    className: "fill-green-500 dark:fill-green-400",
  },
  pending: {
    label: "Pending",
    icon: IconClock,
    className: "text-yellow-500",
  },
  processing: {
    label: "Processing",
    icon: IconLoader,
    className: "text-blue-500",
  },
} as const;

export type ActivityStatus = keyof typeof ACTIVITY_STATUS;

export const BOOKING_STATUS_CONFIG = {
  PAID: {
    label: "Paid",
    step: 1,
    color: "text-blue-500",
    bgColor: "bg-blue-500",
  },
  FILE_DOWNLOADED: {
    label: "Downloaded",
    step: 2,
    color: "text-purple-500",
    bgColor: "bg-purple-500",
  },
  INSTALLED: {
    label: "Installed",
    step: 3,
    color: "text-orange-500",
    bgColor: "bg-orange-500",
  },
  VERIFIED: {
    label: "Verified",
    step: 4,
    color: "text-green-500",
    bgColor: "bg-green-500",
  },
} as const;

export type ActiveBookingStatus = keyof typeof BOOKING_STATUS_CONFIG;

export const NEXT_ACTION_CONFIG = {
  "Download File": {
    icon: IconDownload,
    color: "text-blue-500",
    bgColor: "bg-blue-100 dark:bg-blue-950",
  },
  "Mark Installed": {
    icon: IconTool,
    color: "text-purple-500",
    bgColor: "bg-purple-100 dark:bg-purple-950",
  },
  "Upload Verification": {
    icon: IconCamera,
    color: "text-orange-500",
    bgColor: "bg-orange-100 dark:bg-orange-950",
  },
} as const;

export type NextAction = keyof typeof NEXT_ACTION_CONFIG;

export const CHART_CONFIG = {
  bookings: {
    label: "Bookings",
    color: "var(--primary)",
  },
  earnings: {
    label: "Earnings",
    color: "var(--chart-2)",
  },
} as const;

export const TIME_RANGES = [
  { value: "90d", label: "Last 3 months", days: 90 },
  { value: "30d", label: "Last 30 days", days: 30 },
  { value: "7d", label: "Last 7 days", days: 7 },
] as const;

export type TimeRange = (typeof TIME_RANGES)[number]["value"];