import {
  IconCircleCheckFilled,
  IconClock,
  IconLoader,
} from "@tabler/icons-react";

export const ACTIVITY_TYPES = {
  booking: "Booking",
  payment: "Payment",
  verification: "Verification",
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

export const CAMPAIGN_STATUS_CONFIG = {
  ACTIVE: {
    label: "Active",
    variant: "default" as const,
    color: "text-green-500",
  },
  PENDING: {
    label: "Pending",
    variant: "secondary" as const,
    color: "text-yellow-500",
  },
  COMPLETED: {
    label: "Completed",
    variant: "outline" as const,
    color: "text-muted-foreground",
  },
} as const;

export type CampaignStatus = keyof typeof CAMPAIGN_STATUS_CONFIG;

export const CHART_CONFIG = {
  spending: {
    label: "Spending",
    color: "var(--primary)",
  },
} as const;
