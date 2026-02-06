import {
  SummaryCardGrid,
  SummaryCardSkeleton,
} from "@/components/composed/summary-card";

export default function SummaryCardLoader() {
  return (
    <div className="flex flex-col gap-4">
      <SummaryCardGrid>
        {Array.from({ length: 4 }).map((_, i) => (
          <SummaryCardSkeleton key={i} />
        ))}
      </SummaryCardGrid>
      <SummaryCardGrid>
        {Array.from({ length: 4 }).map((_, i) => (
          <SummaryCardSkeleton key={i} />
        ))}
      </SummaryCardGrid>
    </div>
  );
}
