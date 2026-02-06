"use client";

import * as React from "react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import { useIsMobile } from "@/lib/hooks/use-mobile";
import { Skeleton } from "@/components/primitives/skeleton";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/primitives/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/primitives/chart";
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
import MaybePlaceholder from "@/components/status/maybe-placeholder";
import Placeholder from "./placeholder";
import { REACH_CHART_CONFIG, TIME_RANGES, type TimeRange } from "../constants";

export function ReachChartSkeleton() {
  return (
    <div className="flex flex-col gap-4 rounded-xl border p-6">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <Skeleton className="h-5 w-36" />
          <Skeleton className="h-4 w-52" />
        </div>
        <Skeleton className="h-9 w-40" />
      </div>
      <Skeleton className="h-[250px] w-full" />
    </div>
  );
}

type ReachTrendItem = {
  date: string;
  reach: number;
  impressions: number;
};

type Props = {
  data: ReachTrendItem[];
};

export default function ReachChart({ data }: Props) {
  const isMobile = useIsMobile();
  const [timeRange, setTimeRange] = React.useState<TimeRange>("90d");

  React.useEffect(() => {
    if (isMobile) {
      setTimeRange("30d");
    }
  }, [isMobile]);

  const filteredData = React.useMemo(() => {
    const now = new Date();
    const range = TIME_RANGES.find((r) => r.value === timeRange);
    const daysToSubtract = range?.days ?? 90;

    const startDate = new Date(now);
    startDate.setDate(startDate.getDate() - daysToSubtract);

    return data.filter((item) => new Date(item.date) >= startDate);
  }, [data, timeRange]);

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>Reach & Impressions</CardTitle>
        <CardDescription>
          <span className="hidden @[540px]/card:block">
            Audience reach and impressions over time
          </span>
          <span className="@[540px]/card:hidden">Reach trend</span>
        </CardDescription>
        {data.length > 0 && (
          <CardAction>
            <ToggleGroup
              type="single"
              value={timeRange}
              onValueChange={(v) => v && setTimeRange(v as TimeRange)}
              variant="outline"
              className="hidden *:data-[slot=toggle-group-item]:px-4! @[767px]/card:flex"
            >
              {TIME_RANGES.map((range) => (
                <ToggleGroupItem key={range.value} value={range.value}>
                  {range.label}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
            <Select
              value={timeRange}
              onValueChange={(v) => setTimeRange(v as TimeRange)}
            >
              <SelectTrigger
                className="flex w-40 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate @[767px]/card:hidden"
                size="sm"
                aria-label="Select time range"
              >
                <SelectValue placeholder="Last 3 months" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                {TIME_RANGES.map((range) => (
                  <SelectItem
                    key={range.value}
                    value={range.value}
                    className="rounded-lg"
                  >
                    {range.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardAction>
        )}
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <MaybePlaceholder data={data} placeholder={<Placeholder />}>
          <ChartContainer
            config={REACH_CHART_CONFIG}
            className="aspect-auto h-[250px] w-full"
          >
            <AreaChart data={filteredData}>
              <defs>
                <linearGradient id="fillReach" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--color-reach)"
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-reach)"
                    stopOpacity={0.1}
                  />
                </linearGradient>
                <linearGradient
                  id="fillImpressions"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="5%"
                    stopColor="var(--color-impressions)"
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-impressions)"
                    stopOpacity={0.1}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={32}
                tickFormatter={(value) => {
                  const date = new Date(value);
                  return date.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  });
                }}
              />
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    labelFormatter={(value) => {
                      return new Date(value).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      });
                    }}
                    indicator="dot"
                  />
                }
              />
              <Area
                dataKey="impressions"
                type="natural"
                fill="url(#fillImpressions)"
                stroke="var(--color-impressions)"
                stackId="a"
              />
              <Area
                dataKey="reach"
                type="natural"
                fill="url(#fillReach)"
                stroke="var(--color-reach)"
                stackId="b"
              />
            </AreaChart>
          </ChartContainer>
        </MaybePlaceholder>
      </CardContent>
    </Card>
  );
}
