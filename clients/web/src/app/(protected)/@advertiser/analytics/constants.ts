import { BookingStatus } from "@/types/gql/graphql";
import type { ChartConfig } from "@/components/primitives/chart";

export const TIME_RANGES = [
  { value: "90d", label: "Last 3 months", days: 90 },
  { value: "30d", label: "Last 30 days", days: 30 },
  { value: "7d", label: "Last 7 days", days: 7 },
] as const;

export type TimeRange = (typeof TIME_RANGES)[number]["value"];

export const MONTH_RANGES = [
  { value: "12m", label: "Last 12 months", months: 12 },
  { value: "6m", label: "Last 6 months", months: 6 },
  { value: "3m", label: "Last 3 months", months: 3 },
] as const;

export type MonthRange = (typeof MONTH_RANGES)[number]["value"];

export const SPENDING_CHART_CONFIG = {
  spending: {
    label: "Spending",
    color: "var(--chart-revenue)",
  },
} satisfies ChartConfig;

export const REACH_CHART_CONFIG = {
  reach: {
    label: "Reach",
    color: "var(--chart-bookings)",
  },
  impressions: {
    label: "Impressions",
    color: "var(--chart-revenue)",
  },
} satisfies ChartConfig;

export const MONTHLY_CHART_CONFIG = {
  spending: {
    label: "Spending",
    color: "var(--chart-revenue)",
  },
  impressions: {
    label: "Impressions",
    color: "var(--chart-bookings)",
  },
} satisfies ChartConfig;

export const STATUS_CHART_CONFIG = {
  [BookingStatus.PendingApproval]: {
    label: "Pending",
    color: "oklch(0.795 0.184 86.047)",
  },
  [BookingStatus.Approved]: {
    label: "Approved",
    color: "oklch(0.685 0.169 237.323)",
  },
  [BookingStatus.Paid]: {
    label: "Paid",
    color: "oklch(0.723 0.219 149.579)",
  },
  [BookingStatus.FileDownloaded]: {
    label: "Downloaded",
    color: "oklch(0.752 0.177 215.221)",
  },
  [BookingStatus.Installed]: {
    label: "Installed",
    color: "oklch(0.702 0.183 293.541)",
  },
  [BookingStatus.Verified]: {
    label: "Verified",
    color: "oklch(0.765 0.177 163.223)",
  },
  [BookingStatus.Completed]: {
    label: "Completed",
    color: "oklch(0.696 0.17 162.48)",
  },
  [BookingStatus.Disputed]: {
    label: "Disputed",
    color: "oklch(0.637 0.237 25.331)",
  },
  [BookingStatus.Rejected]: {
    label: "Rejected",
    color: "oklch(0.645 0.246 16.439)",
  },
  [BookingStatus.Cancelled]: {
    label: "Cancelled",
    color: "oklch(0.553 0.013 285.938)",
  },
} satisfies ChartConfig;

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
