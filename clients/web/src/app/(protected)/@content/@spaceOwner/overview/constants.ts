import { IconDownload, IconTool, IconCamera } from "@tabler/icons-react";

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
