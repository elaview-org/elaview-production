// src/lib/date-utils.ts

/**
 * Date utility functions for consistent date handling across client and server.
 * All dates are normalized to UTC to avoid timezone issues.
 */

/**
 * Normalizes a date to start of day in UTC (00:00:00.000)
 * This ensures consistent comparison regardless of client timezone.
 *
 * @param date - Date object or ISO string
 * @returns Date object set to start of day in UTC
 */
export function normalizeToUTCStartOfDay(date: Date | string): Date {
  const d = new Date(date);
  const utcDate = new Date(
    Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate(), 0, 0, 0, 0)
  );
  return utcDate;
}

/**
 * Normalizes a date to end of day in UTC (23:59:59.999)
 * Used for inclusive end date comparisons.
 *
 * @param date - Date object or ISO string
 * @returns Date object set to end of day in UTC
 */
export function normalizeToUTCEndOfDay(date: Date | string): Date {
  const d = new Date(date);
  const utcDate = new Date(
    Date.UTC(
      d.getUTCFullYear(),
      d.getUTCMonth(),
      d.getUTCDate(),
      23,
      59,
      59,
      999
    )
  );
  return utcDate;
}

/**
 * Checks if a date range is available for booking.
 * Performs inclusive checks: startDate >= availableFrom AND endDate <= availableTo
 *
 * @param startDate - Booking start date
 * @param endDate - Booking end date
 * @param availableFrom - Space availability start date (inclusive)
 * @param availableTo - Space availability end date (inclusive, null = no end date)
 * @returns true if the date range is valid for booking
 */
export function isDateRangeAvailable(
  startDate: Date | string,
  endDate: Date | string,
  availableFrom: Date | string,
  availableTo: Date | string | null
): boolean {
  const start = normalizeToUTCStartOfDay(startDate);
  const end = normalizeToUTCEndOfDay(endDate);
  const from = normalizeToUTCStartOfDay(availableFrom);
  const to = availableTo ? normalizeToUTCEndOfDay(availableTo) : null;

  // Start date must be on or after availableFrom (inclusive)
  if (start < from) return false;

  // If availableTo exists, end date must be on or before it (inclusive)
  if (to && end > to) return false;

  return true;
}

/**
 * Formats a date as YYYY-MM-DD for display
 *
 * @param date - Date object or ISO string
 * @returns Formatted date string
 */
export function formatDateYYYYMMDD(date: Date | string): string {
  const d = new Date(date);
  return d.toISOString().split("T")[0]!;
}

/**
 * Checks if two dates are the same day (ignoring time)
 *
 * @param date1 - First date
 * @param date2 - Second date
 * @returns true if dates are the same day in UTC
 */
export function isSameDay(date1: Date | string, date2: Date | string): boolean {
  const d1 = normalizeToUTCStartOfDay(date1);
  const d2 = normalizeToUTCStartOfDay(date2);
  return d1.getTime() === d2.getTime();
}

/**
 * Gets the number of days between two dates (inclusive)
 *
 * @param startDate - Start date
 * @param endDate - End date
 * @returns Number of days (minimum 1 for same day booking)
 */
export function getDaysBetween(
  startDate: Date | string,
  endDate: Date | string
): number {
  const start = normalizeToUTCStartOfDay(startDate);
  const end = normalizeToUTCStartOfDay(endDate);
  const diffTime = end.getTime() - start.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return Math.max(1, diffDays + 1); // +1 to make it inclusive, minimum 1 day
}
