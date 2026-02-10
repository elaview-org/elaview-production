import {
  IconTrendingUp,
  IconStar,
  IconCalendar,
  IconCurrencyDollar,
  IconAlertTriangle,
} from "@tabler/icons-react";
import PerformerCard, {
  PerformerCardSkeleton,
} from "@/components/composed/performer-card";
import SectionCard, {
  SectionCardSkeleton,
} from "@/components/composed/section-card";
import { formatCurrency } from "@/lib/core/utils";
import type { SpaceOwnerTopPerformers } from "@/types/gql";

export function TopPerformersSkeleton() {
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

type Props = {
  data: SpaceOwnerTopPerformers;
};

export default function TopPerformers({ data }: Props) {
  const {
    bestRevenue,
    bestRating,
    bestOccupancy,
    mostBookings,
    needsAttention,
  } = data;

  return (
    <SectionCard
      title="Top Performers"
      description="Your best performing spaces and areas that need attention"
    >
      <div className="grid grid-cols-1 gap-4 @lg/main:grid-cols-2 @3xl/main:grid-cols-3">
        {bestRevenue && (
          <PerformerCard
            icon={<IconCurrencyDollar className="size-5" />}
            title="Highest Revenue"
            name={bestRevenue.title}
            href={`/listings/${bestRevenue.id}`}
            value={formatCurrency(Number(bestRevenue.value ?? 0))}
            subtitle={
              bestRevenue.change != null
                ? `${Number(bestRevenue.change) >= 0 ? "+" : ""}${Number(bestRevenue.change).toFixed(1)}%`
                : undefined
            }
          />
        )}
        {bestRating && (
          <PerformerCard
            icon={<IconStar className="size-5" />}
            title="Best Rated"
            name={bestRating.title}
            href={`/listings/${bestRating.id}`}
            value={`★ ${bestRating.value.toFixed(1)}`}
            subtitle={`${bestRating.reviews} reviews`}
          />
        )}
        {bestOccupancy && (
          <PerformerCard
            icon={<IconCalendar className="size-5" />}
            title="Highest Occupancy"
            name={bestOccupancy.title}
            href={`/listings/${bestOccupancy.id}`}
            value={`${Number(bestOccupancy.value ?? 0).toFixed(0)}%`}
            subtitle={
              bestOccupancy.change != null
                ? `${Number(bestOccupancy.change) >= 0 ? "+" : ""}${Number(bestOccupancy.change).toFixed(1)}%`
                : undefined
            }
          />
        )}
        {mostBookings && (
          <PerformerCard
            icon={<IconTrendingUp className="size-5" />}
            title="Most Bookings"
            name={mostBookings.title}
            href={`/listings/${mostBookings.id}`}
            value={Number(mostBookings.value ?? 0).toString()}
            subtitle={
              mostBookings.change != null
                ? `${Number(mostBookings.change) >= 0 ? "+" : ""}${Number(mostBookings.change).toFixed(1)}%`
                : undefined
            }
          />
        )}
        {needsAttention && (
          <PerformerCard
            icon={<IconAlertTriangle className="size-5" />}
            title="Needs Attention"
            name={needsAttention.title}
            href={`/listings/${needsAttention.id}`}
            value={`${Number(needsAttention.occupancy ?? 0).toFixed(0)}%`}
            subtitle={`${needsAttention.bookings} bookings`}
            variant="warning"
          />
        )}
      </div>
    </SectionCard>
  );
}
