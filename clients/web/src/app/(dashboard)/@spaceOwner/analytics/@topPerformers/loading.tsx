import { PerformerCardSkeleton } from "@/components/composed/performer-card";
import { SectionCardSkeleton } from "@/components/composed/section-card";

export default function TopPerformersSkeleton() {
  return (
    <SectionCardSkeleton>
      <div className="grid grid-cols-1 gap-4 @lg/main:grid-cols-2 @3xl/main:grid-cols-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <PerformerCardSkeleton key={i} />
        ))}
      </div>
    </SectionCardSkeleton>
  );
}
