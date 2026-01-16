import api from "@/api/gql/server";
import { Query } from "@/types/graphql.generated";
import { redirect } from "next/navigation";
import { AdvertiserSettingsContent } from "../../../../components/pages/advertiser-setting/advertiser-settings-content";

export default async function AdvertiserSettingsPage() {
  const { data } = await api.query<Query>({
    query: api.gql`
      query GetCurrentUserForSettings {
        currentUser {
          id
          email
          name
          avatar
          phone
          createdAt
          lastLoginAt
          activeProfileType
          advertiserProfile {
            id
            companyName
            industry
            website
            onboardingComplete
          }
        }
      }
    `,
  });

  if (!data?.currentUser) {
    redirect("/logout");
  }

  return <AdvertiserSettingsContent user={data.currentUser} />;
}
