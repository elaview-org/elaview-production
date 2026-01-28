import {
  IconTrendingUp,
  IconEye,
  IconCurrencyDollar,
  IconCalendar,
  IconAlertTriangle,
} from "@tabler/icons-react";
import PerformerCard, { PerformerCardSkeleton } from "@/components/composed/performer-card";
import SectionCard, { SectionCardSkeleton } from "@/components/composed/section-card";
import { formatNumber } from "@/lib/utils";
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
          icon={<IconTrendingUp className="size-5" />}
          title="Best ROI"
          name={topPerformers.bestRoi.title}
          href={`/discover/${topPerformers.bestRoi.id}`}
          value={`${topPerformers.bestRoi.value}x`}
          subtitle={`+${topPerformers.bestRoi.change}%`}
        />
        <PerformerCard
          icon={<IconEye className="size-5" />}
          title="Most Impressions"
          name={topPerformers.mostImpressions.title}
          href={`/discover/${topPerformers.mostImpressions.id}`}
          value={formatNumber(topPerformers.mostImpressions.value)}
          subtitle={`+${topPerformers.mostImpressions.change}%`}
        />
        <PerformerCard
          icon={<IconCurrencyDollar className="size-5" />}
          title="Best Value"
          name={topPerformers.bestValue.title}
          href={`/discover/${topPerformers.bestValue.id}`}
          value={`$${topPerformers.bestValue.value.toFixed(3)}/imp`}
          subtitle={`${topPerformers.bestValue.change}%`}
        />
        <PerformerCard
          icon={<IconCalendar className="size-5" />}
          title="Most Bookings"
          name={topPerformers.mostBookings.title}
          href={`/discover/${topPerformers.mostBookings.id}`}
          value={topPerformers.mostBookings.value.toString()}
          subtitle={`+${topPerformers.mostBookings.change}%`}
        />
        <PerformerCard
          icon={<IconAlertTriangle className="size-5" />}
          title="Needs Review"
          name={topPerformers.needsReview.title}
          href={`/discover/${topPerformers.needsReview.id}`}
          value={`${topPerformers.needsReview.roi}x ROI`}
          subtitle={`${formatNumber(topPerformers.needsReview.impressions)} impressions`}
          variant="warning"
        />
      </div>
    </SectionCard>
  );
}
