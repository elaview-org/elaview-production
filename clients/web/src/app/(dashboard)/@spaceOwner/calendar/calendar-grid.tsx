"use client";

import * as React from "react";
import { Badge } from "@/components/primitives/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/primitives/tooltip";
import { cn, formatCurrency, formatDateRange } from "@/lib/utils";
import { BookingStatus } from "@/types/gql/graphql";
import { IconAlertTriangle, IconStar } from "@tabler/icons-react";
import {
  type CalendarView,
  DAYS_OF_WEEK,
  SPACE_COLORS,
  STATUS_LABELS,
  INSTALLATION_DEADLINE_DAYS,
  getHolidaysForYear,
} from "./constants";
import type {
  CalendarBooking,
  CalendarSpace,
  CalendarBlockedDate,
} from "./types";

type Props = {
  currentDate: Date;
  view: CalendarView;
  spaces: CalendarSpace[];
  bookings: CalendarBooking[];
  blockedDates: CalendarBlockedDate[];
  selectedSpaceId: string | null;
  pending?: boolean;
  onBlockDates?: (dates: string[]) => void;
  onUnblockDates?: (dates: string[]) => void;
};

function getBookingsForDate(
  date: Date,
  bookings: CalendarBooking[],
  selectedSpaceId: string | null
): CalendarBooking[] {
  const dateStr = date.toISOString().split("T")[0];
  return bookings.filter((booking) => {
    if (selectedSpaceId && booking.spaceId !== selectedSpaceId) return false;
    return dateStr >= booking.startDate && dateStr <= booking.endDate;
  });
}

function isBlockedDate(
  date: Date,
  blockedDates: CalendarBlockedDate[],
  selectedSpaceId: string | null
): { blocked: boolean; spaceIds: string[] } {
  const dateStr = date.toISOString().split("T")[0];
  const blockedForSpaces = blockedDates
    .filter((bd) => bd.date === dateStr)
    .filter((bd) => !selectedSpaceId || bd.spaceId === selectedSpaceId)
    .map((bd) => bd.spaceId);
  return { blocked: blockedForSpaces.length > 0, spaceIds: blockedForSpaces };
}

function hasInstallationDeadline(
  date: Date,
  bookings: CalendarBooking[]
): CalendarBooking[] {
  const dateStr = date.toISOString().split("T")[0];
  return bookings.filter((b) => {
    if (
      b.status !== BookingStatus.Paid &&
      b.status !== BookingStatus.FileDownloaded
    )
      return false;
    const start = new Date(b.startDate + "T00:00:00");
    start.setDate(start.getDate() - INSTALLATION_DEADLINE_DAYS);
    return start.toISOString().split("T")[0] === dateStr;
  });
}

function getSpaceColor(
  spaceId: string,
  spaces: CalendarSpace[]
): (typeof SPACE_COLORS)[number] {
  const space = spaces.find((s) => s.id === spaceId);
  const colorIndex = space?.colorIndex ?? 0;
  return SPACE_COLORS[colorIndex % SPACE_COLORS.length];
}

function getHolidayForDate(date: Date): string | null {
  const holidays = getHolidaysForYear(date.getFullYear());
  const match = holidays.find(
    (h) =>
      h.date.getFullYear() === date.getFullYear() &&
      h.date.getMonth() === date.getMonth() &&
      h.date.getDate() === date.getDate()
  );
  return match?.name ?? null;
}

function BookingEvent({
  booking,
  spaces,
  onClick,
}: {
  booking: CalendarBooking;
  spaces: CalendarSpace[];
  onClick?: () => void;
}) {
  const color = getSpaceColor(booking.spaceId, spaces);
  const space = spaces.find((s) => s.id === booking.spaceId);

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
                {STATUS_LABELS[booking.status]}
              </Badge>
              <span className="text-muted-foreground text-xs">
                {formatCurrency(booking.totalAmount)}
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
  blockedDates,
  spaces,
  selectedSpaceId,
  isDragTarget,
  onMouseDown,
  onMouseEnter,
  onClick,
}: {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  bookings: CalendarBooking[];
  blockedDates: CalendarBlockedDate[];
  spaces: CalendarSpace[];
  selectedSpaceId: string | null;
  isDragTarget?: boolean;
  onMouseDown?: () => void;
  onMouseEnter?: () => void;
  onClick?: () => void;
}) {
  const dayBookings = getBookingsForDate(date, bookings, selectedSpaceId);
  const blocked = isBlockedDate(date, blockedDates, selectedSpaceId);
  const deadlines = hasInstallationDeadline(date, dayBookings);
  const holiday = getHolidayForDate(date);

  return (
    <div
      className={cn(
        "relative flex min-h-28 flex-col p-1.5",
        !isCurrentMonth && "bg-muted/30",
        blocked.blocked && "bg-destructive/5",
        isDragTarget && "bg-destructive/10",
        selectedSpaceId && isCurrentMonth && "cursor-pointer"
      )}
      onMouseDown={onMouseDown}
      onMouseEnter={onMouseEnter}
      onClick={onClick}
    >
      <div className="mb-1 flex items-center justify-between">
        <div className="flex items-center gap-1">
          <span
            className={cn(
              "flex size-7 items-center justify-center rounded-full text-sm",
              isToday && "bg-primary text-primary-foreground font-medium",
              !isCurrentMonth && "text-muted-foreground"
            )}
          >
            {date.getDate()}
          </span>
          {holiday && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <IconStar className="text-chart-rating size-3.5" />
                </TooltipTrigger>
                <TooltipContent>{holiday}</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
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
          <BookingEvent key={booking.id} booking={booking} spaces={spaces} />
        ))}
        {dayBookings.length > 3 && (
          <span className="text-muted-foreground px-1 text-xs">
            +{dayBookings.length - 3} more
          </span>
        )}
      </div>
      {blocked.blocked && (
        <span className="text-destructive absolute right-1.5 bottom-1 text-[10px] font-medium">
          Blocked
        </span>
      )}
    </div>
  );
}

function MonthView({
  currentDate,
  spaces,
  bookings,
  blockedDates,
  selectedSpaceId,
  pending,
  onBlockDates,
  onUnblockDates,
}: {
  currentDate: Date;
  spaces: CalendarSpace[];
  bookings: CalendarBooking[];
  blockedDates: CalendarBlockedDate[];
  selectedSpaceId: string | null;
  pending?: boolean;
  onBlockDates?: (dates: string[]) => void;
  onUnblockDates?: (dates: string[]) => void;
}) {
  const todayStr = React.useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d.toISOString().split("T")[0];
  }, []);
  const today = React.useMemo(
    () => new Date(todayStr + "T00:00:00"),
    [todayStr]
  );

  const [dragStart, setDragStart] = React.useState<Date | null>(null);
  const [dragEnd, setDragEnd] = React.useState<Date | null>(null);
  const [isDragging, setIsDragging] = React.useState(false);

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

  const dragDates = React.useMemo(() => {
    if (!dragStart || !dragEnd) return new Set<string>();
    const start = dragStart < dragEnd ? dragStart : dragEnd;
    const end = dragStart < dragEnd ? dragEnd : dragStart;
    const dates = new Set<string>();
    const cur = new Date(start);
    while (cur <= end) {
      const str = cur.toISOString().split("T")[0];
      const isPast = str < todayStr;
      const hasBooking =
        getBookingsForDate(cur, bookings, selectedSpaceId).length > 0;
      if (!isPast && !hasBooking) {
        dates.add(str);
      }
      cur.setDate(cur.getDate() + 1);
    }
    return dates;
  }, [dragStart, dragEnd, bookings, selectedSpaceId, todayStr]);

  React.useEffect(() => {
    if (!isDragging) return;
    const handleMouseUp = () => {
      if (dragDates.size > 0 && onBlockDates) {
        onBlockDates(Array.from(dragDates));
      }
      setIsDragging(false);
      setDragStart(null);
      setDragEnd(null);
    };
    window.addEventListener("mouseup", handleMouseUp);
    return () => window.removeEventListener("mouseup", handleMouseUp);
  }, [isDragging, dragDates, onBlockDates]);

  const handleCellMouseDown = (date: Date) => {
    if (!selectedSpaceId || pending) return;
    const isPast = date < today;
    if (isPast) return;
    const hasBooking =
      getBookingsForDate(date, bookings, selectedSpaceId).length > 0;
    if (hasBooking) return;

    setDragStart(date);
    setDragEnd(date);
    setIsDragging(true);
  };

  const handleCellMouseEnter = (date: Date) => {
    if (!isDragging) return;
    setDragEnd(date);
  };

  const handleCellClick = (date: Date) => {
    if (!selectedSpaceId || pending || isDragging) return;
    const dateStr = date.toISOString().split("T")[0];
    const isPast = date < today;
    if (isPast) return;

    const blocked = isBlockedDate(date, blockedDates, selectedSpaceId);
    if (blocked.blocked) {
      onUnblockDates?.([dateStr]);
    }
  };

  return (
    <div
      className={cn(
        "bg-card relative flex min-w-175 flex-col rounded-xl border select-none",
        pending && "pointer-events-none opacity-60"
      )}
    >
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
        {weeks.flat().map((date, i) => {
          const dateStr = date.toISOString().split("T")[0];
          return (
            <DayCell
              key={i}
              date={date}
              isCurrentMonth={date.getMonth() === currentDate.getMonth()}
              isToday={date.toDateString() === today.toDateString()}
              bookings={bookings}
              blockedDates={blockedDates}
              spaces={spaces}
              selectedSpaceId={selectedSpaceId}
              isDragTarget={dragDates.has(dateStr)}
              onMouseDown={() => handleCellMouseDown(date)}
              onMouseEnter={() => handleCellMouseEnter(date)}
              onClick={() => handleCellClick(date)}
            />
          );
        })}
      </div>
    </div>
  );
}

function WeekView({
  currentDate,
  spaces,
  bookings,
  blockedDates,
  selectedSpaceId,
}: {
  currentDate: Date;
  spaces: CalendarSpace[];
  bookings: CalendarBooking[];
  blockedDates: CalendarBlockedDate[];
  selectedSpaceId: string | null;
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
          const holiday = getHolidayForDate(date);
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
              {holiday && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <IconStar className="text-chart-rating size-3.5" />
                    </TooltipTrigger>
                    <TooltipContent>{holiday}</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>
          );
        })}
      </div>
      <div className="grid min-h-100 grid-cols-7 divide-x">
        {days.map((date, i) => {
          const dayBookings = getBookingsForDate(
            date,
            bookings,
            selectedSpaceId
          );
          const blocked = isBlockedDate(date, blockedDates, selectedSpaceId);
          const isToday = date.toDateString() === today.toDateString();

          return (
            <div
              key={i}
              className={cn(
                "flex flex-col gap-1.5 p-2",
                isToday && "bg-primary/5",
                blocked.blocked && "bg-destructive/5"
              )}
            >
              {blocked.blocked && (
                <span className="text-destructive text-[10px] font-medium">
                  Blocked
                </span>
              )}
              {dayBookings.map((booking) => (
                <BookingEvent
                  key={booking.id}
                  booking={booking}
                  spaces={spaces}
                />
              ))}
              {dayBookings.length === 0 && !blocked.blocked && (
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
  spaces,
  bookings,
  blockedDates,
  selectedSpaceId,
}: {
  currentDate: Date;
  spaces: CalendarSpace[];
  bookings: CalendarBooking[];
  blockedDates: CalendarBlockedDate[];
  selectedSpaceId: string | null;
}) {
  const dayBookings = getBookingsForDate(
    currentDate,
    bookings,
    selectedSpaceId
  );
  const blocked = isBlockedDate(currentDate, blockedDates, selectedSpaceId);
  const holiday = getHolidayForDate(currentDate);
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
        <div className="flex items-center gap-2">
          {holiday && (
            <Badge variant="outline" className="gap-1 text-xs">
              <IconStar className="text-chart-rating size-3" />
              {holiday}
            </Badge>
          )}
          {isToday && (
            <Badge variant="default" className="text-xs">
              Today
            </Badge>
          )}
        </div>
      </div>
      {blocked.blocked && (
        <div className="bg-destructive/5 border-b px-4 py-2">
          <p className="text-destructive text-sm">
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
            const space = spaces.find((s) => s.id === booking.spaceId);
            const color = getSpaceColor(booking.spaceId, spaces);

            return (
              <div
                key={booking.id}
                className="flex items-start gap-4 rounded-lg border p-4"
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
                      {STATUS_LABELS[booking.status]}
                    </Badge>
                    <span className="text-muted-foreground text-sm">
                      {formatCurrency(booking.totalAmount)}
                    </span>
                  </div>
                </div>
              </div>
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
  spaces,
  bookings,
  blockedDates,
  selectedSpaceId,
  pending,
  onBlockDates,
  onUnblockDates,
}: Props) {
  if (view === "week") {
    return (
      <WeekView
        currentDate={currentDate}
        spaces={spaces}
        bookings={bookings}
        blockedDates={blockedDates}
        selectedSpaceId={selectedSpaceId}
      />
    );
  }

  if (view === "day") {
    return (
      <DayView
        currentDate={currentDate}
        spaces={spaces}
        bookings={bookings}
        blockedDates={blockedDates}
        selectedSpaceId={selectedSpaceId}
      />
    );
  }

  return (
    <MonthView
      currentDate={currentDate}
      spaces={spaces}
      bookings={bookings}
      blockedDates={blockedDates}
      selectedSpaceId={selectedSpaceId}
      pending={pending}
      onBlockDates={onBlockDates}
      onUnblockDates={onUnblockDates}
    />
  );
}
