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
  ChartLegend,
  ChartLegendContent,
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
import { MONTHLY_CHART_CONFIG, MONTH_RANGES, type MonthRange } from "./constants";
import mock from "./mock.json";

export default function MonthlyChart() {
  const [monthRange, setMonthRange] = React.useState<MonthRange>("12m");

  const filteredData = React.useMemo(() => {
    const range = MONTH_RANGES.find((r) => r.value === monthRange);
    const monthsToShow = range?.months ?? 12;
    return mock.monthlyData.slice(-monthsToShow);
  }, [monthRange]);

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>Monthly Performance</CardTitle>
        <CardDescription>
          Spending and impressions by month
        </CardDescription>
        <CardAction>
          <Select
            value={monthRange}
            onValueChange={(v) => setMonthRange(v as MonthRange)}
          >
            <SelectTrigger className="w-40" size="sm">
              <SelectValue />
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
      <CardContent>
        <ChartContainer config={MONTHLY_CHART_CONFIG} className="h-[300px] w-full">
          <BarChart data={filteredData} accessibilityLayer>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => {
                const date = new Date(value + "-01");
                return date.toLocaleDateString("en-US", { month: "short" });
              }}
            />
            <YAxis
              yAxisId="left"
              orientation="left"
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `$${value}`}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    const date = new Date(value + "-01");
                    return date.toLocaleDateString("en-US", {
                      month: "long",
                      year: "numeric",
                    });
                  }}
                />
              }
            />
            <ChartLegend content={<ChartLegendContent />} />
            <Bar
              yAxisId="left"
              dataKey="spending"
              fill="var(--color-spending)"
              radius={[4, 4, 0, 0]}
            />
            <Bar
              yAxisId="right"
              dataKey="impressions"
              fill="var(--color-impressions)"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
