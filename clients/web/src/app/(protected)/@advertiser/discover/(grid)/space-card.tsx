import MediaCard, { MediaCardSkeleton } from "@/components/composed/media-card";
import { SPACE_TYPE } from "@/lib/core/constants";
import { formatCurrency } from "@/lib/core/utils";
import { FragmentType, getFragmentData, graphql } from "@/types/gql";
import { IconStar } from "@tabler/icons-react";

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
    averageRating
  }
`);

type Props = {
  data: FragmentType<typeof DiscoverSpaceCard_SpaceFragment>;
};

export default function SpaceCard({ data }: Props) {
  const space = getFragmentData(DiscoverSpaceCard_SpaceFragment, data);

  return (
    <MediaCard
      href={`/spaces/${space.id}`}
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
        {
          position: "bottom-right",
          content: "Book Now",
          className:
            "bg-primary text-primary-foreground opacity-0 transition-opacity group-hover:opacity-100",
        },
      ]}
      metaLeft={
        space.averageRating ? (
          <span className="flex items-center gap-1">
            <IconStar className="size-3.5 fill-current text-amber-500" />
            {space.averageRating.toFixed(1)}
            <span className="text-muted-foreground">·</span>
            {space.city}, {space.state}
          </span>
        ) : (
          `${space.city}, ${space.state}`
        )
      }
      metaRight={`${formatCurrency(space.pricePerDay as number)}/day`}
    />
  );
}

export function SpaceCardSkeleton() {
  return <MediaCardSkeleton />;
}
