import MediaCard, { MediaCardSkeleton } from "@/components/composed/media-card";
import { FragmentType, getFragmentData, graphql } from "@/types/gql";
import { STATUS_INDICATORS, TYPE_LABELS } from "../constants";

export const SpaceCard_SpaceFragment = graphql(`
  fragment SpaceCard_SpaceFragment on Space {
    id
    title
    description
    city
    state
    images
    type
    status
    createdAt
  }
`);

type Props = {
  data: FragmentType<typeof SpaceCard_SpaceFragment>;
};

export default function SpaceCard({ data }: Props) {
  const space = getFragmentData(SpaceCard_SpaceFragment, data);

  return (
    <MediaCard
      href={`/listings/${space.id}`}
      image={space.images[0]}
      alt={space.title}
      title={space.title}
      description={space.description}
      indicator={{
        className: STATUS_INDICATORS[space.status],
        title: space.status.replace("_", " "),
      }}
      badges={[
        {
          position: "top-right",
          content: TYPE_LABELS[space.type],
          className:
            "text-muted-foreground bg-background p-1 tracking-wide uppercase",
        },
      ]}
      metaLeft={`${space.city}, ${space.state}`}
      metaRight={new Date(space.createdAt as string).getFullYear()}
    />
  );
}

export function SpaceCardSkeleton() {
  return <MediaCardSkeleton />;
}
