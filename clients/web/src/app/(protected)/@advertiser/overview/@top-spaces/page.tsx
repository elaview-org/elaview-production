import SectionCard from "@/components/composed/section-card";
import MaybePlaceholder from "@/components/status/maybe-placeholder";
import SpaceCard from "./space-card";
import Placeholder from "./placeholder";
import { graphql } from "@/types/gql";
import api from "../api";

const AdvertiserOverviewTopSpaces_QueryFragment = graphql(`
  fragment AdvertiserOverviewTopSpaces_QueryFragment on Query {
    topSpacesBookings: myBookingsAsAdvertiser(
      first: 20
      where: { status: { in: [COMPLETED, VERIFIED, INSTALLED] } }
    ) {
      nodes {
        totalAmount
        space {
          id
          title
          images
          averageRating
        }
      }
    }
  }
`);

type AggregatedSpace = {
  id: string;
  title: string;
  image: string | null;
  averageRating: number | null;
  totalSpend: number;
  bookingCount: number;
};

export default async function Page() {
  const bookings = await api
    .getAdvertiserOverview(AdvertiserOverviewTopSpaces_QueryFragment)
    .then((res) => res.topSpacesBookings?.nodes ?? []);

  const spaceMap = new Map<string, AggregatedSpace>();

  for (const booking of bookings) {
    if (!booking.space?.id) continue;

    const spaceId = booking.space.id;
    const existing = spaceMap.get(spaceId);

    if (existing) {
      existing.totalSpend += booking.totalAmount ?? 0;
      existing.bookingCount += 1;
    } else {
      spaceMap.set(spaceId, {
        id: spaceId,
        title: booking.space.title ?? "Unknown Space",
        image: booking.space.images?.[0] ?? null,
        averageRating: booking.space.averageRating ?? null,
        totalSpend: booking.totalAmount ?? 0,
        bookingCount: 1,
      });
    }
  }

  const topSpaces = Array.from(spaceMap.values())
    .sort((a, b) => b.totalSpend - a.totalSpend)
    .slice(0, 5);

  return (
    <SectionCard
      title="Top Spaces"
      description="Your best performing ad spaces"
      viewAllHref="/discover"
    >
      <MaybePlaceholder data={topSpaces} placeholder={<Placeholder />}>
        <div className="grid grid-cols-1 gap-3 @md/main:grid-cols-2 @lg/main:grid-cols-1 @2xl/main:grid-cols-2 @4xl/main:grid-cols-3">
          {topSpaces.map((space, index) => (
            <SpaceCard key={space.id} space={space} rank={index + 1} />
          ))}
        </div>
      </MaybePlaceholder>
    </SectionCard>
  );
}
