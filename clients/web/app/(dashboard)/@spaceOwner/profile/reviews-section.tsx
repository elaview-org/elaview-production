"use client";

import { useState } from "react";
import { Button } from "@/components/primitives/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/primitives/tooltip";
import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";
import ReviewCard from "@/components/composed/review-card";
import mockData from "./mock.json";

type Props = {
  userName: string;
};

export default function ReviewsSection({ userName }: Props) {
  const [page, setPage] = useState(0);

  const REVIEWS_PER_PAGE = 3;
  const reviews = mockData.reviews;
  const totalPages = Math.ceil(reviews.length / REVIEWS_PER_PAGE);
  const startIndex = page * REVIEWS_PER_PAGE;

  if (reviews.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">
          What advertisers are saying about {userName.split(" ")[0]}
        </h2>
        {totalPages > 1 && (
          <div className="flex gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  disabled={page === 0}
                  onClick={() => setPage((p) => p - 1)}
                >
                  <IconChevronLeft className="size-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Previous</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  disabled={page >= totalPages - 1}
                  onClick={() => setPage((p) => p + 1)}
                >
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
