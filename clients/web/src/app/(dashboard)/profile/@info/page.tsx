import { IconAd, IconStar, IconStarFilled } from "@tabler/icons-react";
import ProfileCardBase from "@/components/composed/profile-card";
import { formatCurrency } from "@/lib/core/utils";
import { graphql, ProfileType } from "@/types/gql";
import api from "../api";

const Info_UserFragment = graphql(`
  fragment Info_UserFragment on User {
    name
    avatar
    activeProfileType
    spaceOwnerProfile {
      createdAt
      spaces(first: 10) {
        nodes {
          averageRating
        }
      }
      reviews(first: 10, order: [{ createdAt: DESC }]) {
        nodes {
          id
        }
      }
    }
    advertiserProfile {
      createdAt
      totalSpend
      campaigns(first: 10, order: [{ createdAt: DESC }]) {
        nodes {
          id
        }
      }
    }
  }
`);

export default async function Page() {
  const user = await api.getProfile(Info_UserFragment);

  if (user.activeProfileType === ProfileType.SpaceOwner) {
    const profile = user.spaceOwnerProfile!;
    const spaces = profile.spaces?.nodes ?? [];
    const yearsHosting = Math.max(
      1,
      Math.floor(
        (new Date().getTime() -
          new Date(profile.createdAt as string).getTime()) /
          (365.25 * 24 * 60 * 60 * 1000)
      )
    );
    const totalReviews = profile.reviews?.nodes?.length ?? 0;
    const spaceRatings = spaces
      .map((s) => s?.averageRating)
      .filter((r): r is number => r != null);
    const averageRating =
      spaceRatings.length > 0
        ? (
            spaceRatings.reduce((a, b) => a + b, 0) / spaceRatings.length
          ).toFixed(1)
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
          {
            value: yearsHosting,
            label: yearsHosting === 1 ? "Year" : "Years",
          },
        ]}
      />
    );
  }

  const profile = user.advertiserProfile!;
  const yearsAdvertising = Math.max(
    1,
    Math.floor(
      (new Date().getTime() - new Date(profile.createdAt as string).getTime()) /
        (365.25 * 24 * 60 * 60 * 1000)
    )
  );
  const totalCampaigns = profile.campaigns?.nodes?.length ?? 0;
  const totalSpend = Number(profile.totalSpend ?? 0);

  return (
    <ProfileCardBase
      name={user.name}
      avatar={user.avatar}
      badge="Advertiser"
      badgeIcon={<IconAd className="size-3" />}
      verified
      stats={[
        { value: totalCampaigns, label: "Campaigns" },
        { value: formatCurrency(totalSpend), label: "Total Spend" },
        {
          value: yearsAdvertising,
          label: yearsAdvertising === 1 ? "Year" : "Years",
        },
      ]}
    />
  );
}
