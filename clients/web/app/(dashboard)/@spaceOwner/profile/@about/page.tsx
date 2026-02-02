import { graphql } from "@/types/gql";
import {
  IconBriefcase,
  IconClock,
  IconMapPin,
  IconMessageCircle,
  IconShieldCheck,
} from "@tabler/icons-react";
import mockData from "./mock.json";
import api from "../api";

const About_UserFragment = graphql(`
  fragment About_UserFragment on User {
    name
    spaceOwnerProfile {
      businessName
      businessType
      onboardingComplete
      spaces(first: 10) {
        nodes {
          id
        }
      }
    }
  }
`);

export default async function Page() {
  const user = await api.getSpaceOwnerProfile(About_UserFragment);
  const profile = user.spaceOwnerProfile!;
  const spaces = profile.spaces?.nodes ?? [];

  return (
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

        <div className="flex items-center gap-3">
          <IconMessageCircle className="text-muted-foreground size-5" />
          <span>Response rate: {mockData.responseRate}%</span>
        </div>

        <div className="flex items-center gap-3">
          <IconClock className="text-muted-foreground size-5" />
          <span>Responds {mockData.responseTime}</span>
        </div>
      </div>

      {spaces.length > 0 && (
        <p className="text-muted-foreground">
          Managing {spaces.length} advertising{" "}
          {spaces.length === 1 ? "space" : "spaces"}.
        </p>
      )}
    </div>
  );
}
