import { BOOKING_STATUS } from "@/lib/constants";
import { BookingStatus } from "@/types/gql/graphql";

export const CALENDAR_VIEWS = [
  { value: "month", label: "Month" },
  { value: "week", label: "Week" },
  { value: "day", label: "Day" },
] as const;

export type CalendarView = (typeof CALENDAR_VIEWS)[number]["value"];

export const STATUS_LABELS = BOOKING_STATUS.labels;

export const STATUS_COLORS: Record<BookingStatus, string> = {
  [BookingStatus.PendingApproval]: "bg-amber-500",
  [BookingStatus.Approved]: "bg-blue-500",
  [BookingStatus.Paid]: "bg-emerald-500",
  [BookingStatus.FileDownloaded]: "bg-cyan-500",
  [BookingStatus.Installed]: "bg-violet-500",
  [BookingStatus.Verified]: "bg-green-500",
  [BookingStatus.Completed]: "bg-primary",
  [BookingStatus.Disputed]: "bg-destructive",
  [BookingStatus.Rejected]: "bg-muted-foreground",
  [BookingStatus.Cancelled]: "bg-muted-foreground",
};

export const ACTIVE_STATUSES = [
  BookingStatus.PendingApproval,
  BookingStatus.Approved,
  BookingStatus.Paid,
  BookingStatus.FileDownloaded,
  BookingStatus.Installed,
  BookingStatus.Verified,
] as const;

export const SPACE_COLORS = [
  { bg: "bg-blue-500", border: "border-blue-500", text: "text-blue-500" },
  { bg: "bg-emerald-500", border: "border-emerald-500", text: "text-emerald-500" },
  { bg: "bg-violet-500", border: "border-violet-500", text: "text-violet-500" },
  { bg: "bg-amber-500", border: "border-amber-500", text: "text-amber-500" },
  { bg: "bg-rose-500", border: "border-rose-500", text: "text-rose-500" },
  { bg: "bg-cyan-500", border: "border-cyan-500", text: "text-cyan-500" },
  { bg: "bg-orange-500", border: "border-orange-500", text: "text-orange-500" },
  { bg: "bg-pink-500", border: "border-pink-500", text: "text-pink-500" },
] as const;

export const DAYS_OF_WEEK = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const;

export const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
] as const;