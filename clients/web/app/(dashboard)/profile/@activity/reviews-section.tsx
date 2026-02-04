import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/primitives/tooltip";
import { Button } from "@/components/primitives/button";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/primitives/empty";
import {
  IconChevronLeft,
  IconChevronRight,
  IconMessage,
} from "@tabler/icons-react";
import ReviewCard from "@/components/composed/review-card";

type Review = {
  id: string;
  rating: number;
  comment: string;
  createdAt: string;
  authorName: string;
  authorAvatar: string | null;
};

type Props = {
  userName: string;
  reviews: Review[];
};

const REVIEWS_PER_PAGE = 3;

export default function ReviewsSection({ userName, reviews }: Props) {
  const totalPages = Math.ceil(reviews.length / REVIEWS_PER_PAGE);

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

      {reviews.length === 0 ? (
        <Empty className="py-16">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <IconMessage />
            </EmptyMedia>
            <EmptyTitle>No reviews yet</EmptyTitle>
            <EmptyDescription>
              Reviews from advertisers will appear here once bookings are
              completed
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {reviews.slice(0, REVIEWS_PER_PAGE).map((review) => (
            <ReviewCard
              key={review.id}
              rating={review.rating}
              comment={review.comment}
              authorName={review.authorName}
              authorAvatar={review.authorAvatar}
              date={review.createdAt}
            />
          ))}
        </div>
      )}
    </div>
  );
}
