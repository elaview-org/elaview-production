"use client";

import * as React from "react";
import { Label, Pie, PieChart } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/primitives/card";
import { Skeleton } from "@/components/primitives/skeleton";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/primitives/chart";
import { STATUS_CHART_CONFIG, STATUS_LABELS } from "./constants";
import { BookingStatus } from "@/types/gql/graphql";
import mock from "./mock.json";

export function StatusChartSkeleton() {
  return (
    <div className="flex flex-col gap-4 rounded-xl border p-6">
      <div className="flex flex-col items-center gap-1">
        <Skeleton className="h-5 w-48" />
        <Skeleton className="h-4 w-40" />
      </div>
      <Skeleton className="mx-auto size-[250px] rounded-full" />
    </div>
  );
}

export default function StatusChart() {
  const chartData = React.useMemo(() => {
    return mock.statusDistribution.map((item) => ({
      status: item.status,
      count: item.count,
      fill: item.fill,
    }));
  }, []);

  const totalBookings = React.useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.count, 0);
  }, [chartData]);

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Booking Status Distribution</CardTitle>
        <CardDescription>Current status of all bookings</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={STATUS_CHART_CONFIG}
          className="mx-auto aspect-square max-h-[300px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  hideLabel
                  formatter={(value, name) => {
                    const statusKey = name as BookingStatus;
                    const label = STATUS_LABELS[statusKey] ?? name;
                    return (
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground">{label}</span>
                        <span className="font-medium tabular-nums">{value}</span>
                      </div>
                    );
                  }}
                />
              }
            />
            <Pie
              data={chartData}
              dataKey="count"
              nameKey="status"
              innerRadius={60}
              strokeWidth={5}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {totalBookings.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy ?? 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Bookings
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
            <ChartLegend
              content={<ChartLegendContent nameKey="status" />}
              className="-translate-y-2 flex-wrap gap-2 *:basis-1/4 *:justify-center"
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}