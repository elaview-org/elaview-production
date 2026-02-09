"use client";

import { Button } from "@/components/primitives/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/primitives/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/primitives/select";
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/primitives/toggle-group";
import { Checkbox } from "@/components/primitives/checkbox";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/primitives/tooltip";
import { BookingStatus } from "@/types/gql/graphql";
import {
  IconChevronLeft,
  IconChevronRight,
  IconDownload,
  IconFilter,
  IconLock,
  IconPalette,
} from "@tabler/icons-react";
import {
  CALENDAR_VIEWS,
  type CalendarView,
  MONTHS,
  SPACE_COLORS,
  STATUS_FILTER_OPTIONS,
} from "./constants";
import type {
  CalendarBooking,
  CalendarSpace,
  CalendarBlockedDate,
} from "./types";
import { downloadICalFile } from "./ical-export";

type Props = {
  currentDate: Date;
  view: CalendarView;
  spaces: CalendarSpace[];
  bookings: CalendarBooking[];
  blockedDates: CalendarBlockedDate[];
  selectedSpaceId: string | null;
  statusFilter: BookingStatus[] | null;
  onDateChange: (date: Date) => void;
  onViewChange: (view: CalendarView) => void;
  onSpaceChange: (spaceId: string | null) => void;
  onStatusFilterChange: (filter: BookingStatus[] | null) => void;
  onBlockDialogOpen: () => void;
};

function SpacesLegendPopup({
  spaces,
  bookings,
}: {
  spaces: CalendarSpace[];
  bookings: CalendarBooking[];
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-1.5">
          <IconPalette className="size-4" />
          <span>Spaces</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-52">
        <DropdownMenuLabel className="text-xs font-medium">
          Color Legend
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <div className="flex flex-col gap-1 p-1">
          {spaces.map((space) => {
            const color = SPACE_COLORS[space.colorIndex % SPACE_COLORS.length];
            const bookingCount = bookings.filter(
              (b) => b.spaceId === space.id
            ).length;

            return (
              <div
                key={space.id}
                className="flex items-center gap-2 rounded-sm px-2 py-1.5"
              >
                <span
                  className={cn("size-2.5 shrink-0 rounded-full", color.bg)}
                />
                <span className="flex-1 truncate text-sm">{space.title}</span>
                <span className="text-muted-foreground text-xs">
                  {bookingCount}
                </span>
              </div>
            );
          })}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function StatusFilterDropdown({
  statusFilter,
  onStatusFilterChange,
}: {
  statusFilter: BookingStatus[] | null;
  onStatusFilterChange: (filter: BookingStatus[] | null) => void;
}) {
  const activeCount = statusFilter?.length ?? 0;

  const toggleStatus = (status: BookingStatus) => {
    if (!statusFilter) {
      onStatusFilterChange([status]);
      return;
    }
    if (statusFilter.includes(status)) {
      const next = statusFilter.filter((s) => s !== status);
      onStatusFilterChange(next.length === 0 ? null : next);
    } else {
      onStatusFilterChange([...statusFilter, status]);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-1.5">
          <IconFilter className="size-4" />
          <span>Status</span>
          {activeCount > 0 && (
            <span className="bg-primary text-primary-foreground flex size-5 items-center justify-center rounded-full text-xs">
              {activeCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuLabel className="text-xs font-medium">
          Filter by Status
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <div className="flex flex-col gap-0.5 p-1">
          {STATUS_FILTER_OPTIONS.map((opt) => {
            const checked = statusFilter?.includes(opt.value) ?? false;
            return (
              <button
                key={opt.value}
                onClick={() => toggleStatus(opt.value)}
                className="hover:bg-accent flex items-center gap-2 rounded-sm px-2 py-1.5 text-sm"
              >
                <Checkbox checked={checked} />
                <span>{opt.label}</span>
              </button>
            );
          })}
        </div>
        {activeCount > 0 && (
          <>
            <DropdownMenuSeparator />
            <div className="p-1">
              <button
                onClick={() => onStatusFilterChange(null)}
                className="text-muted-foreground hover:text-foreground w-full rounded-sm px-2 py-1.5 text-left text-xs"
              >
                Clear filter
              </button>
            </div>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default function CalendarHeader({
  currentDate,
  view,
  spaces,
  bookings,
  blockedDates,
  selectedSpaceId,
  statusFilter,
  onDateChange,
  onViewChange,
  onSpaceChange,
  onStatusFilterChange,
  onBlockDialogOpen,
}: Props) {
  const navigatePrevious = () => {
    const newDate = new Date(currentDate);
    if (view === "month") {
      newDate.setMonth(newDate.getMonth() - 1);
    } else if (view === "week") {
      newDate.setDate(newDate.getDate() - 7);
    } else {
      newDate.setDate(newDate.getDate() - 1);
    }
    onDateChange(newDate);
  };

  const navigateNext = () => {
    const newDate = new Date(currentDate);
    if (view === "month") {
      newDate.setMonth(newDate.getMonth() + 1);
    } else if (view === "week") {
      newDate.setDate(newDate.getDate() + 7);
    } else {
      newDate.setDate(newDate.getDate() + 1);
    }
    onDateChange(newDate);
  };

  const formatTitle = () => {
    if (view === "month") {
      return `${MONTHS[currentDate.getMonth()]} ${currentDate.getFullYear()}`;
    }
    if (view === "week") {
      const startOfWeek = new Date(currentDate);
      startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);

      if (startOfWeek.getMonth() === endOfWeek.getMonth()) {
        return `${MONTHS[startOfWeek.getMonth()]} ${startOfWeek.getDate()} - ${endOfWeek.getDate()}, ${startOfWeek.getFullYear()}`;
      }
      return `${MONTHS[startOfWeek.getMonth()].slice(0, 3)} ${startOfWeek.getDate()} - ${MONTHS[endOfWeek.getMonth()].slice(0, 3)} ${endOfWeek.getDate()}, ${endOfWeek.getFullYear()}`;
    }
    return currentDate.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="bg-card flex flex-col gap-4 rounded-xl border p-4 @lg/main:flex-row @lg/main:items-center @lg/main:justify-between">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="icon" onClick={navigatePrevious}>
                <IconChevronLeft className="size-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Previous</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="icon" onClick={navigateNext}>
                <IconChevronRight className="size-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Next</TooltipContent>
          </Tooltip>
        </div>
        <h2 className="text-lg font-semibold">{formatTitle()}</h2>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Select
          value={selectedSpaceId ?? "all"}
          onValueChange={(v) => onSpaceChange(v === "all" ? null : v)}
        >
          <SelectTrigger size="sm" className="w-44">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Spaces</SelectItem>
            {spaces.map((space) => {
              const color =
                SPACE_COLORS[space.colorIndex % SPACE_COLORS.length];
              return (
                <SelectItem key={space.id} value={space.id}>
                  <span className={cn("size-2 rounded-full", color.bg)} />
                  {space.title}
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>

        <StatusFilterDropdown
          statusFilter={statusFilter}
          onStatusFilterChange={onStatusFilterChange}
        />

        <SpacesLegendPopup spaces={spaces} bookings={bookings} />

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5"
              onClick={onBlockDialogOpen}
            >
              <IconLock className="size-4" />
              <span>Block Dates</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>Block a range of dates for a space</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5"
              onClick={() => downloadICalFile(bookings, spaces, blockedDates)}
            >
              <IconDownload className="size-4" />
              <span>Export</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>Download calendar as .ics file</TooltipContent>
        </Tooltip>

        <Button
          variant="outline"
          size="sm"
          onClick={() => onDateChange(new Date())}
        >
          Today
        </Button>

        <ToggleGroup
          type="single"
          value={view}
          onValueChange={(v) => v && onViewChange(v as CalendarView)}
          variant="outline"
        >
          {CALENDAR_VIEWS.map((v) => (
            <ToggleGroupItem key={v.value} value={v.value}>
              {v.label}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </div>
    </div>
  );
}
