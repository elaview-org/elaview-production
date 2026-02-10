import { BOOKING_STATUS } from "@/lib/constants";
import { BookingStatus } from "@/types/gql/graphql";

export const CALENDAR_VIEWS = [
  { value: "month", label: "Month" },
  { value: "week", label: "Week" },
  { value: "day", label: "Day" },
] as const;

export type CalendarView = (typeof CALENDAR_VIEWS)[number]["value"];

export const STATUS_LABELS = BOOKING_STATUS.labels;

export const STATUS_INDICATORS = BOOKING_STATUS.indicators;

export const ACTIVE_STATUSES = [
  BookingStatus.PendingApproval,
  BookingStatus.Approved,
  BookingStatus.Paid,
  BookingStatus.FileDownloaded,
  BookingStatus.Installed,
  BookingStatus.Verified,
] as const;

export const STATUS_FILTER_OPTIONS = [
  { value: BookingStatus.PendingApproval, label: "Pending" },
  { value: BookingStatus.Approved, label: "Approved" },
  { value: BookingStatus.Paid, label: "Paid" },
  { value: BookingStatus.FileDownloaded, label: "Downloaded" },
  { value: BookingStatus.Installed, label: "Installed" },
  { value: BookingStatus.Verified, label: "Verified" },
  { value: BookingStatus.Completed, label: "Completed" },
  { value: BookingStatus.Cancelled, label: "Cancelled" },
] as const;

export const SPACE_COLORS = [
  { bg: "bg-chart-1", border: "border-chart-1", text: "text-chart-1" },
  { bg: "bg-chart-2", border: "border-chart-2", text: "text-chart-2" },
  { bg: "bg-chart-3", border: "border-chart-3", text: "text-chart-3" },
  { bg: "bg-chart-4", border: "border-chart-4", text: "text-chart-4" },
  { bg: "bg-chart-5", border: "border-chart-5", text: "text-chart-5" },
  {
    bg: "bg-chart-bookings",
    border: "border-chart-bookings",
    text: "text-chart-bookings",
  },
  {
    bg: "bg-chart-revenue",
    border: "border-chart-revenue",
    text: "text-chart-revenue",
  },
  {
    bg: "bg-chart-rating",
    border: "border-chart-rating",
    text: "text-chart-rating",
  },
] as const;

export const DAYS_OF_WEEK = [
  "Sun",
  "Mon",
  "Tue",
  "Wed",
  "Thu",
  "Fri",
  "Sat",
] as const;

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

export const INSTALLATION_DEADLINE_DAYS = 3;

type Holiday = { name: string; date: Date };

function nthWeekdayOfMonth(
  year: number,
  month: number,
  weekday: number,
  n: number
): Date {
  const first = new Date(year, month, 1);
  const firstWeekday = first.getDay();
  const day = 1 + ((weekday - firstWeekday + 7) % 7) + (n - 1) * 7;
  return new Date(year, month, day);
}

function lastWeekdayOfMonth(
  year: number,
  month: number,
  weekday: number
): Date {
  const last = new Date(year, month + 1, 0);
  const lastWeekday = last.getDay();
  const diff = (lastWeekday - weekday + 7) % 7;
  return new Date(year, month, last.getDate() - diff);
}

export function getHolidaysForYear(year: number): Holiday[] {
  return [
    { name: "New Year's Day", date: new Date(year, 0, 1) },
    { name: "MLK Day", date: nthWeekdayOfMonth(year, 0, 1, 3) },
    { name: "Presidents' Day", date: nthWeekdayOfMonth(year, 1, 1, 3) },
    { name: "Memorial Day", date: lastWeekdayOfMonth(year, 4, 1) },
    { name: "Independence Day", date: new Date(year, 6, 4) },
    { name: "Labor Day", date: nthWeekdayOfMonth(year, 8, 1, 1) },
    { name: "Columbus Day", date: nthWeekdayOfMonth(year, 9, 1, 2) },
    { name: "Veterans Day", date: new Date(year, 10, 11) },
    { name: "Thanksgiving", date: nthWeekdayOfMonth(year, 10, 4, 4) },
    { name: "Christmas", date: new Date(year, 11, 25) },
  ];
}
