import { Skeleton } from "@/components/primitives/skeleton";
import { PendingRequestsSkeleton } from "./pending-requests";
import { ActiveBookingsSkeleton } from "./active-bookings";
import { TopSpacesSkeleton } from "./top-spaces";

function StatsCardsSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="flex flex-col gap-3 rounded-xl border p-6">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-4 w-40" />
        </div>
      ))}
    </div>
  );
}

function ActivityChartSkeleton() {
  return (
    <div className="flex flex-col gap-4 rounded-xl border p-6">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-4 w-48" />
        </div>
        <Skeleton className="h-9 w-40" />
      </div>
      <Skeleton className="h-[250px] w-full" />
    </div>
  );
}

function RecentActivitySkeleton() {
  return (
    <div className="flex flex-col gap-4 rounded-xl border">
      <div className="p-6 pb-0">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="mt-1 h-4 w-48" />
      </div>
      <div className="overflow-hidden">
        <div className="bg-muted border-y p-4">
          <div className="flex gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-4 w-20" />
            ))}
          </div>
        </div>
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 border-b p-4 last:border-b-0">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-5 w-16 rounded-full" />
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-5 w-20 rounded-full" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Loading() {
  return (
    <div className="flex flex-col gap-4 md:gap-6">
      <StatsCardsSkeleton />
      <PendingRequestsSkeleton />
      <div className="grid grid-cols-1 gap-4 md:gap-6 @3xl/main:grid-cols-2">
        <ActiveBookingsSkeleton />
        <TopSpacesSkeleton />
      </div>
      <ActivityChartSkeleton />
      <RecentActivitySkeleton />
    </div>
  );
}