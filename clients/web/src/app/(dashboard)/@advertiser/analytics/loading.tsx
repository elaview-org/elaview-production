import {
  SummaryCardSkeleton,
  SummaryCardGrid,
} from "@/components/composed/summary-card";
import { PerformanceTableSkeleton } from "./performance-table";
import { TopPerformersSkeleton } from "./top-performers";
import { ComparisonCardSkeleton } from "./comparison-card";
import { StatusChartSkeleton } from "./status-chart";
import { ChartCardSkeleton } from "@/components/composed/chart-card-skeleton";

export default function Loading() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4">
        <SummaryCardGrid>
          {Array.from({ length: 4 }).map((_, i) => (
            <SummaryCardSkeleton key={i} />
          ))}
        </SummaryCardGrid>
        <SummaryCardGrid>
          {Array.from({ length: 4 }).map((_, i) => (
            <SummaryCardSkeleton key={i} />
          ))}
        </SummaryCardGrid>
      </div>

      <TopPerformersSkeleton />

      <div className="grid grid-cols-1 gap-6 @3xl/main:grid-cols-2">
        <ChartCardSkeleton />
        <StatusChartSkeleton />
      </div>

      <div className="grid grid-cols-1 gap-6 @3xl/main:grid-cols-2">
        <ChartCardSkeleton height={300} />
        <ChartCardSkeleton />
      </div>

      <div className="grid grid-cols-1 gap-6 @3xl/main:grid-cols-2">
        <ChartCardSkeleton height={300} />
        <ComparisonCardSkeleton />
      </div>

      <PerformanceTableSkeleton />
    </div>
  );
}
