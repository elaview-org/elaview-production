import api from "@/api/gql/server";
import { graphql } from "@/types/gql";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/primitives/avatar";
import { Badge } from "@/components/primitives/badge";
import { Card, CardContent } from "@/components/primitives/card";
import { Separator } from "@/components/primitives/separator";
import {
  IconBriefcase,
  IconMapPin,
  IconRosetteDiscountCheck,
  IconShieldCheck,
  IconStar,
  IconStarFilled,
} from "@tabler/icons-react";
import mockData from "./mock-data.json";
import { ReviewsSection } from "./reviews-section";

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function getYearsHosting(createdAt: unknown): number {
  const created = new Date(createdAt as string);
  const now = new Date();
  return Math.max(
    1,
    Math.floor(
      (now.getTime() - created.getTime()) / (365.25 * 24 * 60 * 60 * 1000)
    )
  );
}

type ReviewData = {
  id: string;
  rating: number;
  comment: string | null;
  createdAt: unknown;
  reviewerName: string;
  reviewerAvatar: string | null;
};

export default async function Page() {
  const { data } = await api.query({
    query: graphql(`
      query SpaceOwnerProfile {
        me {
          id
          name
          email
          avatar
          createdAt
          spaceOwnerProfile {
            id
            businessName
            businessType
            createdAt
            onboardingComplete
            stripeAccountStatus
            spaces(first: 10) {
              nodes {
                id
                averageRating
                reviews(first: 3) {
                  nodes {
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
                }
              }
            }
          }
        }
      }
    `),
  });

  const user = data?.me;
  const profile = user?.spaceOwnerProfile;

  if (!user || !profile) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <p className="text-muted-foreground">Profile not found</p>
      </div>
    );
  }

  const spaces = profile.spaces?.nodes ?? [];
  const yearsHosting = getYearsHosting(profile.createdAt);
  const spaceRatings = spaces
    .map((s) => s?.averageRating)
    .filter((r): r is number => r != null);
  const averageRating =
    spaceRatings.length > 0
      ? (spaceRatings.reduce((a, b) => a + b, 0) / spaceRatings.length).toFixed(
          1
        )
      : null;

  const apiReviews: ReviewData[] = spaces
    .flatMap((space) =>
      (space?.reviews?.nodes ?? []).map((review) => ({
        id: review?.id as string,
        rating: review?.rating ?? 0,
        comment: review?.comment ?? null,
        createdAt: review?.createdAt,
        reviewerName:
          review?.booking?.campaign?.advertiserProfile?.user?.name ??
          review?.booking?.campaign?.advertiserProfile?.companyName ??
          "Advertiser",
        reviewerAvatar:
          review?.booking?.campaign?.advertiserProfile?.user?.avatar ?? null,
      }))
    )
    .filter((r) => r.id);

  const mockReviews: ReviewData[] =
    mockData.me.spaceOwnerProfile.spaces.nodes.flatMap((space) =>
      space.reviews.nodes.map((review) => ({
        id: review.id,
        rating: review.rating,
        comment: review.comment,
        createdAt: review.createdAt,
        reviewerName:
          review.booking.campaign.advertiserProfile.user?.name ??
          review.booking.campaign.advertiserProfile.companyName,
        reviewerAvatar:
          review.booking.campaign.advertiserProfile.user?.avatar ?? null,
      }))
    );

  const reviews = apiReviews.length > 0 ? apiReviews : mockReviews;

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-8 lg:flex-row lg:gap-12">
        <Card className="shrink-0 lg:w-72">
          <CardContent className="flex flex-col items-center gap-4 pt-6">
            <div className="relative">
              <Avatar className="size-28">
                <AvatarImage src={user.avatar ?? undefined} alt={user.name} />
                <AvatarFallback className="text-2xl">
                  {getInitials(user.name)}
                </AvatarFallback>
              </Avatar>
              <div className="bg-primary absolute -right-1 -bottom-1 rounded-full p-1">
                <IconRosetteDiscountCheck className="text-primary-foreground size-5" />
              </div>
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
                <span className="text-2xl font-bold">{reviews.length}</span>
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

        <div className="flex flex-1 flex-col gap-6">
          <h1 className="text-3xl font-semibold">About {user.name}</h1>

          <div className="flex flex-col gap-3">
            {profile.businessType && (
              <div className="flex items-center gap-3">
                <IconBriefcase className="text-muted-foreground size-5" />
                <span>My work: {profile.businessType}</span>
              </div>
            )}

            {profile.businessName && (
              <div className="flex items-center gap-3">
                <IconMapPin className="text-muted-foreground size-5" />
                <span>{profile.businessName}</span>
              </div>
            )}

            <div className="flex items-center gap-3">
              <IconShieldCheck className="text-muted-foreground size-5" />
              <span className={profile.onboardingComplete ? "underline" : ""}>
                {profile.onboardingComplete
                  ? "Identity verified"
                  : "Identity not verified"}
              </span>
            </div>
          </div>

          {spaces.length > 0 && (
            <p className="text-muted-foreground">
              Managing {spaces.length} advertising{" "}
              {spaces.length === 1 ? "space" : "spaces"}.
            </p>
          )}
        </div>
      </div>

      {reviews.length > 0 && (
        <>
          <Separator />
          <ReviewsSection
            reviews={reviews}
            ownerFirstName={user.name.split(" ")[0]}
          />
        </>
      )}
    </div>
  );
}
