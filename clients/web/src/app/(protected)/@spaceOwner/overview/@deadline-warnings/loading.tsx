import { SectionCardSkeleton } from "@/components/composed/section-card";
import { DeadlineCardSkeleton } from "./deadline-card";

export default function Loading() {
  return (
    <SectionCardSkeleton>
      <div className="grid grid-cols-1 gap-4 @lg/main:grid-cols-2 @3xl/main:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <DeadlineCardSkeleton key={i} />
        ))}
      </div>
    </SectionCardSkeleton>
  );
}
