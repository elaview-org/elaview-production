import {
  IconCalendar,
  IconChartBar,
  IconEye,
  IconStar,
} from "@tabler/icons-react";
import RankedCard from "@/components/composed/ranked-card";
import { formatCurrency, formatNumber } from "@/lib/utils";
import { FragmentType, getFragmentData, graphql } from "@/types/gql";
import mock from "./mock.json";

export const OverviewTopSpacesSpaceCard_SpaceFragment = graphql(`
  fragment OverviewTopSpacesSpaceCard_SpaceFragment on Space {
    id
    title
    images
    totalBookings
    totalRevenue
    averageRating
    status
  }
`);

type Props = {
  data: FragmentType<typeof OverviewTopSpacesSpaceCard_SpaceFragment>;
  rank: number;
};

export default function SpaceCard({ data, rank }: Props) {
  const space = getFragmentData(OverviewTopSpacesSpaceCard_SpaceFragment, data);
  const mockData = mock[space.id as keyof typeof mock];

  return (
    <RankedCard
      href={`/listings/${space.id}`}
      image={space.images?.[0] ?? ""}
      alt={space.title}
      title={space.title}
      rank={rank}
      primaryValue={formatCurrency(space.totalRevenue, { compact: true })}
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
            <IconCalendar className="size-3" />
            {space.totalBookings} bookings
          </span>
          <span className="flex items-center gap-1">
            <IconEye className="size-3" />
            {formatNumber(mockData?.views ?? 0)}
          </span>
          <span className="flex items-center gap-1">
            <IconChartBar className="size-3" />
            {mockData?.occupancyRate ?? 0}%
          </span>
        </>
      }
    />
  );
}
