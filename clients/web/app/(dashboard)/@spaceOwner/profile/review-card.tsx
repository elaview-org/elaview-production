import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/primitives/avatar";
import { Card, CardContent } from "@/components/primitives/card";
import { FragmentType, getFragmentData, graphql } from "@/types/gql";
import { IconStarFilled } from "@tabler/icons-react";

export const ReviewCard_ReviewFragment = graphql(`
  fragment ReviewCard_ReviewFragment on Review {
    id
    rating
    comment
    createdAt
    booking {
      campaign {
        advertiserProfile {
          companyName
          user {
            name
            avatar
          }
        }
      }
    }
  }
`);

type Props = {
  data: FragmentType<typeof ReviewCard_ReviewFragment>;
};

export default function ReviewCard({ data }: Props) {
  const review = getFragmentData(ReviewCard_ReviewFragment, data);

  const reviewerName =
    review.booking?.campaign?.advertiserProfile?.user?.name ??
    review.booking?.campaign?.advertiserProfile?.companyName ??
    "Advertiser";
  const reviewerAvatar =
    review.booking?.campaign?.advertiserProfile?.user?.avatar ?? null;

  return (
    <Card className="gap-4">
      <CardContent className="flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <Avatar className="size-10">
            <AvatarImage src={reviewerAvatar ?? undefined} />
            <AvatarFallback>
            {reviewerName
              .split(" ")
              .map((n) => n[0])
              .join("")
              .toUpperCase()
              .slice(0, 2)}
          </AvatarFallback>
          </Avatar>
          <span className="font-medium">{reviewerName}</span>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex gap-0.5">
            {[1, 2, 3, 4, 5].map((star) => (
              <IconStarFilled
                key={star}
                className={`size-3 ${star <= review.rating ? "text-foreground" : "text-muted-foreground/30"}`}
              />
            ))}
          </div>
          <span className="text-muted-foreground text-sm">
            ·{" "}
            {new Date(review.createdAt as string).toLocaleDateString("en-US", {
              month: "long",
              year: "numeric",
            })}
          </span>
        </div>

        {review.comment && (
          <p className="line-clamp-3 text-sm">{review.comment}</p>
        )}
      </CardContent>
    </Card>
  );
}