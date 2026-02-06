import { Skeleton } from "../primitives/skeleton";

type ChartSkeletonProps = {
  height?: number;
};

export function ChartCardSkeleton({ height = 250 }: ChartSkeletonProps) {
  return (
    <div className="flex flex-col gap-4 rounded-xl border p-6">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-4 w-48" />
        </div>
        <Skeleton className="h-9 w-40" />
      </div>
      <Skeleton className="w-full" style={{ height }} />
    </div>
  );
}
