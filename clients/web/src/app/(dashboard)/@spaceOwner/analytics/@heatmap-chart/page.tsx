"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/primitives/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/primitives/tooltip";
import { cn } from "@/lib/utils";
import { DAYS_OF_WEEK, HOURS_OF_DAY } from "../constants";
import mock from "../mock.json";

type HeatmapCell = {
  day: number;
  hour: number;
  count: number;
};

function getIntensityClass(count: number, max: number): string {
  if (count === 0) return "bg-[var(--chart-heatmap-0)]";
  const ratio = count / max;
  if (ratio < 0.2) return "bg-[var(--chart-heatmap-1)]";
  if (ratio < 0.4) return "bg-[var(--chart-heatmap-2)]";
  if (ratio < 0.6) return "bg-[var(--chart-heatmap-3)]";
  if (ratio < 0.8) return "bg-[var(--chart-heatmap-4)]";
  return "bg-[var(--chart-heatmap-5)]";
}

export default function HeatmapChart() {
  const heatmapData = mock.bookingHeatmap as HeatmapCell[];
  const maxCount = Math.max(...heatmapData.map((d) => d.count), 1);

  const getCellValue = (day: number, hour: number): number => {
    const cell = heatmapData.find((d) => d.day === day && d.hour === hour);
    return cell?.count ?? 0;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Booking Activity Heatmap</CardTitle>
        <CardDescription>
          When advertisers are most likely to submit booking requests
        </CardDescription>
      </CardHeader>
      <CardContent>
        <TooltipProvider>
          <div className="overflow-x-auto">
            <div className="min-w-125">
              <div className="mb-2 grid grid-cols-[auto_repeat(9,1fr)] gap-1">
                <div className="w-10" />
                {HOURS_OF_DAY.map((hour) => (
                  <div
                    key={hour.value}
                    className="text-muted-foreground text-center text-xs"
                  >
                    {hour.label}
                  </div>
                ))}
              </div>

              {DAYS_OF_WEEK.map((day, dayIndex) => (
                <div
                  key={day}
                  className="grid grid-cols-[auto_repeat(9,1fr)] gap-1"
                >
                  <div className="text-muted-foreground flex w-10 items-center text-xs">
                    {day}
                  </div>
                  {HOURS_OF_DAY.map((hour) => {
                    const count = getCellValue(dayIndex, hour.value);
                    return (
                      <Tooltip key={`${dayIndex}-${hour.value}`}>
                        <TooltipTrigger asChild>
                          <div
                            className={cn(
                              "hover:ring-ring aspect-square rounded-sm transition-colors hover:ring-2",
                              getIntensityClass(count, maxCount)
                            )}
                          />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="font-medium">
                            {day} at {hour.label}
                          </p>
                          <p className="text-muted-foreground text-xs">
                            {count} booking{count !== 1 ? "s" : ""}
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    );
                  })}
                </div>
              ))}

              <div className="mt-4 flex items-center justify-end gap-2">
                <span className="text-muted-foreground text-xs">Less</span>
                <div className="flex gap-1">
                  <div className="bg-chart-heatmap-0 size-3 rounded-sm" />
                  <div className="bg-chart-heatmap-0 size-3 rounded-sm" />
                  <div className="bg-chart-heatmap-0 size-3 rounded-sm" />
                  <div className="bg-chart-heatmap-0 size-3 rounded-sm" />
                  <div className="bg-chart-heatmap-0 size-3 rounded-sm" />
                  <div className="bg-chart-heatmap-0 size-3 rounded-sm" />
                </div>
                <span className="text-muted-foreground text-xs">More</span>
              </div>
            </div>
          </div>
        </TooltipProvider>
      </CardContent>
    </Card>
  );
}
