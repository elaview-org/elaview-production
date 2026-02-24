"use client";

import { useCallback, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { format } from "date-fns";
import type { DateRange } from "react-day-picker";
import { IconCalendar } from "@tabler/icons-react";
import { Button } from "@/components/primitives/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/primitives/popover";
import { Calendar } from "@/components/primitives/calendar";
import { cn } from "@/lib/core/utils";

export default function DateRangeFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [open, setOpen] = useState(false);

  const dateFrom = searchParams.get("dateFrom");
  const dateTo = searchParams.get("dateTo");

  const initialRange: DateRange | undefined =
    dateFrom && dateTo
      ? { from: new Date(dateFrom), to: new Date(dateTo) }
      : undefined;

  const [range, setRange] = useState<DateRange | undefined>(initialRange);

  const handleSelect = useCallback(
    (newRange: DateRange | undefined) => {
      setRange(newRange);

      if (newRange?.from && newRange?.to) {
        const params = new URLSearchParams(searchParams.toString());
        params.set("dateFrom", format(newRange.from, "yyyy-MM-dd"));
        params.set("dateTo", format(newRange.to, "yyyy-MM-dd"));
        params.delete("after");
        router.push(`?${params.toString()}`);
        setOpen(false);
      }
    },
    [router, searchParams]
  );

  const handleClear = useCallback(() => {
    setRange(undefined);
    const params = new URLSearchParams(searchParams.toString());
    params.delete("dateFrom");
    params.delete("dateTo");
    params.delete("after");
    router.push(`?${params.toString()}`);
    setOpen(false);
  }, [router, searchParams]);

  const hasRange = dateFrom && dateTo;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn("gap-2", hasRange && "text-primary")}
        >
          <IconCalendar className="size-4" />
          {hasRange
            ? `${format(new Date(dateFrom), "MMM d")} - ${format(new Date(dateTo), "MMM d")}`
            : "Date Range"}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="range"
          selected={range}
          onSelect={handleSelect}
          numberOfMonths={2}
        />
        {hasRange && (
          <div className="border-t p-3">
            <Button
              variant="ghost"
              size="sm"
              className="w-full"
              onClick={handleClear}
            >
              Clear dates
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
