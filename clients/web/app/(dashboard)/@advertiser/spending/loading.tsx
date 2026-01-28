import { Skeleton } from "@/components/primitives/skeleton";
import { SummaryCardSkeleton } from "@/components/composed/summary-card";
import { PaymentsTableSkeleton } from "./payments-table";

export default function Loading() {
  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 gap-4 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
        <SummaryCardSkeleton />
        <SummaryCardSkeleton />
        <SummaryCardSkeleton />
        <SummaryCardSkeleton />
      </div>
      <Skeleton className="h-[330px] w-full rounded-xl" />
      <PaymentsTableSkeleton />
    </div>
  );
}
