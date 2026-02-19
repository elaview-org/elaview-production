import Link from "next/link";
import api from "@/api/server";
import { FragmentType, getFragmentData, graphql } from "@/types/gql";
import { Button } from "@/components/primitives/button";
import MediaCard, { MediaCardSkeleton } from "@/components/composed/media-card";
import { SPACE_TYPE } from "@/lib/core/constants";
import { formatCurrency } from "@/lib/core/utils";
import { IconStar } from "@tabler/icons-react";

const FeaturedSpaceCard_SpaceFragment = graphql(`
  fragment FeaturedSpaceCard_SpaceFragment on Space {
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

export default async function FeaturedSpaces() {
  const spaces = await api
    .query({
      query: graphql(`
        query FeaturedSpaces {
          spaces(first: 8, where: { status: { eq: ACTIVE } }) {
            nodes {
              id
              ...FeaturedSpaceCard_SpaceFragment
            }
          }
        }
      `),
    })
    .then((res) => res.data?.spaces?.nodes ?? []);

  if (spaces.length === 0) return null;

  return (
    <section>
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-2">
          <h2 className="text-3xl font-bold tracking-tight">Featured Spaces</h2>
          <p className="text-muted-foreground max-w-2xl">
            Browse available advertising spaces from storefronts, windows,
            walls, and more across your area.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {spaces.map((space, i) => (
            <SpaceCard key={i} data={space} />
          ))}
        </div>

        <div className="flex justify-center">
          <Button variant="outline" size="lg" asChild>
            <Link href="/spaces">View All Spaces</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

export function FeaturedSpacesSkeleton() {
  return (
    <section>
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-2">
          <div className="bg-muted h-9 w-48 rounded" />
          <div className="bg-muted h-5 w-96 rounded" />
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <MediaCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

type SpaceCardProps = {
  data: FragmentType<typeof FeaturedSpaceCard_SpaceFragment>;
};

function SpaceCard({ data }: SpaceCardProps) {
  const space = getFragmentData(FeaturedSpaceCard_SpaceFragment, data);

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
