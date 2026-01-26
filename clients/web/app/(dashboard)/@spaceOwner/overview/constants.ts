import {
  IconCircleCheckFilled,
  IconClock,
  IconLoader,
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