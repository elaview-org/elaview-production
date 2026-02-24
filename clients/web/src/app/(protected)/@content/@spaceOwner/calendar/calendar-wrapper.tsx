"use client";

import * as React from "react";
import { useTransition } from "react";
import { toast } from "sonner";
import { BookingStatus } from "@/types/gql/graphql";
import CalendarHeader from "./calendar-header";
import CalendarGrid from "./calendar-grid";
import UpcomingEvents from "./upcoming-events";
import type { CalendarView } from "./constants";
import type {
  CalendarSpace,
  CalendarBooking,
  CalendarBlockedDate,
} from "./types";
import { blockDatesAction, unblockDatesAction } from "./calendar.actions";
import BlockDatesDialog from "./block-dates-dialog";

type Props = {
  spaces: CalendarSpace[];
  initialBookings: CalendarBooking[];
  initialBlockedDates: CalendarBlockedDate[];
};

export default function CalendarWrapper({
  spaces,
  initialBookings,
  initialBlockedDates,
}: Props) {
  const [currentDate, setCurrentDate] = React.useState(() => new Date());
  const [view, setView] = React.useState<CalendarView>("month");
  const [selectedSpaceId, setSelectedSpaceId] = React.useState<string | null>(
    null
  );
  const [statusFilter, setStatusFilter] = React.useState<
    BookingStatus[] | null
  >(null);
  const [blockedDates, setBlockedDates] = React.useState(initialBlockedDates);
  const [pending, startTransition] = useTransition();
  const [blockDialogOpen, setBlockDialogOpen] = React.useState(false);

  const filteredBookings = React.useMemo(() => {
    let result = initialBookings;
    if (selectedSpaceId) {
      result = result.filter((b) => b.spaceId === selectedSpaceId);
    }
    if (statusFilter && statusFilter.length > 0) {
      result = result.filter((b) => statusFilter.includes(b.status));
    }
    return result;
  }, [initialBookings, selectedSpaceId, statusFilter]);

  const filteredBlockedDates = React.useMemo(() => {
    if (!selectedSpaceId) return blockedDates;
    return blockedDates.filter((bd) => bd.spaceId === selectedSpaceId);
  }, [blockedDates, selectedSpaceId]);

  const handleBlockDates = React.useCallback(
    (dates: string[], reason?: string) => {
      if (!selectedSpaceId) return;

      setBlockedDates((prev) => [
        ...prev,
        ...dates.map((date) => ({ spaceId: selectedSpaceId, date })),
      ]);

      startTransition(async () => {
        const result = await blockDatesAction(selectedSpaceId, dates, reason);
        if (result.success) {
          toast.success(
            dates.length === 1
              ? "Date blocked"
              : `${dates.length} dates blocked`
          );
        } else {
          setBlockedDates((prev) =>
            prev.filter(
              (bd) =>
                !(bd.spaceId === selectedSpaceId && dates.includes(bd.date))
            )
          );
          toast.error(result.error ?? "Failed to block dates");
        }
      });
    },
    [selectedSpaceId]
  );

  const handleUnblockDates = React.useCallback(
    (dates: string[]) => {
      if (!selectedSpaceId) return;

      const removed = blockedDates.filter(
        (bd) => bd.spaceId === selectedSpaceId && dates.includes(bd.date)
      );
      setBlockedDates((prev) =>
        prev.filter(
          (bd) => !(bd.spaceId === selectedSpaceId && dates.includes(bd.date))
        )
      );

      startTransition(async () => {
        const result = await unblockDatesAction(selectedSpaceId, dates);
        if (result.success) {
          toast.success(
            dates.length === 1
              ? "Date unblocked"
              : `${dates.length} dates unblocked`
          );
        } else {
          setBlockedDates((prev) => [...prev, ...removed]);
          toast.error(result.error ?? "Failed to unblock dates");
        }
      });
    },
    [selectedSpaceId, blockedDates]
  );

  return (
    <div className="flex flex-col gap-6">
      <CalendarHeader
        currentDate={currentDate}
        view={view}
        spaces={spaces}
        bookings={filteredBookings}
        selectedSpaceId={selectedSpaceId}
        statusFilter={statusFilter}
        onDateChange={setCurrentDate}
        onViewChange={setView}
        onSpaceChange={setSelectedSpaceId}
        onStatusFilterChange={setStatusFilter}
        onBlockDialogOpen={() => setBlockDialogOpen(true)}
        blockedDates={filteredBlockedDates}
      />

      <div className="grid grid-cols-1 gap-6 @3xl/main:grid-cols-[1fr_320px]">
        <div className="min-w-0 overflow-auto">
          <CalendarGrid
            currentDate={currentDate}
            view={view}
            spaces={spaces}
            bookings={filteredBookings}
            blockedDates={filteredBlockedDates}
            selectedSpaceId={selectedSpaceId}
            pending={pending}
            onBlockDates={handleBlockDates}
            onUnblockDates={handleUnblockDates}
          />
        </div>

        <UpcomingEvents
          spaces={spaces}
          bookings={filteredBookings}
          selectedSpaceId={selectedSpaceId}
        />
      </div>

      <BlockDatesDialog
        spaces={spaces}
        selectedSpaceId={selectedSpaceId}
        open={blockDialogOpen}
        onOpenChange={setBlockDialogOpen}
        onBlock={(spaceId, dates, reason) => {
          const prevSelected = selectedSpaceId;
          if (spaceId !== selectedSpaceId) {
            setSelectedSpaceId(spaceId);
          }
          setBlockedDates((prev) => [
            ...prev,
            ...dates.map((date) => ({ spaceId, date })),
          ]);
          startTransition(async () => {
            const result = await blockDatesAction(spaceId, dates, reason);
            if (result.success) {
              toast.success(`${dates.length} dates blocked`);
            } else {
              setBlockedDates((prev) =>
                prev.filter(
                  (bd) => !(bd.spaceId === spaceId && dates.includes(bd.date))
                )
              );
              if (spaceId !== prevSelected) setSelectedSpaceId(prevSelected);
              toast.error(result.error ?? "Failed to block dates");
            }
          });
        }}
      />
    </div>
  );
}
