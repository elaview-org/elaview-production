import { Skeleton } from "@/components/primitives/skeleton";

export default function HeatmapChartSkeleton() {
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
