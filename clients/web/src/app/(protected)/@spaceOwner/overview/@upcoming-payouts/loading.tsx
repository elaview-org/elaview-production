import { SectionCardSkeleton } from "@/components/composed/section-card";
import { PayoutCardSkeleton } from "./payout-card";

export default function Loading() {
  return (
    <SectionCardSkeleton>
      <div className="flex flex-col gap-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <PayoutCardSkeleton key={i} />
        ))}
      </div>
    </SectionCardSkeleton>
  );
}
