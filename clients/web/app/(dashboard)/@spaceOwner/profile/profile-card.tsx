import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/primitives/avatar";
import { Badge } from "@/components/primitives/badge";
import { Card, CardContent } from "@/components/primitives/card";
import { Separator } from "@/components/primitives/separator";
import { FragmentType, getFragmentData, graphql } from "@/types/gql";
import {
  IconRosetteDiscountCheck,
  IconSettings,
  IconStar,
  IconStarFilled,
} from "@tabler/icons-react";
import Link from "next/link";

export const ProfileCard_UserFragment = graphql(`
  fragment ProfileCard_UserFragment on User {
    name
    avatar
    spaceOwnerProfile {
      createdAt
      spaces(first: 10) {
        nodes {
          averageRating
          reviews(first: 10) {
            nodes {
              id
            }
          }
        }
      }
    }
  }
`);

type Props = {
  data: FragmentType<typeof ProfileCard_UserFragment>;
};

export default function ProfileCard({ data }: Props) {
  const user = getFragmentData(ProfileCard_UserFragment, data);
  const profile = user.spaceOwnerProfile!;
  const spaces = profile.spaces?.nodes ?? [];

  const yearsHosting = Math.max(
    1,
    Math.floor(
      (new Date().getTime() - new Date(profile.createdAt as string).getTime()) /
        (365.25 * 24 * 60 * 60 * 1000)
    )
  );
  const totalReviews = spaces.reduce(
    (sum, s) => sum + (s?.reviews?.nodes?.length ?? 0),
    0
  );
  const spaceRatings = spaces
    .map((s) => s?.averageRating)
    .filter((r): r is number => r != null);
  const averageRating =
    spaceRatings.length > 0
      ? (spaceRatings.reduce((a, b) => a + b, 0) / spaceRatings.length).toFixed(
          1
        )
      : null;

  return (
    <Card className="shrink-0 lg:w-72">
      <CardContent className="flex flex-col items-center gap-4 pt-6">
        <div className="relative">
          <Avatar className="size-28">
            <AvatarImage src={user.avatar ?? undefined} alt={user.name} />
            <AvatarFallback className="text-2xl">
              {user.name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()
                .slice(0, 2)}
            </AvatarFallback>
          </Avatar>
          <div className="bg-primary ring-card absolute -right-1 -bottom-1 flex size-7 items-center justify-center rounded-full ring-2">
            <IconRosetteDiscountCheck className="text-primary-foreground size-4" />
          </div>
          <Link
            href="/settings"
            className="bg-secondary hover:bg-secondary/80 ring-card absolute -bottom-1 -left-1 flex size-7 items-center justify-center rounded-full ring-2 transition-colors"
          >
            <IconSettings className="text-secondary-foreground size-4" />
          </Link>
        </div>

        <div className="flex flex-col items-center gap-1">
          <h2 className="text-xl font-semibold">{user.name}</h2>
          <Badge variant="secondary" className="gap-1">
            <IconStar className="size-3" />
            Space Owner
          </Badge>
        </div>

        <Separator />

        <div className="grid w-full grid-cols-3 gap-4 text-center">
          <div className="flex flex-col">
            <span className="text-2xl font-bold">{totalReviews}</span>
            <span className="text-muted-foreground text-xs">Reviews</span>
          </div>
          <div className="flex flex-col">
            <span className="text-2xl font-bold">
              {averageRating ?? "—"}
              {averageRating && (
                <IconStarFilled className="ml-0.5 inline size-4" />
              )}
            </span>
            <span className="text-muted-foreground text-xs">Rating</span>
          </div>
          <div className="flex flex-col">
            <span className="text-2xl font-bold">{yearsHosting}</span>
            <span className="text-muted-foreground text-xs">
              {yearsHosting === 1 ? "Year" : "Years"}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
