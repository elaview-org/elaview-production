import { IconArrowUp, IconArrowDown, IconMinus } from "@tabler/icons-react";
import { Skeleton } from "@/components/primitives/skeleton";
import { cn, formatCurrency } from "@/lib/core/utils";

type Format = "number" | "currency" | "percent" | "rating";

type MetricRow = {
  label: string;
  current: number;
  previous: number;
  format?: Format;
};

type Props = {
  rows: MetricRow[];
  className?: string;
};

function formatValue(value: number, format: Format = "number"): string {
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
}

function calculateChange(current: number, previous: number): number {
  if (previous === 0) return current > 0 ? 100 : 0;
  return ((current - previous) / previous) * 100;
}

function MetricRowComponent({
  label,
  current,
  previous,
  format = "number",
}: MetricRow) {
  const change = calculateChange(current, previous);
  const isPositive = change > 0;
  const isNeutral = change === 0;

  return (
    <div className="flex items-center justify-between border-b py-3 last:border-0">
      <span className="text-muted-foreground text-sm">{label}</span>
      <div className="flex items-center gap-4">
        <span className="text-muted-foreground w-20 text-right text-sm tabular-nums">
          {formatValue(previous, format)}
        </span>
        <span className="w-20 text-right font-medium tabular-nums">
          {formatValue(current, format)}
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

export default function ComparisonTable({ rows, className }: Props) {
  return (
    <div className={className}>
      <div className="mb-2 flex items-center justify-between text-xs font-medium">
        <span>Metric</span>
        <div className="flex items-center gap-4">
          <span className="text-muted-foreground w-20 text-right">
            Previous
          </span>
          <span className="w-20 text-right">Current</span>
          <span className="w-16 text-right">Change</span>
        </div>
      </div>
      <div className="flex flex-col">
        {rows.map((row) => (
          <MetricRowComponent key={row.label} {...row} />
        ))}
      </div>
    </div>
  );
}

export function ComparisonTableSkeleton({
  rowCount = 4,
}: {
  rowCount?: number;
}) {
  return (
    <div className="flex flex-col gap-3">
      {Array.from({ length: rowCount }).map((_, i) => (
        <div
          key={i}
          className="flex items-center justify-between border-b pb-3"
        >
          <Skeleton className="h-4 w-24" />
          <div className="flex items-center gap-4">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-14" />
          </div>
        </div>
      ))}
    </div>
  );
}
