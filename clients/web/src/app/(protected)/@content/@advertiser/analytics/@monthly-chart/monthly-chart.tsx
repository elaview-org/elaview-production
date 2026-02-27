"use client";

import * as React from "react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
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
import MaybePlaceholder from "@/components/status/maybe-placeholder";
import Placeholder from "./placeholder";
import {
  MONTHLY_CHART_CONFIG,
  MONTH_RANGES,
  type MonthRange,
} from "../constants";
import type { AdvertiserMonthlyStats } from "@/types/gql";

export function MonthlyChartSkeleton() {
  return (
    <div className="flex flex-col gap-4 rounded-xl border p-6">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-4 w-52" />
        </div>
        <Skeleton className="h-9 w-40" />
      </div>
      <Skeleton className="h-[300px] w-full" />
    </div>
  );
}

type Props = {
  data: AdvertiserMonthlyStats[];
};

export default function MonthlyChart({ data }: Props) {
  const [monthRange, setMonthRange] = React.useState<MonthRange>("12m");

  const filteredData = React.useMemo(() => {
    const range = MONTH_RANGES.find((r) => r.value === monthRange);
    const monthsToShow = range?.months ?? 12;
    return data.slice(-monthsToShow).map((item) => ({
      month: item.month,
      spending: Number(item.spending ?? 0),
      impressions: Number(item.impressions),
    }));
  }, [data, monthRange]);

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>Monthly Performance</CardTitle>
        <CardDescription>Spending and impressions by month</CardDescription>
        {data.length > 0 && (
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
        )}
      </CardHeader>
      <CardContent>
        <MaybePlaceholder data={data} placeholder={<Placeholder />}>
          <ChartContainer
            config={MONTHLY_CHART_CONFIG}
            className="h-[300px] w-full"
          >
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
        </MaybePlaceholder>
      </CardContent>
    </Card>
  );
}
