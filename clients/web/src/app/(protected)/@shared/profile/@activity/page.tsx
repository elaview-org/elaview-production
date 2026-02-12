import { graphql, ProfileType, CampaignStatus } from "@/types/gql";
import api from "../api";
import ReviewsSection from "./reviews-section";
import CampaignsSection from "./campaigns-section";

const Activity_UserFragment = graphql(`
  fragment Activity_UserFragment on User {
    name
    activeProfileType
    spaceOwnerProfile {
      reviews(first: 10, order: [{ createdAt: DESC }]) {
        nodes {
          id
          rating
          comment
          createdAt
          reviewer {
            name
            avatar
            companyName
          }
        }
      }
    }
    advertiserProfile {
      campaigns(first: 10, order: [{ createdAt: DESC }]) {
        nodes {
          id
          name
          status
          startDate
          endDate
          totalSpend
          spacesCount
        }
      }
    }
  }
`);

export default async function Page() {
  const user = await api.getProfile(Activity_UserFragment);

  if (user.activeProfileType === ProfileType.SpaceOwner) {
    const reviews = (user.spaceOwnerProfile?.reviews?.nodes ?? [])
      .filter(Boolean)
      .map((r) => ({
        id: r!.id,
        rating: r!.rating,
        comment: r!.comment ?? "",
        createdAt: r!.createdAt as string,
        authorName: r!.reviewer?.name ?? r!.reviewer?.companyName ?? "Unknown",
        authorAvatar: r!.reviewer?.avatar ?? null,
      }));

    return <ReviewsSection userName={user.name} reviews={reviews} />;
  }

  const campaigns = (user.advertiserProfile?.campaigns?.nodes ?? [])
    .filter(Boolean)
    .map((c) => ({
      id: c!.id,
      name: c!.name,
      status: c!.status as CampaignStatus,
      startDate: c!.startDate as string | null,
      endDate: c!.endDate as string | null,
      totalSpend: Number(c!.totalSpend ?? 0),
      spacesCount: c!.spacesCount,
    }));

  return <CampaignsSection userName={user.name} campaigns={campaigns} />;
}
