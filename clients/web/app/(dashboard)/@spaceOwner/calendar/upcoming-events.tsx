"use client";

import { Badge } from "@/components/primitives/badge";
import { cn } from "@/lib/utils";
import { BookingStatus } from "@/types/gql/graphql";
import { IconAlertTriangle } from "@tabler/icons-react";
import { SPACE_COLORS, STATUS_LABELS } from "./constants";
import mock from "./mock.json";

type Booking = (typeof mock.bookings)[number];

type Props = {
  selectedSpaceId: string | null;
  onBookingClick?: (booking: Booking) => void;
};

function formatDateRange(startDate: string, endDate: string): string {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const options: Intl.DateTimeFormatOptions = { month: "short", day: "numeric" };

  if (start.getMonth() === end.getMonth()) {
    return `${start.toLocaleDateString("en-US", options)} - ${end.getDate()}`;
  }
  return `${start.toLocaleDateString("en-US", options)} - ${end.toLocaleDateString("en-US", options)}`;
}

function daysUntil(dateStr: string): number {
  const date = new Date(dateStr);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  date.setHours(0, 0, 0, 0);
  return Math.ceil((date.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

export default function UpcomingEvents({
  selectedSpaceId,
  onBookingClick,
}: Props) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const upcomingBookings = mock.bookings
    .filter((booking) => {
      if (selectedSpaceId && booking.spaceId !== selectedSpaceId) return false;
      const endDate = new Date(booking.endDate);
      return endDate >= today;
    })
    .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
    .slice(0, 5);

  const deadlines = mock.bookings
    .filter((booking) => {
      if (!booking.installationDeadline) return false;
      if (selectedSpaceId && booking.spaceId !== selectedSpaceId) return false;
      const deadline = new Date(booking.installationDeadline);
      return deadline >= today;
    })
    .sort(
      (a, b) =>
        new Date(a.installationDeadline!).getTime() -
        new Date(b.installationDeadline!).getTime()
    );

  return (
    <div className="flex flex-col gap-4 rounded-xl border bg-card p-4">
      {deadlines.length > 0 && (
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <IconAlertTriangle className="size-4 text-amber-500" />
            <h3 className="font-medium">Upcoming Deadlines</h3>
          </div>
          <div className="flex flex-col gap-2">
            {deadlines.map((booking) => {
              const space = mock.spaces.find((s) => s.id === booking.spaceId);
              const color =
                SPACE_COLORS[
                  (space?.colorIndex ?? 0) % SPACE_COLORS.length
                ];
              const days = daysUntil(booking.installationDeadline!);

              return (
                <button
                  key={`deadline-${booking.id}`}
                  onClick={() => onBookingClick?.(booking)}
                  className="flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 p-3 text-left transition-colors hover:bg-amber-100 dark:border-amber-900 dark:bg-amber-950/50 dark:hover:bg-amber-950"
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
                </button>
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
              const space = mock.spaces.find((s) => s.id === booking.spaceId);
              const color =
                SPACE_COLORS[
                  (space?.colorIndex ?? 0) % SPACE_COLORS.length
                ];

              return (
                <button
                  key={booking.id}
                  onClick={() => onBookingClick?.(booking)}
                  className="flex items-start gap-3 rounded-lg border p-3 text-left transition-colors hover:bg-muted/50"
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
                        {STATUS_LABELS[booking.status as BookingStatus]}
                      </Badge>
                      <span className="text-muted-foreground text-xs">
                        {formatDateRange(booking.startDate, booking.endDate)}
                      </span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}