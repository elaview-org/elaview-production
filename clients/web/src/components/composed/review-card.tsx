import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/primitives/avatar";
import { Card, CardContent } from "@/components/primitives/card";
import { Skeleton } from "@/components/primitives/skeleton";
import StarRating from "@/components/primitives/star-rating";
import { getInitials } from "@/lib/utils";

type Props = {
  rating: number;
  comment: string;
  authorName: string;
  authorAvatar?: string | null;
  date: string;
  className?: string;
};

export default function ReviewCard({
  rating,
  comment,
  authorName,
  authorAvatar,
  date,
  className,
}: Props) {
  const formattedDate = new Date(date).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  return (
    <Card className={className}>
      <CardContent className="flex h-full flex-col gap-3 pt-5">
        <StarRating rating={rating} />

        <p className="line-clamp-4 text-[15px] leading-relaxed">
          &ldquo;{comment}&rdquo;
        </p>

        <div className="mt-auto flex items-center gap-3 pt-2">
          <Avatar className="size-10">
            <AvatarImage src={authorAvatar ?? undefined} />
            <AvatarFallback className="text-xs">
              {getInitials(authorName)}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="text-sm font-medium">{authorName}</span>
            <span className="text-muted-foreground text-xs">
              {formattedDate}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function ReviewCardSkeleton() {
  return (
    <Card>
      <CardContent className="flex h-full flex-col gap-3 pt-5">
        <div className="flex gap-0.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="size-3" />
          ))}
        </div>
        <Skeleton className="h-20 w-full" />
        <div className="mt-auto flex items-center gap-3 pt-2">
          <Skeleton className="size-10 rounded-full" />
          <div className="flex flex-col gap-1">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-3 w-20" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
