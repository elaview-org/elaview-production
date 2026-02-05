import { ProgressStepsSkeleton } from "@/components/composed/progress-steps";
import { SectionCardSkeleton } from "@/components/composed/section-card";
import { Skeleton } from "@/components/primitives/skeleton";

export default function Loading() {
  return (
    <SectionCardSkeleton>
      <div className="flex flex-col gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex flex-col gap-3 rounded-lg border p-4">
            <div className="flex items-start justify-between">
              <div className="flex flex-col gap-1">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-24" />
              </div>
              <Skeleton className="h-5 w-16 rounded-full" />
            </div>
            <ProgressStepsSkeleton count={4} />
            <div className="flex items-center justify-between">
              <Skeleton className="h-3 w-28" />
              <Skeleton className="h-6 w-28 rounded-md" />
            </div>
          </div>
        ))}
      </div>
    </SectionCardSkeleton>
  );
}
