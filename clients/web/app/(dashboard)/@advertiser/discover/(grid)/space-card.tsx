import MediaCard, { MediaCardSkeleton } from "@/components/composed/media-card";
import { SPACE_TYPE } from "@/lib/constants";
import { formatCurrency } from "@/lib/utils";
import { FragmentType, getFragmentData, graphql } from "@/types/gql";

export const DiscoverSpaceCard_SpaceFragment = graphql(`
  fragment DiscoverSpaceCard_SpaceFragment on Space {
    id
    title
    description
    city
    state
    images
    type
    pricePerDay
  }
`);

type Props = {
  data: FragmentType<typeof DiscoverSpaceCard_SpaceFragment>;
};

export default function SpaceCard({ data }: Props) {
  const space = getFragmentData(DiscoverSpaceCard_SpaceFragment, data);

  return (
    <MediaCard
      href={`/space/${space.id}`}
      image={space.images[0]}
      alt={space.title}
      title={space.title}
      description={space.description}
      badges={[
        {
          position: "top-right",
          content: SPACE_TYPE.labels[space.type],
          className:
            "text-muted-foreground bg-background p-1 tracking-wide uppercase",
        },
      ]}
      metaLeft={`${space.city}, ${space.state}`}
      metaRight={`${formatCurrency(space.pricePerDay)}/day`}
    />
  );
}

export function SpaceCardSkeleton() {
  return <MediaCardSkeleton />;
}
