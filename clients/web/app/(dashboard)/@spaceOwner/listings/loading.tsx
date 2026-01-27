import { Skeleton } from "@/components/primitives/skeleton";
import { GridViewSkeleton } from "@/components/composed/grid-view";

export default function Loading() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-2">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-4 w-48" />
        </div>
        <Skeleton className="h-9 w-28" />
      </div>
      <GridViewSkeleton count={6} columns={3} />
    </div>
  );
}