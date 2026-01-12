import { Skeleton } from "@/components/skeleton";
import { MapSkeleton } from "./@map/map-wrapper";

export function DiscoverHeaderSkeleton() {
  return (
    <header className="mb-8 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
      <div>
        <Skeleton className="mb-2 h-9 w-48" />
        <Skeleton className="h-5 w-72" />
      </div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <Skeleton className="h-10 w-full sm:w-64" />
        <div className="flex gap-2">
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-20" />
        </div>
      </div>
    </header>
  );
}

export default function DiscoverSkeleton() {
  return (
    <>
      <DiscoverHeaderSkeleton />
      <MapSkeleton />
    </>
  );
}