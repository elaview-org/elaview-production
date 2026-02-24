import { SummaryCardSkeleton } from "@/components/composed/summary-card";

export default function Loading() {
  return (
    <div className="grid grid-cols-1 gap-4 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <SummaryCardSkeleton key={i} />
      ))}
    </div>
  );
}
