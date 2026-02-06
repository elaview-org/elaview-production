import api from "@/lib/gql/server";
import { formatDate, getInitials } from "@/lib/utils";
import { graphql } from "@/types/gql";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/primitives/avatar";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/primitives/empty";
import { IconStar, IconStarFilled, IconMessageOff } from "@tabler/icons-react";

type Props = {
  spaceId: string;
  averageRating?: number | null;
};

export default async function Reviews({ spaceId, averageRating }: Props) {
  const reviews = await api
    .query({
      query: graphql(`
        query SpaceReviews($spaceId: ID!, $first: Int) {
          reviewsBySpace(
            spaceId: $spaceId
            first: $first
            order: [{ createdAt: DESC }]
          ) {
            nodes {
              id
              rating
              comment
              createdAt
              reviewer {
                name
                avatar
              }
            }
          }
        }
      `),
      variables: { spaceId, first: 10 },
    })
    .then((res) => res.data?.reviewsBySpace?.nodes ?? []);

  return (
    <div className="rounded-lg border">
      <div className="flex items-center justify-between border-b px-4 py-3">
        <h2 className="font-medium">Reviews</h2>
        {averageRating && (
          <div className="flex items-center gap-1">
            <IconStarFilled className="text-chart-rating size-4" />
            <span className="font-medium">{averageRating.toFixed(1)}</span>
            <span className="text-muted-foreground text-sm">
              ({reviews.length})
            </span>
          </div>
        )}
      </div>

      {reviews.length === 0 ? (
        <Empty className="border-0 py-8">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <IconMessageOff />
            </EmptyMedia>
            <EmptyTitle>No reviews yet</EmptyTitle>
            <EmptyDescription>
              Reviews from advertisers will appear here after completed
              bookings.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : (
        <div className="divide-y">
          {reviews.map((review) => (
            <div key={review.id} className="flex gap-4 px-4 py-4">
              <Avatar className="size-10 shrink-0">
                <AvatarImage src={review.reviewer?.avatar ?? undefined} />
                <AvatarFallback>
                  {getInitials(review.reviewer?.name ?? "")}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <p className="font-medium">
                    {review.reviewer?.name ?? "Anonymous"}
                  </p>
                  <div className="flex items-center gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) =>
                      i < review.rating ? (
                        <IconStarFilled
                          key={i}
                          className="text-chart-rating size-4"
                        />
                      ) : (
                        <IconStar
                          key={i}
                          className="text-muted-foreground size-4"
                        />
                      )
                    )}
                  </div>
                </div>
                <p className="text-muted-foreground text-xs">
                  {formatDate(review.createdAt)}
                </p>
                {review.comment && (
                  <p className="mt-2 text-sm">{review.comment}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function ReviewsSkeleton() {
  return (
    <div className="rounded-lg border">
      <div className="flex items-center justify-between border-b px-4 py-3">
        <div className="bg-muted h-5 w-20 animate-pulse rounded" />
        <div className="bg-muted h-5 w-16 animate-pulse rounded" />
      </div>
      <div className="divide-y">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex gap-4 px-4 py-4">
            <div className="bg-muted size-10 shrink-0 animate-pulse rounded-full" />
            <div className="flex-1 space-y-2">
              <div className="flex items-center justify-between">
                <div className="bg-muted h-4 w-24 animate-pulse rounded" />
                <div className="bg-muted h-4 w-20 animate-pulse rounded" />
              </div>
              <div className="bg-muted h-3 w-20 animate-pulse rounded" />
              <div className="bg-muted h-12 w-full animate-pulse rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
