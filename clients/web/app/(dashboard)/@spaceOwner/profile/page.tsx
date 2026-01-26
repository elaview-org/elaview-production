import api from "@/api/gql/server";
import { Separator } from "@/components/primitives/separator";
import { graphql } from "@/types/gql";
import { redirect } from "next/navigation";
import AboutSection from "./about-section";
import ProfileCard from "./profile-card";
import ReviewsSection from "./reviews-section";

export default async function Page() {
  const { data, error } = await api.query({
    query: graphql(`
      query SpaceOwnerProfile {
        me {
          name
          ...ProfileCard_UserFragment
          ...AboutSection_UserFragment
        }
      }
    `),
  });

  if (error || !data?.me) {
    redirect("/logout");
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-8 lg:flex-row lg:gap-12">
        <ProfileCard data={data.me} />
        <AboutSection data={data.me} />
      </div>
      <Separator />
      <ReviewsSection userName={data.me.name} />
    </div>
  );
}
