import { Skeleton } from "@/components/primitives/skeleton";
import { cn } from "@/lib/utils";
import { FragmentType, getFragmentData, graphql } from "@/types/gql";
import Image from "next/image";
import Link from "next/link";
import {
  STATUS_INDICATORS,
  TYPE_LABELS,
} from "@/app/(dashboard)/@spaceOwner/listings/constants";

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
  const thumbnail = space.images[0];
  const year = new Date(space.createdAt as string).getFullYear();

  return (
    <Link href={`/listings/${space.id}`} className="group block">
      <article className="bg-card text-card-foreground flex h-full flex-col overflow-hidden rounded-sm shadow-sm transition-shadow hover:shadow-lg">
        <div className="p-3 pb-0">
          <div className="relative aspect-video overflow-hidden">
            {thumbnail ? (
              <Image
                src={thumbnail}
                alt={space.title}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            ) : (
              <div className="bg-muted flex h-full items-center justify-center">
                <span className="text-muted-foreground text-sm">No image</span>
              </div>
            )}

            <div
              className={cn(
                "absolute top-3 left-3 size-2.5 rounded-full ring-2 ring-white",
                STATUS_INDICATORS[space.status]
              )}
              title={space.status.replace("_", " ")}
            />
          </div>
        </div>

        <div className="flex flex-1 flex-col gap-2 p-5">
          <span className="text-muted-foreground text-xs tracking-wide uppercase">
            {TYPE_LABELS[space.type]}
          </span>

          <h3 className="truncate text-lg font-semibold">{space.title}</h3>

          <p className="text-muted-foreground line-clamp-2 min-h-10 text-sm">
            {space.description || "No description"}
          </p>

          <div className="mt-auto flex items-center justify-between pt-2">
            <span className="text-muted-foreground text-xs">
              {space.city}, {space.state}
            </span>
            <span className="text-muted-foreground text-xs">{year}</span>
          </div>
        </div>
      </article>
    </Link>
  );
}

export function SpaceCardSkeleton() {
  return (
    <article className="bg-card overflow-hidden rounded-sm shadow-sm">
      <div className="p-3 pb-0">
        <Skeleton className="aspect-video rounded-none" />
      </div>
      <div className="flex flex-col gap-2 p-5">
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-10 w-full" />
        <div className="mt-auto flex items-center justify-between pt-2">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-3 w-10" />
        </div>
      </div>
    </article>
  );
}
