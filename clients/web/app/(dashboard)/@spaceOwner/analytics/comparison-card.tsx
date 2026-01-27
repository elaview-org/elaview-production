import { IconArrowUp, IconArrowDown, IconMinus } from "@tabler/icons-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/primitives/card";
import { Skeleton } from "@/components/primitives/skeleton";
import { calculateTrend, cn, formatCurrency } from "@/lib/utils";
import mock from "./mock.json";

type MetricRowProps = {
  label: string;
  current: string | number;
  previous: string | number;
  change: number;
  format?: "number" | "currency" | "percent" | "rating";
};

function MetricRow({ label, current, previous, change, format = "number" }: MetricRowProps) {
  const isPositive = change > 0;
  const isNeutral = change === 0;

  const formatValue = (value: string | number) => {
    if (typeof value === "string") return value;
    switch (format) {
      case "currency":
        return formatCurrency(value);
      case "percent":
        return `${value.toFixed(1)}%`;
      case "rating":
        return `★ ${value.toFixed(1)}`;
      default:
        return value.toString();
    }
  };

  return (
    <div className="flex items-center justify-between border-b py-3 last:border-0">
      <span className="text-muted-foreground text-sm">{label}</span>
      <div className="flex items-center gap-4">
        <span className="text-muted-foreground w-20 text-right text-sm tabular-nums">
          {formatValue(previous)}
        </span>
        <span className="w-20 text-right font-medium tabular-nums">
          {formatValue(current)}
        </span>
        <div
          className={cn(
            "flex w-16 items-center justify-end gap-1 text-sm tabular-nums",
            isPositive && "text-green-600 dark:text-green-400",
            !isPositive && !isNeutral && "text-red-600 dark:text-red-400",
            isNeutral && "text-muted-foreground"
          )}
        >
          {isPositive && <IconArrowUp className="size-3" />}
          {!isPositive && !isNeutral && <IconArrowDown className="size-3" />}
          {isNeutral && <IconMinus className="size-3" />}
          {Math.abs(change).toFixed(1)}%
        </div>
      </div>
    </div>
  );
}

export function ComparisonCardSkeleton() {
  return (
    <div className="flex flex-col gap-4 rounded-xl border p-6">
      <div className="flex flex-col gap-1">
        <Skeleton className="h-5 w-36" />
        <Skeleton className="h-4 w-48" />
      </div>
      <div className="flex flex-col gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex items-center justify-between border-b pb-3">
            <Skeleton className="h-4 w-24" />
            <div className="flex items-center gap-4">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-14" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ComparisonCard() {
  const { comparison } = mock;
  const { current, previous } = comparison;

  const bookingsChange = calculateTrend(current.bookings, previous.bookings);
  const revenueChange = calculateTrend(current.revenue, previous.revenue);
  const ratingChange = calculateTrend(current.avgRating, previous.avgRating);
  const completionChange = calculateTrend(current.completionRate, previous.completionRate);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Period Comparison</CardTitle>
        <CardDescription>
          {current.period} vs {previous.period}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-2 flex items-center justify-between text-xs font-medium">
          <span>Metric</span>
          <div className="flex items-center gap-4">
            <span className="text-muted-foreground w-20 text-right">Previous</span>
            <span className="w-20 text-right">Current</span>
            <span className="w-16 text-right">Change</span>
          </div>
        </div>
        <div className="flex flex-col">
          <MetricRow
            label="Bookings"
            current={current.bookings}
            previous={previous.bookings}
            change={bookingsChange}
          />
          <MetricRow
            label="Revenue"
            current={current.revenue}
            previous={previous.revenue}
            change={revenueChange}
            format="currency"
          />
          <MetricRow
            label="Avg. Rating"
            current={current.avgRating}
            previous={previous.avgRating}
            change={ratingChange}
            format="rating"
          />
          <MetricRow
            label="Completion Rate"
            current={current.completionRate}
            previous={previous.completionRate}
            change={completionChange}
            format="percent"
          />
        </div>
      </CardContent>
    </Card>
  );
}