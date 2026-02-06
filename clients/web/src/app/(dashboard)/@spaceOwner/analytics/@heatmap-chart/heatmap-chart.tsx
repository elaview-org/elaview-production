"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/primitives/card";
import { Skeleton } from "@/components/primitives/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/primitives/tooltip";
import { cn } from "@/lib/utils";
import { DAYS_OF_WEEK, HOURS_OF_DAY } from "../constants";

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

export function HeatmapChartSkeleton() {
  return (
    <div className="flex flex-col gap-4 rounded-xl border p-6">
      <div className="flex flex-col gap-1">
        <Skeleton className="h-5 w-48" />
        <Skeleton className="h-4 w-64" />
      </div>
      <div className="flex flex-col gap-1">
        {Array.from({ length: 7 }).map((_, i) => (
          <div key={i} className="flex items-center gap-1">
            <Skeleton className="h-4 w-10" />
            <div className="flex flex-1 gap-1">
              {Array.from({ length: 9 }).map((_, j) => (
                <Skeleton key={j} className="aspect-square flex-1 rounded-sm" />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

type Props = {
  data: HeatmapCell[];
};

export default function HeatmapChart({ data }: Props) {
  const maxCount = Math.max(...data.map((d) => d.count), 1);

  const getCellValue = (day: number, hour: number): number => {
    const cell = data.find((d) => d.day === day && d.hour === hour);
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
            <div className="min-w-[500px]">
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
                  <div className="size-3 rounded-sm bg-[var(--chart-heatmap-0)]" />
                  <div className="size-3 rounded-sm bg-[var(--chart-heatmap-1)]" />
                  <div className="size-3 rounded-sm bg-[var(--chart-heatmap-2)]" />
                  <div className="size-3 rounded-sm bg-[var(--chart-heatmap-3)]" />
                  <div className="size-3 rounded-sm bg-[var(--chart-heatmap-4)]" />
                  <div className="size-3 rounded-sm bg-[var(--chart-heatmap-5)]" />
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
