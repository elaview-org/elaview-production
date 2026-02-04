import { graphql, ProfileType } from "@/types/gql";
import api from "../api";
import ReviewsSection from "./reviews-section";
import CampaignsSection from "./campaigns-section";

const Activity_UserFragment = graphql(`
  fragment Activity_UserFragment on User {
    name
    activeProfileType
  }
`);

export default async function Page() {
  const user = await api.getProfile(Activity_UserFragment);

  if (user.activeProfileType === ProfileType.SpaceOwner) {
    return <ReviewsSection userName={user.name} />;
  }

  return <CampaignsSection userName={user.name} />;
}
