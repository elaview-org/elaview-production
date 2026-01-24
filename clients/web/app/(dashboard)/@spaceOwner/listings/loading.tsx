import { Skeleton } from "@/components/primitives/skeleton";
import { SpaceCardSkeleton } from "./space-card";

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

      <div className="grid grid-cols-1 gap-6 @md/main:grid-cols-2 @3xl/main:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <SpaceCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}