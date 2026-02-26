"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/primitives/button";
import { cn } from "@/lib/core/utils";
import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";
import api from "@/api/client";
import { toast } from "sonner";

type BookedDate = {
  date: string;
  bookingId: string;
};

type BlockedDate = {
  date: string;
};

type Props = {
  spaceId: string;
  bookedDates?: BookedDate[];
  blockedDates?: BlockedDate[];
};

export default function SpaceCalendar({
  spaceId,
  bookedDates = [],
  blockedDates: initialBlockedDates = [],
}: Props) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [blockedDates, setBlockedDates] = useState(initialBlockedDates);
  const { blockDates, isPending: isBlockPending } =
    api.listings.useBlockDates();
  const { unblockDates, isPending: isUnblockPending } =
    api.listings.useUnblockDates();
  const pending = isBlockPending || isUnblockPending;

  const { days, monthLabel } = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    const startPadding = firstDay.getDay();
    const daysInMonth = lastDay.getDate();

    const days: Array<{ date: Date; isCurrentMonth: boolean }> = [];

    for (let i = startPadding - 1; i >= 0; i--) {
      const date = new Date(year, month, -i);
      days.push({ date, isCurrentMonth: false });
    }

    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(year, month, i);
      days.push({ date, isCurrentMonth: true });
    }

    const remaining = 42 - days.length;
    for (let i = 1; i <= remaining; i++) {
      const date = new Date(year, month + 1, i);
      days.push({ date, isCurrentMonth: false });
    }

    const monthLabel = currentDate.toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    });

    return { days, monthLabel };
  }, [currentDate]);

  const bookedDateSet = useMemo(
    () => new Set(bookedDates.map((d) => d.date)),
    [bookedDates]
  );
  const blockedDateSet = useMemo(
    () => new Set(blockedDates.map((d) => d.date)),
    [blockedDates]
  );

  const goToPrevMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
    );
  };

  const goToNextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
    );
  };

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const handleDateClick = (
    date: Date,
    dateStr: string,
    isBooked: boolean,
    isBlocked: boolean
  ) => {
    if (isBooked || date < today) return;

    if (isBlocked) {
      unblockDates(spaceId, [dateStr], (result) => {
        if (result.success) {
          setBlockedDates((prev) => prev.filter((d) => d.date !== dateStr));
          toast.success("Date unblocked");
        } else {
          toast.error(result.error ?? "Failed to unblock date");
        }
      });
    } else {
      blockDates(spaceId, [dateStr], (result) => {
        if (result.success) {
          setBlockedDates((prev) => [...prev, { date: dateStr }]);
          toast.success("Date blocked");
        } else {
          toast.error(result.error ?? "Failed to block date");
        }
      });
    }
  };

  return (
    <div className="rounded-lg border">
      <div className="flex items-center justify-between border-b px-4 py-3">
        <h2 className="font-medium">Availability Calendar</h2>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={goToPrevMonth}
            disabled={pending}
          >
            <IconChevronLeft className="size-4" />
          </Button>
          <span className="w-32 text-center text-sm font-medium">
            {monthLabel}
          </span>
          <Button
            variant="ghost"
            size="icon"
            onClick={goToNextMonth}
            disabled={pending}
          >
            <IconChevronRight className="size-4" />
          </Button>
        </div>
      </div>

      <div className="p-4">
        <div className="mb-2 grid grid-cols-7 gap-1 text-center">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div
              key={day}
              className="text-muted-foreground py-1 text-xs font-medium"
            >
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {days.map(({ date, isCurrentMonth }, i) => {
            const dateStr = date.toISOString().split("T")[0];
            const isBooked = bookedDateSet.has(dateStr);
            const isBlocked = blockedDateSet.has(dateStr);
            const isToday = date.getTime() === today.getTime();
            const isPast = date < today;
            const isClickable = isCurrentMonth && !isBooked && !isPast;

            return (
              <button
                key={i}
                type="button"
                disabled={!isClickable || pending}
                onClick={() =>
                  handleDateClick(date, dateStr, isBooked, isBlocked)
                }
                className={cn(
                  "flex aspect-square items-center justify-center rounded-md text-sm transition-colors",
                  !isCurrentMonth && "text-muted-foreground/50",
                  isClickable && !isBlocked && "hover:bg-muted cursor-pointer",
                  isBooked && "bg-primary/20 text-primary cursor-not-allowed",
                  isBlocked &&
                    "bg-destructive/20 text-destructive hover:bg-destructive/30 cursor-pointer",
                  isToday && "ring-primary ring-2 ring-offset-2",
                  isPast &&
                    !isBooked &&
                    !isBlocked &&
                    "text-muted-foreground/50 cursor-not-allowed",
                  pending && "opacity-50"
                )}
              >
                {date.getDate()}
              </button>
            );
          })}
        </div>

        <div className="mt-4 flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5">
            <div className="bg-primary/20 size-3 rounded" />
            <span className="text-muted-foreground">Booked</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="bg-destructive/20 size-3 rounded" />
            <span className="text-muted-foreground">Blocked</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="size-3 rounded border" />
            <span className="text-muted-foreground">Available</span>
          </div>
        </div>

        <p className="text-muted-foreground mt-3 text-xs">
          Click on available dates to block them. Click on blocked dates to
          unblock.
        </p>
      </div>
    </div>
  );
}

export function CalendarSkeleton() {
  return (
    <div className="rounded-lg border">
      <div className="flex items-center justify-between border-b px-4 py-3">
        <div className="bg-muted h-5 w-36 animate-pulse rounded" />
        <div className="bg-muted h-8 w-40 animate-pulse rounded" />
      </div>
      <div className="p-4">
        <div className="mb-2 grid grid-cols-7 gap-1">
          {Array.from({ length: 7 }).map((_, i) => (
            <div
              key={i}
              className="bg-muted mx-auto h-4 w-8 animate-pulse rounded"
            />
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {Array.from({ length: 35 }).map((_, i) => (
            <div
              key={i}
              className="bg-muted aspect-square animate-pulse rounded-md"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
