import { Skeleton } from "@/components/primitives/skeleton";

function CalendarHeaderSkeleton() {
  return (
    <div className="flex flex-col gap-4 rounded-xl border p-4 @lg/main:flex-row @lg/main:items-center @lg/main:justify-between">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Skeleton className="size-9" />
          <Skeleton className="size-9" />
        </div>
        <Skeleton className="h-7 w-40" />
      </div>
      <div className="flex items-center gap-3">
        <Skeleton className="h-9 w-20" />
        <Skeleton className="h-9 w-28" />
      </div>
    </div>
  );
}

function CalendarGridSkeleton() {
  return (
    <div className="relative flex min-w-[700px] flex-col rounded-xl border">
      <div className="grid grid-cols-7 border-b py-2">
        {Array.from({ length: 7 }).map((_, i) => (
          <Skeleton key={i} className="mx-auto h-5 w-8" />
        ))}
      </div>
      <div className="absolute top-1 right-2">
        <Skeleton className="h-7 w-20" />
      </div>
      <div className="grid grid-cols-7 divide-x">
        {Array.from({ length: 35 }).map((_, i) => (
          <div key={i} className="flex min-h-28 flex-col gap-1.5 p-1.5">
            <Skeleton className="size-7 rounded-full" />
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-3/4" />
          </div>
        ))}
      </div>
    </div>
  );
}

function UpcomingEventsSkeleton() {
  return (
    <div className="flex flex-col gap-4 rounded-xl border p-4">
      <Skeleton className="h-5 w-36" />
      <div className="flex flex-col gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex gap-3 rounded-lg border p-3">
            <Skeleton className="h-10 w-1 rounded-full" />
            <div className="flex flex-1 flex-col gap-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
              <div className="flex gap-2">
                <Skeleton className="h-5 w-16" />
                <Skeleton className="h-5 w-20" />
              </div>
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
      <CalendarHeaderSkeleton />
      <div className="grid grid-cols-1 gap-6 @3xl/main:grid-cols-[1fr_320px]">
        <div className="min-w-0 overflow-auto">
          <CalendarGridSkeleton />
        </div>
        <UpcomingEventsSkeleton />
      </div>
    </div>
  );
}
