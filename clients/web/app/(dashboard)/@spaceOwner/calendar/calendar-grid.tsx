"use client";

import { Badge } from "@/components/primitives/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/primitives/tooltip";
import { cn, formatDateRange } from "@/lib/utils";
import { BookingStatus } from "@/types/gql/graphql";
import { IconAlertTriangle } from "@tabler/icons-react";
import {
  type CalendarView,
  DAYS_OF_WEEK,
  SPACE_COLORS,
  STATUS_LABELS,
} from "./constants";
import mock from "./mock.json";

type Booking = (typeof mock.bookings)[number];

type Props = {
  currentDate: Date;
  view: CalendarView;
  selectedSpaceId: string | null;
  onBookingClick?: (booking: Booking) => void;
};

function getBookingsForDate(
  date: Date,
  bookings: Booking[],
  selectedSpaceId: string | null
): Booking[] {
  const dateStr = date.toISOString().split("T")[0];
  return bookings.filter((booking) => {
    if (selectedSpaceId && booking.spaceId !== selectedSpaceId) return false;
    const start = new Date(booking.startDate);
    const end = new Date(booking.endDate);
    const current = new Date(dateStr);
    return current >= start && current <= end;
  });
}

function isBlockedDate(
  date: Date,
  selectedSpaceId: string | null
): { blocked: boolean; spaceIds: string[] } {
  const dateStr = date.toISOString().split("T")[0];
  const blockedForSpaces = mock.blockedDates
    .filter((bd) => bd.date === dateStr)
    .filter((bd) => !selectedSpaceId || bd.spaceId === selectedSpaceId)
    .map((bd) => bd.spaceId);
  return { blocked: blockedForSpaces.length > 0, spaceIds: blockedForSpaces };
}

function hasInstallationDeadline(date: Date, bookings: Booking[]): Booking[] {
  const dateStr = date.toISOString().split("T")[0];
  return bookings.filter(
    (b) => b.installationDeadline && b.installationDeadline === dateStr
  );
}

function getSpaceColor(spaceId: string): (typeof SPACE_COLORS)[number] {
  const space = mock.spaces.find((s) => s.id === spaceId);
  const colorIndex = space?.colorIndex ?? 0;
  return SPACE_COLORS[colorIndex % SPACE_COLORS.length];
}

function BookingEvent({
  booking,
  onClick,
}: {
  booking: Booking;
  onClick?: () => void;
}) {
  const color = getSpaceColor(booking.spaceId);
  const space = mock.spaces.find((s) => s.id === booking.spaceId);

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            onClick={onClick}
            className={cn(
              "flex h-6 w-full items-center gap-1.5 truncate rounded px-1.5 text-xs transition-opacity hover:opacity-80",
              "bg-muted/80 text-foreground"
            )}
          >
            <span className={cn("size-2 shrink-0 rounded-full", color.bg)} />
            <span className="truncate">{booking.advertiserName}</span>
          </button>
        </TooltipTrigger>
        <TooltipContent side="top" className="max-w-64">
          <div className="flex flex-col gap-1">
            <p className="font-medium">{booking.campaignName}</p>
            <p className="text-muted-foreground text-xs">
              {booking.advertiserName}
            </p>
            <p className="text-muted-foreground text-xs">{space?.title}</p>
            <p className="text-muted-foreground text-xs">
              {formatDateRange(booking.startDate, booking.endDate)}
            </p>
            <div className="mt-1 flex items-center gap-2">
              <Badge variant="secondary" className="text-xs">
                {STATUS_LABELS[booking.status as BookingStatus]}
              </Badge>
              <span className="text-muted-foreground text-xs">
                ${booking.amount.toFixed(0)}
              </span>
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

function DayCell({
  date,
  isCurrentMonth,
  isToday,
  bookings,
  selectedSpaceId,
  onBookingClick,
}: {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  bookings: Booking[];
  selectedSpaceId: string | null;
  onBookingClick?: (booking: Booking) => void;
}) {
  const dayBookings = getBookingsForDate(date, bookings, selectedSpaceId);
  const blocked = isBlockedDate(date, selectedSpaceId);
  const deadlines = hasInstallationDeadline(date, dayBookings);

  return (
    <div
      className={cn(
        "relative flex min-h-28 flex-col p-1.5",
        !isCurrentMonth && "bg-muted/30",
        blocked.blocked && "bg-muted/50"
      )}
    >
      <div className="mb-1 flex items-center justify-between">
        <span
          className={cn(
            "flex size-7 items-center justify-center rounded-full text-sm",
            isToday && "bg-primary text-primary-foreground font-medium",
            !isCurrentMonth && "text-muted-foreground"
          )}
        >
          {date.getDate()}
        </span>
        {deadlines.length > 0 && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <IconAlertTriangle className="size-4 text-amber-500" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Installation deadline</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-1">
        {dayBookings.slice(0, 3).map((booking) => (
          <BookingEvent
            key={booking.id}
            booking={booking}
            onClick={() => onBookingClick?.(booking)}
          />
        ))}
        {dayBookings.length > 3 && (
          <span className="text-muted-foreground px-1 text-xs">
            +{dayBookings.length - 3} more
          </span>
        )}
      </div>
    </div>
  );
}

function MonthView({
  currentDate,
  selectedSpaceId,
  onBookingClick,
}: {
  currentDate: Date;
  selectedSpaceId: string | null;
  onBookingClick?: (booking: Booking) => void;
}) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const firstDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  );
  const lastDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0
  );

  const startDate = new Date(firstDayOfMonth);
  startDate.setDate(startDate.getDate() - firstDayOfMonth.getDay());

  const endDate = new Date(lastDayOfMonth);
  const daysToAdd = 6 - lastDayOfMonth.getDay();
  endDate.setDate(endDate.getDate() + daysToAdd);

  const weeks: Date[][] = [];
  const current = new Date(startDate);

  while (current <= endDate) {
    const week: Date[] = [];
    for (let i = 0; i < 7; i++) {
      week.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }
    weeks.push(week);
  }

  return (
    <div className="bg-card relative flex min-w-175 flex-col rounded-xl border">
      <div className="bg-muted/30 grid grid-cols-7 border-b py-2">
        {DAYS_OF_WEEK.map((day) => (
          <div
            key={day}
            className="text-muted-foreground text-center text-sm font-medium"
          >
            {day}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 divide-x">
        {weeks.flat().map((date, i) => (
          <DayCell
            key={i}
            date={date}
            isCurrentMonth={date.getMonth() === currentDate.getMonth()}
            isToday={date.toDateString() === today.toDateString()}
            bookings={mock.bookings}
            selectedSpaceId={selectedSpaceId}
            onBookingClick={onBookingClick}
          />
        ))}
      </div>
    </div>
  );
}

function WeekView({
  currentDate,
  selectedSpaceId,
  onBookingClick,
}: {
  currentDate: Date;
  selectedSpaceId: string | null;
  onBookingClick?: (booking: Booking) => void;
}) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const startOfWeek = new Date(currentDate);
  startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());

  const days: Date[] = [];
  for (let i = 0; i < 7; i++) {
    const day = new Date(startOfWeek);
    day.setDate(startOfWeek.getDate() + i);
    days.push(day);
  }

  return (
    <div className="bg-card relative flex min-w-175 flex-col rounded-xl border">
      <div className="grid grid-cols-7 divide-x border-b">
        {days.map((date, i) => {
          const isToday = date.toDateString() === today.toDateString();
          return (
            <div
              key={i}
              className={cn(
                "flex flex-col items-center gap-1 py-3",
                isToday && "bg-primary/5"
              )}
            >
              <span className="text-muted-foreground text-xs font-medium uppercase">
                {DAYS_OF_WEEK[i]}
              </span>
              <span
                className={cn(
                  "flex size-9 items-center justify-center rounded-full text-lg font-medium",
                  isToday && "bg-primary text-primary-foreground"
                )}
              >
                {date.getDate()}
              </span>
              <span className="text-muted-foreground text-xs">
                {date.toLocaleDateString("en-US", { month: "short" })}
              </span>
            </div>
          );
        })}
      </div>
      <div className="grid min-h-100 grid-cols-7 divide-x">
        {days.map((date, i) => {
          const dayBookings = getBookingsForDate(
            date,
            mock.bookings,
            selectedSpaceId
          );
          const isToday = date.toDateString() === today.toDateString();

          return (
            <div
              key={i}
              className={cn(
                "flex flex-col gap-1.5 p-2",
                isToday && "bg-primary/5"
              )}
            >
              {dayBookings.map((booking) => (
                <BookingEvent
                  key={booking.id}
                  booking={booking}
                  onClick={() => onBookingClick?.(booking)}
                />
              ))}
              {dayBookings.length === 0 && (
                <p className="text-muted-foreground py-4 text-center text-xs">
                  No bookings
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function DayView({
  currentDate,
  selectedSpaceId,
  onBookingClick,
}: {
  currentDate: Date;
  selectedSpaceId: string | null;
  onBookingClick?: (booking: Booking) => void;
}) {
  const dayBookings = getBookingsForDate(
    currentDate,
    mock.bookings,
    selectedSpaceId
  );
  const blocked = isBlockedDate(currentDate, selectedSpaceId);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const isToday = currentDate.toDateString() === today.toDateString();

  return (
    <div className="bg-card flex min-w-100 flex-col rounded-xl border">
      <div
        className={cn(
          "flex items-center justify-between border-b px-4 py-3",
          isToday && "bg-primary/5"
        )}
      >
        <div>
          <p className="text-muted-foreground text-sm font-medium uppercase">
            {currentDate.toLocaleDateString("en-US", { weekday: "long" })}
          </p>
          <h3 className="text-2xl font-semibold">
            {currentDate.toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </h3>
        </div>
        {isToday && (
          <Badge variant="default" className="text-xs">
            Today
          </Badge>
        )}
      </div>
      {blocked.blocked && (
        <div className="bg-muted/50 border-b px-4 py-2">
          <p className="text-muted-foreground text-sm">
            Some spaces are blocked on this date
          </p>
        </div>
      )}
      <div className="flex flex-1 flex-col gap-3 p-4">
        {dayBookings.length === 0 ? (
          <p className="text-muted-foreground py-8 text-center">
            No bookings scheduled for this date
          </p>
        ) : (
          dayBookings.map((booking) => {
            const space = mock.spaces.find((s) => s.id === booking.spaceId);
            const color = getSpaceColor(booking.spaceId);

            return (
              <button
                key={booking.id}
                onClick={() => onBookingClick?.(booking)}
                className="hover:bg-muted/50 flex items-start gap-4 rounded-lg border p-4 text-left transition-colors"
              >
                <div className={cn("mt-1 h-14 w-1 rounded-full", color.bg)} />
                <div className="flex-1">
                  <p className="font-medium">{booking.campaignName}</p>
                  <p className="text-muted-foreground mt-0.5 text-sm">
                    {booking.advertiserName}
                  </p>
                  <p className="text-muted-foreground text-sm">
                    {space?.title}
                  </p>
                  <p className="text-muted-foreground mt-1.5 text-xs">
                    {formatDateRange(booking.startDate, booking.endDate)}
                  </p>
                  <div className="mt-2 flex items-center gap-2">
                    <Badge variant="secondary">
                      {STATUS_LABELS[booking.status as BookingStatus]}
                    </Badge>
                    <span className="text-muted-foreground text-sm">
                      ${booking.amount.toFixed(0)}
                    </span>
                  </div>
                </div>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}

export default function CalendarGrid({
  currentDate,
  view,
  selectedSpaceId,
  onBookingClick,
}: Props) {
  if (view === "week") {
    return (
      <WeekView
        currentDate={currentDate}
        selectedSpaceId={selectedSpaceId}
        onBookingClick={onBookingClick}
      />
    );
  }

  if (view === "day") {
    return (
      <DayView
        currentDate={currentDate}
        selectedSpaceId={selectedSpaceId}
        onBookingClick={onBookingClick}
      />
    );
  }

  return (
    <MonthView
      currentDate={currentDate}
      selectedSpaceId={selectedSpaceId}
      onBookingClick={onBookingClick}
    />
  );
}
