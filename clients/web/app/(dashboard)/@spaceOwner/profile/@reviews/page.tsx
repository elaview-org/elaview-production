import mockData from "./mock.json";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/primitives/tooltip";
import { Button } from "@/components/primitives/button";
import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";
import ReviewCard from "@/components/composed/review-card";
import { graphql } from "@/types/gql";
import api from "../api";

const Reviews_UserFragment = graphql(`
  fragment Reviews_UserFragment on User {
    name
  }
`);

export default async function Page() {
  const data = await api.getSpaceOwnerProfile(Reviews_UserFragment);
  const REVIEWS_PER_PAGE = 3;
  const reviews = mockData.reviews;
  const totalPages = Math.ceil(reviews.length / REVIEWS_PER_PAGE);
  const startIndex = 0;

  if (reviews.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">
          What advertisers are saying about {data.name.split(" ")[0]}
        </h2>
        {totalPages > 1 && (
          <div className="flex gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon">
                  <IconChevronLeft className="size-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Previous</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon">
                  <IconChevronRight className="size-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Next</TooltipContent>
            </Tooltip>
          </div>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {reviews
          .slice(startIndex, startIndex + REVIEWS_PER_PAGE)
          .map((review) => (
            <ReviewCard
              key={review.id}
              rating={review.rating}
              comment={review.comment}
              authorName={review.reviewer.name}
              authorAvatar={review.reviewer.avatar}
              date={review.createdAt}
            />
          ))}
      </div>
    </div>
  );
}
