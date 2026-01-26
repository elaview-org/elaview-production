import { Skeleton } from "@/components/primitives/skeleton";
import { PerformanceTableSkeleton } from "./performance-table";

function SummaryCardSkeleton() {
  return (
    <div className="flex flex-col gap-3 rounded-xl border p-6">
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-8 w-32" />
      <div className="flex items-center gap-2">
        <Skeleton className="h-5 w-16 rounded-full" />
      </div>
      <div className="mt-2 flex flex-col gap-1">
        <Skeleton className="h-4 w-40" />
        <Skeleton className="h-3 w-32" />
      </div>
    </div>
  );
}

function ChartCardSkeleton({ height = 250 }: { height?: number }) {
  return (
    <div className="flex flex-col gap-4 rounded-xl border p-6">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-4 w-48" />
        </div>
        <Skeleton className="h-9 w-40" />
      </div>
      <Skeleton className={`h-[${height}px] w-full`} style={{ height }} />
    </div>
  );
}

function TopPerformersSkeleton() {
  return (
    <div className="flex flex-col gap-4 rounded-xl border p-6">
      <div className="flex flex-col gap-1">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-4 w-64" />
      </div>
      <div className="grid grid-cols-1 gap-4 @lg/main:grid-cols-2 @3xl/main:grid-cols-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-start gap-3 rounded-lg border p-4">
            <Skeleton className="size-10 rounded-lg" />
            <div className="flex flex-1 flex-col gap-2">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-6 w-16" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function HeatmapSkeleton() {
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

function ComparisonSkeleton() {
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

export default function Loading() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-1 gap-4 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <SummaryCardSkeleton key={i} />
          ))}
        </div>
        <div className="grid grid-cols-1 gap-4 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <SummaryCardSkeleton key={i} />
          ))}
        </div>
      </div>

      <TopPerformersSkeleton />

      <div className="grid grid-cols-1 gap-6 @3xl/main:grid-cols-2">
        <ChartCardSkeleton />
        <div className="flex flex-col gap-4 rounded-xl border p-6">
          <div className="flex flex-col items-center gap-1">
            <Skeleton className="h-5 w-48" />
            <Skeleton className="h-4 w-40" />
          </div>
          <Skeleton className="mx-auto size-[250px] rounded-full" />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 @3xl/main:grid-cols-2">
        <ChartCardSkeleton height={300} />
        <ChartCardSkeleton />
      </div>

      <div className="grid grid-cols-1 gap-6 @3xl/main:grid-cols-2">
        <HeatmapSkeleton />
        <ComparisonSkeleton />
      </div>

      <ChartCardSkeleton height={300} />

      <PerformanceTableSkeleton />
    </div>
  );
}