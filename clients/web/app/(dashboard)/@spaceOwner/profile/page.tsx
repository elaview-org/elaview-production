import api from "@/api/gql/server";
import { Separator } from "@/components/primitives/separator";
import { graphql } from "@/types/gql";
import assert from "node:assert";
import AboutSection from "./about-section";
import ProfileCard from "./profile-card";
import ReviewsSection from "./reviews-section";

export default async function Page() {
  const me = await api
    .query({
      query: graphql(`
        query SpaceOwnerProfile {
          me {
            name
            ...ProfileCard_UserFragment
            ...AboutSection_UserFragment
          }
        }
      `),
    })
    .then((res) => {
      assert(!!res.data?.me);
      return res.data.me;
    });

  return (
    <div className="flex flex-col gap-8">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-8 lg:flex-row lg:gap-12">
        <ProfileCard data={me} />
        <AboutSection data={me} />
      </div>
      <Separator />
      <ReviewsSection userName={me.name} />
    </div>
  );
}
