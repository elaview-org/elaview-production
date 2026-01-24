"use client";

import { useState } from "react";
import { Button } from "@/components/primitives/button";
import { FragmentType, getFragmentData, graphql } from "@/types/gql";
import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";
import ReviewCard from "./review-card";

export const ReviewsSection_UserFragment = graphql(`
  fragment ReviewsSection_UserFragment on User {
    name
    spaceOwnerProfile {
      spaces(first: 10) {
        nodes {
          reviews(first: 10) {
            nodes {
              ...ReviewCard_ReviewFragment
            }
          }
        }
      }
    }
  }
`);

type Props = {
  data: FragmentType<typeof ReviewsSection_UserFragment>;
};

export default function ReviewsSection({ data }: Props) {
  const user = getFragmentData(ReviewsSection_UserFragment, data);

  const [page, setPage] = useState(0);

  const REVIEWS_PER_PAGE = 3;
  const reviews = (user.spaceOwnerProfile?.spaces?.nodes ?? []).flatMap(
    (space) => space?.reviews?.nodes ?? []
  );
  const totalPages = Math.ceil(reviews.length / REVIEWS_PER_PAGE);
  const startIndex = page * REVIEWS_PER_PAGE;

  if (reviews.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">
          What advertisers are saying about {user.name.split(" ")[0]}
        </h2>
        {totalPages > 1 && (
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              disabled={page === 0}
              onClick={() => setPage((p) => p - 1)}
            >
              <IconChevronLeft className="size-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              disabled={page >= totalPages - 1}
              onClick={() => setPage((p) => p + 1)}
            >
              <IconChevronRight className="size-4" />
            </Button>
          </div>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {reviews
          .slice(startIndex, startIndex + REVIEWS_PER_PAGE)
          .map((review, index) => (
            <ReviewCard key={index} data={review!} />
          ))}
      </div>
    </div>
  );
}
