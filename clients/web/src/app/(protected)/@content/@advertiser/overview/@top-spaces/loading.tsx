import { RankedCardSkeleton } from "@/components/composed/ranked-card";
import { SectionCardSkeleton } from "@/components/composed/section-card";

export default function Loading() {
  return (
    <SectionCardSkeleton>
      <div className="grid grid-cols-1 gap-3 @md/main:grid-cols-2 @lg/main:grid-cols-1 @2xl/main:grid-cols-2 @4xl/main:grid-cols-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <RankedCardSkeleton key={i} />
        ))}
      </div>
    </SectionCardSkeleton>
  );
}
