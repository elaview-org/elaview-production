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
import { formatCurrency } from "@/lib/utils";
import mock from "./mock.json";

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

export default function TopPerformers() {
  const { topPerformers } = mock;

  return (
    <SectionCard
      title="Top Performers"
      description="Your best performing spaces and areas that need attention"
    >
      <div className="grid grid-cols-1 gap-4 @lg/main:grid-cols-2 @3xl/main:grid-cols-3">
        <PerformerCard
          icon={<IconCurrencyDollar className="size-5" />}
          title="Highest Revenue"
          name={topPerformers.bestRevenue.title}
          href={`/listings/${topPerformers.bestRevenue.id}`}
          value={formatCurrency(topPerformers.bestRevenue.value)}
          subtitle={`+${topPerformers.bestRevenue.change}%`}
        />
        <PerformerCard
          icon={<IconStar className="size-5" />}
          title="Best Rated"
          name={topPerformers.bestRating.title}
          href={`/listings/${topPerformers.bestRating.id}`}
          value={`★ ${topPerformers.bestRating.value}`}
          subtitle={`${topPerformers.bestRating.reviews} reviews`}
        />
        <PerformerCard
          icon={<IconCalendar className="size-5" />}
          title="Highest Occupancy"
          name={topPerformers.bestOccupancy.title}
          href={`/listings/${topPerformers.bestOccupancy.id}`}
          value={`${topPerformers.bestOccupancy.value}%`}
          subtitle={`+${topPerformers.bestOccupancy.change}%`}
        />
        <PerformerCard
          icon={<IconTrendingUp className="size-5" />}
          title="Most Bookings"
          name={topPerformers.mostBookings.title}
          href={`/listings/${topPerformers.mostBookings.id}`}
          value={topPerformers.mostBookings.value.toString()}
          subtitle={`+${topPerformers.mostBookings.change}%`}
        />
        <PerformerCard
          icon={<IconAlertTriangle className="size-5" />}
          title="Needs Attention"
          name={topPerformers.needsAttention.title}
          href={`/listings/${topPerformers.needsAttention.id}`}
          value={`${topPerformers.needsAttention.occupancy}%`}
          subtitle={`${topPerformers.needsAttention.bookings} bookings`}
          variant="warning"
        />
      </div>
    </SectionCard>
  );
}
