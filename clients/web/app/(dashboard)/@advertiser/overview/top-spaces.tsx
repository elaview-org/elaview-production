import {
  IconStar,
  IconEye,
  IconTrendingUp,
  IconCalendar,
} from "@tabler/icons-react";
import RankedCard, {
  RankedCardSkeleton,
} from "@/components/composed/ranked-card";
import SectionCard, {
  SectionCardSkeleton,
} from "@/components/composed/section-card";
import { formatCurrency, formatNumber } from "@/lib/utils";
import mock from "./mock.json";

type TopSpace = {
  id: string;
  title: string;
  image: string;
  totalSpend: number;
  impressions: number;
  roi: number;
  bookings: number;
  averageRating: number | null;
};

function SpaceCard({ space, rank }: { space: TopSpace; rank: number }) {
  return (
    <RankedCard
      href={`/discover/${space.id}`}
      image={space.image}
      alt={space.title}
      title={space.title}
      rank={rank}
      primaryValue={formatCurrency(space.totalSpend, { compact: true })}
      secondaryValue={
        space.averageRating !== null && (
          <span className="text-muted-foreground flex items-center gap-1">
            <IconStar className="size-3.5 fill-yellow-400 text-yellow-400" />
            {space.averageRating.toFixed(1)}
          </span>
        )
      }
      stats={
        <>
          <span className="flex items-center gap-1">
            <IconTrendingUp className="size-3" />
            {space.roi.toFixed(1)}x ROI
          </span>
          <span className="flex items-center gap-1">
            <IconEye className="size-3" />
            {formatNumber(space.impressions)}
          </span>
          <span className="flex items-center gap-1">
            <IconCalendar className="size-3" />
            {space.bookings} bookings
          </span>
        </>
      }
    />
  );
}

export default function TopSpaces() {
  const spaces = mock.topSpaces as TopSpace[];

  return (
    <SectionCard
      title="Top Spaces"
      description="Your best performing ad spaces"
      viewAllHref="/discover"
    >
      <div className="grid grid-cols-1 gap-3 @md/main:grid-cols-2 @lg/main:grid-cols-1 @2xl/main:grid-cols-2 @4xl/main:grid-cols-3">
        {spaces.slice(0, 5).map((space, index) => (
          <SpaceCard key={space.id} space={space} rank={index + 1} />
        ))}
      </div>
    </SectionCard>
  );
}

export function TopSpacesSkeleton() {
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
