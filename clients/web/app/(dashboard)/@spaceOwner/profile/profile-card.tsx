"use client";

import { IconStar, IconStarFilled } from "@tabler/icons-react";
import ProfileCardBase from "@/components/composed/profile-card";
import { FragmentType, getFragmentData, graphql } from "@/types/gql";

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
    <ProfileCardBase
      name={user.name}
      avatar={user.avatar}
      badge="Space Owner"
      badgeIcon={<IconStar className="size-3" />}
      verified
      stats={[
        { value: totalReviews, label: "Reviews" },
        {
          value: (
            <>
              {averageRating ?? "—"}
              {averageRating && (
                <IconStarFilled className="ml-0.5 inline size-4" />
              )}
            </>
          ),
          label: "Rating",
        },
        { value: yearsHosting, label: yearsHosting === 1 ? "Year" : "Years" },
      ]}
    />
  );
}
