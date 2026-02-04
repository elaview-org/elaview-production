"use client";

import * as React from "react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import { useIsMobile } from "@/hooks/use-mobile";
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
import TimeRangeSelector from "@/components/composed/time-range-selector";
import { TIME_RANGES, type TimeRange } from "@/lib/constants";
import { CHART_CONFIG } from "../constants";
import mock from "../mock.json";

export default function ActivityChart() {
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

    return mock.chart.filter((item) => new Date(item.date) >= startDate);
  }, [timeRange]);

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>Activity Overview</CardTitle>
        <CardDescription>
          <span className="hidden @[540px]/card:block">
            Bookings and earnings over time
          </span>
          <span className="@[540px]/card:hidden">Activity trend</span>
        </CardDescription>
        <CardAction>
          <TimeRangeSelector value={timeRange} onChange={setTimeRange} />
        </CardAction>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={CHART_CONFIG}
          className="aspect-auto h-62.5 w-full"
        >
          <AreaChart data={filteredData}>
            <defs>
              <linearGradient id="fillBookings" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-bookings)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-bookings)"
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
              dataKey="bookings"
              type="natural"
              fill="url(#fillBookings)"
              stroke="var(--color-bookings)"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
