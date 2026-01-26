import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/primitives/avatar";
import { Card, CardContent } from "@/components/primitives/card";
import { IconStarFilled } from "@tabler/icons-react";

type MockReview = {
  id: string;
  rating: number;
  comment: string;
  createdAt: string;
  reviewer: {
    name: string;
    avatar: string | null;
    companyName: string;
  };
};

type Props = {
  review: MockReview;
};

export default function ReviewCard({ review }: Props) {
  const initials = review.reviewer.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const formattedDate = new Date(review.createdAt).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  return (
    <Card>
      <CardContent className="flex h-full flex-col gap-3 pt-5">
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <IconStarFilled
              key={star}
              className={`size-3 ${star <= review.rating ? "text-foreground" : "text-muted-foreground/30"}`}
            />
          ))}
        </div>

        <p className="line-clamp-4 text-[15px] leading-relaxed">
          &ldquo;{review.comment}&rdquo;
        </p>

        <div className="mt-auto flex items-center gap-3 pt-2">
          <Avatar className="size-10">
            <AvatarImage src={review.reviewer.avatar ?? undefined} />
            <AvatarFallback className="text-xs">{initials}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="text-sm font-medium">{review.reviewer.name}</span>
            <span className="text-muted-foreground text-xs">{formattedDate}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}