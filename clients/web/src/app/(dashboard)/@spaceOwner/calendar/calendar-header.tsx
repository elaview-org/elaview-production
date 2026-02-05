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
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/primitives/toggle-group";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/primitives/tooltip";
import {
  IconChevronLeft,
  IconChevronRight,
  IconPalette,
} from "@tabler/icons-react";
import {
  CALENDAR_VIEWS,
  type CalendarView,
  MONTHS,
  SPACE_COLORS,
} from "./constants";
import mock from "./mock.json";

type Props = {
  currentDate: Date;
  view: CalendarView;
  onDateChange: (date: Date) => void;
  onViewChange: (view: CalendarView) => void;
};

function SpacesLegendPopup() {
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
          {mock.spaces.map((space) => {
            const color = SPACE_COLORS[space.colorIndex % SPACE_COLORS.length];
            const bookingCount = mock.bookings.filter(
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

export default function CalendarHeader({
  currentDate,
  view,
  onDateChange,
  onViewChange,
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

  const goToToday = () => {
    onDateChange(new Date());
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
        <SpacesLegendPopup />

        <Button variant="outline" size="sm" onClick={goToToday}>
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
