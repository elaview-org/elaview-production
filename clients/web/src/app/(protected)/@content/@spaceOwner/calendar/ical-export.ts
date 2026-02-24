import type {
  CalendarBooking,
  CalendarSpace,
  CalendarBlockedDate,
} from "./types";

function formatICalDate(dateStr: string): string {
  return dateStr.replace(/-/g, "");
}

function escapeICalText(text: string): string {
  return text
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\n/g, "\\n");
}

function generateUID(id: string): string {
  return `${id}@elaview.com`;
}

export function generateICalString(
  bookings: CalendarBooking[],
  spaces: CalendarSpace[],
  blockedDates: CalendarBlockedDate[]
): string {
  const spaceMap = new Map(spaces.map((s) => [s.id, s]));
  const now = new Date().toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";

  const lines: string[] = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Elaview//Calendar//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
  ];

  for (const booking of bookings) {
    const space = spaceMap.get(booking.spaceId);
    const summary = `${booking.campaignName} @ ${space?.title ?? "Unknown Space"}`;
    lines.push(
      "BEGIN:VEVENT",
      `UID:${generateUID(booking.id)}`,
      `DTSTAMP:${now}`,
      `DTSTART;VALUE=DATE:${formatICalDate(booking.startDate)}`,
      `DTEND;VALUE=DATE:${formatICalDate(booking.endDate)}`,
      `SUMMARY:${escapeICalText(summary)}`,
      `DESCRIPTION:${escapeICalText(`Advertiser: ${booking.advertiserName}\\nStatus: ${booking.status}\\nAmount: $${booking.totalAmount}`)}`,
      `STATUS:CONFIRMED`,
      "END:VEVENT"
    );
  }

  const blockedBySpace = new Map<string, string[]>();
  for (const bd of blockedDates) {
    const existing = blockedBySpace.get(bd.spaceId) ?? [];
    existing.push(bd.date);
    blockedBySpace.set(bd.spaceId, existing);
  }

  for (const [spaceId, dates] of blockedBySpace) {
    const space = spaceMap.get(spaceId);
    for (const date of dates) {
      const nextDay = new Date(date + "T00:00:00");
      nextDay.setDate(nextDay.getDate() + 1);
      const endDate = nextDay.toISOString().split("T")[0];

      lines.push(
        "BEGIN:VEVENT",
        `UID:blocked-${spaceId}-${date}@elaview.com`,
        `DTSTAMP:${now}`,
        `DTSTART;VALUE=DATE:${formatICalDate(date)}`,
        `DTEND;VALUE=DATE:${formatICalDate(endDate)}`,
        `SUMMARY:${escapeICalText(`Blocked: ${space?.title ?? "Unknown Space"}`)}`,
        `CATEGORIES:BLOCKED`,
        `TRANSP:OPAQUE`,
        "END:VEVENT"
      );
    }
  }

  lines.push("END:VCALENDAR");
  return lines.join("\r\n");
}

export function downloadICalFile(
  bookings: CalendarBooking[],
  spaces: CalendarSpace[],
  blockedDates: CalendarBlockedDate[]
) {
  const content = generateICalString(bookings, spaces, blockedDates);
  const blob = new Blob([content], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "elaview-calendar.ics";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
