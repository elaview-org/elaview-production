"use client";

import { Badge } from "@/components/primitives/badge";
import { cn, formatDateRange } from "@/lib/core/utils";
import { BookingStatus } from "@/types/gql/graphql";
import { IconAlertTriangle } from "@tabler/icons-react";
import {
  SPACE_COLORS,
  STATUS_LABELS,
  INSTALLATION_DEADLINE_DAYS,
} from "./constants";
import type { CalendarBooking, CalendarSpace } from "./types";

type Props = {
  spaces: CalendarSpace[];
  bookings: CalendarBooking[];
  selectedSpaceId: string | null;
};

function daysUntil(dateStr: string): number {
  const date = new Date(dateStr);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  date.setHours(0, 0, 0, 0);
  return Math.ceil((date.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

function getInstallationDeadline(booking: CalendarBooking): string | null {
  if (
    booking.status !== BookingStatus.Paid &&
    booking.status !== BookingStatus.FileDownloaded
  )
    return null;
  const start = new Date(booking.startDate + "T00:00:00");
  start.setDate(start.getDate() - INSTALLATION_DEADLINE_DAYS);
  return start.toISOString().split("T")[0];
}

export default function UpcomingEvents({
  spaces,
  bookings,
  selectedSpaceId,
}: Props) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const upcomingBookings = bookings
    .filter((booking) => {
      if (selectedSpaceId && booking.spaceId !== selectedSpaceId) return false;
      const endDate = new Date(booking.endDate);
      return endDate >= today;
    })
    .sort(
      (a, b) =>
        new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
    )
    .slice(0, 5);

  const deadlines = bookings
    .filter((booking) => {
      const deadline = getInstallationDeadline(booking);
      if (!deadline) return false;
      if (selectedSpaceId && booking.spaceId !== selectedSpaceId) return false;
      return new Date(deadline) >= today;
    })
    .sort((a, b) => {
      const da = getInstallationDeadline(a)!;
      const db = getInstallationDeadline(b)!;
      return new Date(da).getTime() - new Date(db).getTime();
    });

  return (
    <div className="bg-card flex flex-col gap-4 rounded-xl border p-4">
      {deadlines.length > 0 && (
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <IconAlertTriangle className="size-4 text-amber-500" />
            <h3 className="font-medium">Upcoming Deadlines</h3>
          </div>
          <div className="flex flex-col gap-2">
            {deadlines.map((booking) => {
              const space = spaces.find((s) => s.id === booking.spaceId);
              const color =
                SPACE_COLORS[(space?.colorIndex ?? 0) % SPACE_COLORS.length];
              const deadline = getInstallationDeadline(booking)!;
              const days = daysUntil(deadline);

              return (
                <div
                  key={`deadline-${booking.id}`}
                  className="flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 p-3 dark:border-amber-900 dark:bg-amber-950/50"
                >
                  <div
                    className={cn(
                      "mt-0.5 h-10 w-1 shrink-0 rounded-full",
                      color.bg
                    )}
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">
                      {booking.campaignName}
                    </p>
                    <p className="text-muted-foreground truncate text-xs">
                      {space?.title}
                    </p>
                    <p className="mt-1 text-xs font-medium text-amber-600 dark:text-amber-400">
                      {days === 0
                        ? "Due today"
                        : days === 1
                          ? "Due tomorrow"
                          : `Due in ${days} days`}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="flex flex-col gap-3">
        <h3 className="font-medium">Upcoming Bookings</h3>
        {upcomingBookings.length === 0 ? (
          <p className="text-muted-foreground py-4 text-center text-sm">
            No upcoming bookings
          </p>
        ) : (
          <div className="flex flex-col gap-2">
            {upcomingBookings.map((booking) => {
              const space = spaces.find((s) => s.id === booking.spaceId);
              const color =
                SPACE_COLORS[(space?.colorIndex ?? 0) % SPACE_COLORS.length];

              return (
                <div
                  key={booking.id}
                  className="flex items-start gap-3 rounded-lg border p-3"
                >
                  <div
                    className={cn(
                      "mt-0.5 h-10 w-1 shrink-0 rounded-full",
                      color.bg
                    )}
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">
                      {booking.campaignName}
                    </p>
                    <p className="text-muted-foreground truncate text-xs">
                      {space?.title}
                    </p>
                    <div className="mt-1 flex items-center gap-2">
                      <Badge variant="secondary" className="text-xs">
                        {STATUS_LABELS[booking.status]}
                      </Badge>
                      <span className="text-muted-foreground text-xs">
                        {formatDateRange(booking.startDate, booking.endDate)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
