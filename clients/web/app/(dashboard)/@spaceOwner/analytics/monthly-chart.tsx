"use client";

import * as React from "react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
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
import { MONTH_RANGES, MONTHLY_CHART_CONFIG, type MonthRange } from "./constants";
import mock from "./mock.json";

export default function MonthlyChart() {
  const [monthRange, setMonthRange] = React.useState<MonthRange>("12m");

  const filteredData = React.useMemo(() => {
    const range = MONTH_RANGES.find((r) => r.value === monthRange);
    const monthsToShow = range?.months ?? 12;
    return mock.monthlyRevenue.slice(-monthsToShow).map((item) => ({
      ...item,
      monthLabel: new Date(item.month + "-01").toLocaleDateString("en-US", {
        month: "short",
        year: "2-digit",
      }),
    }));
  }, [monthRange]);

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>Monthly Revenue & Bookings</CardTitle>
        <CardDescription>
          Revenue and booking trends over time
        </CardDescription>
        <CardAction>
          <Select
            value={monthRange}
            onValueChange={(v) => setMonthRange(v as MonthRange)}
          >
            <SelectTrigger className="w-40" size="sm" aria-label="Select range">
              <SelectValue placeholder="Last 12 months" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              {MONTH_RANGES.map((range) => (
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
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={MONTHLY_CHART_CONFIG}
          className="aspect-auto h-[300px] w-full"
        >
          <BarChart data={filteredData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="monthLabel"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <YAxis
              yAxisId="revenue"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) =>
                new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: "USD",
                  notation: "compact",
                }).format(value)
              }
            />
            <YAxis
              yAxisId="bookings"
              orientation="right"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  formatter={(value, name) => {
                    if (name === "revenue") {
                      return [
                        new Intl.NumberFormat("en-US", {
                          style: "currency",
                          currency: "USD",
                        }).format(Number(value)),
                        "Revenue",
                      ];
                    }
                    return [value, "Bookings"];
                  }}
                  indicator="dot"
                />
              }
            />
            <Bar
              yAxisId="revenue"
              dataKey="revenue"
              fill="var(--color-revenue)"
              radius={[4, 4, 0, 0]}
            />
            <Bar
              yAxisId="bookings"
              dataKey="bookings"
              fill="var(--color-bookings)"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}