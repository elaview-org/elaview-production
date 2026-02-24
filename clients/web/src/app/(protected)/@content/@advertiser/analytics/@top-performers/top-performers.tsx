import {
  IconTrendingUp,
  IconEye,
  IconCurrencyDollar,
  IconCalendar,
  IconAlertTriangle,
} from "@tabler/icons-react";
import PerformerCard, {
  PerformerCardSkeleton,
} from "@/components/composed/performer-card";
import SectionCard, {
  SectionCardSkeleton,
} from "@/components/composed/section-card";
import { formatNumber } from "@/lib/core/utils";
import type { AdvertiserTopPerformers } from "@/types/gql";

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
  data: AdvertiserTopPerformers;
};

export default function TopPerformers({ data }: Props) {
  return (
    <SectionCard
      title="Top Performers"
      description="Your best performing spaces and areas that need attention"
    >
      <div className="grid grid-cols-1 gap-4 @lg/main:grid-cols-2 @3xl/main:grid-cols-3">
        {data.bestRoi && (
          <PerformerCard
            icon={<IconTrendingUp className="size-5" />}
            title="Best ROI"
            name={data.bestRoi.title}
            href={`/discover/${data.bestRoi.id}`}
            value={`${Number(data.bestRoi.value ?? 0).toFixed(1)}x`}
            subtitle={`${Number(data.bestRoi.change ?? 0) >= 0 ? "+" : ""}${Number(data.bestRoi.change ?? 0).toFixed(1)}%`}
          />
        )}
        {data.mostImpressions && (
          <PerformerCard
            icon={<IconEye className="size-5" />}
            title="Most Impressions"
            name={data.mostImpressions.title}
            href={`/discover/${data.mostImpressions.id}`}
            value={formatNumber(Number(data.mostImpressions.value ?? 0))}
            subtitle={`${Number(data.mostImpressions.change ?? 0) >= 0 ? "+" : ""}${Number(data.mostImpressions.change ?? 0).toFixed(1)}%`}
          />
        )}
        {data.bestValue && (
          <PerformerCard
            icon={<IconCurrencyDollar className="size-5" />}
            title="Best Value"
            name={data.bestValue.title}
            href={`/discover/${data.bestValue.id}`}
            value={`$${Number(data.bestValue.value ?? 0).toFixed(3)}/imp`}
            subtitle={`${Number(data.bestValue.change ?? 0).toFixed(1)}%`}
          />
        )}
        {data.mostBookings && (
          <PerformerCard
            icon={<IconCalendar className="size-5" />}
            title="Most Bookings"
            name={data.mostBookings.title}
            href={`/discover/${data.mostBookings.id}`}
            value={Number(data.mostBookings.value ?? 0).toString()}
            subtitle={`${Number(data.mostBookings.change ?? 0) >= 0 ? "+" : ""}${Number(data.mostBookings.change ?? 0).toFixed(1)}%`}
          />
        )}
        {data.needsReview && (
          <PerformerCard
            icon={<IconAlertTriangle className="size-5" />}
            title="Needs Review"
            name={data.needsReview.title}
            href={`/discover/${data.needsReview.id}`}
            value={`${Number(data.needsReview.roi ?? 0).toFixed(1)}x ROI`}
            subtitle={`${formatNumber(Number(data.needsReview.impressions))} impressions`}
            variant="warning"
          />
        )}
      </div>
    </SectionCard>
  );
}
