import api from "@/api/gql/server";
import { Separator } from "@/components/primitives/separator";
import { graphql } from "@/types/gql";
import AboutSection from "./about-section";
import ProfileCard from "./profile-card";
import ReviewsSection from "./reviews-section";

export default async function Page() {
  const { data, error } = await api.query({
    query: graphql(`
      query SpaceOwnerProfile {
        me {
          ...ProfileCard_UserFragment
          ...AboutSection_UserFragment
          ...ReviewsSection_UserFragment
        }
      }
    `),
  });

  if (error || !data?.me) {
    throw new Error(error?.message ?? "Failed to load profile");
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-8 lg:flex-row lg:gap-12">
        <ProfileCard data={data.me} />
        <AboutSection data={data.me} />
      </div>
      <Separator />
      <ReviewsSection data={data.me} />
    </div>
  );
}