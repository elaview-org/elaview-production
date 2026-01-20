"use client";

import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/avatar";
import { Button } from "@/components/button";
import { Card, CardContent } from "@/components/card";
import {
  IconChevronLeft,
  IconChevronRight,
  IconStarFilled,
} from "@tabler/icons-react";

type ReviewData = {
  id: string;
  rating: number;
  comment: string | null;
  createdAt: unknown;
  reviewerName: string;
  reviewerAvatar: string | null;
};

interface ReviewsSectionProps {
  reviews: ReviewData[];
  ownerFirstName: string;
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function formatDate(dateString: unknown): string {
  const date = new Date(dateString as string);
  return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
}

function renderStars(rating: number) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <IconStarFilled
          key={star}
          className={`size-3 ${star <= rating ? "text-foreground" : "text-muted-foreground/30"}`}
        />
      ))}
    </div>
  );
}

const REVIEWS_PER_PAGE = 3;

export function ReviewsSection({ reviews, ownerFirstName }: ReviewsSectionProps) {
  const [page, setPage] = useState(0);
  const totalPages = Math.ceil(reviews.length / REVIEWS_PER_PAGE);
  const startIndex = page * REVIEWS_PER_PAGE;
  const visibleReviews = reviews.slice(startIndex, startIndex + REVIEWS_PER_PAGE);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">
          What advertisers are saying about {ownerFirstName}
        </h2>
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
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {visibleReviews.map((review) => (
          <Card key={review.id} className="gap-4">
            <CardContent className="flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <Avatar className="size-10">
                  <AvatarImage src={review.reviewerAvatar ?? undefined} />
                  <AvatarFallback>{getInitials(review.reviewerName)}</AvatarFallback>
                </Avatar>
                <span className="font-medium">{review.reviewerName}</span>
              </div>

              <div className="flex items-center gap-2">
                {renderStars(review.rating)}
                <span className="text-muted-foreground text-sm">
                  · {formatDate(review.createdAt)}
                </span>
              </div>

              {review.comment && (
                <p className="line-clamp-3 text-sm">{review.comment}</p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}