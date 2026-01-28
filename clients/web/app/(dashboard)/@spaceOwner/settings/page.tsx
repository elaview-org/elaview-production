import api from "@/api/gql/server";
import { graphql } from "@/types/gql";
import { redirect } from "next/navigation";
import SettingsContent from "./settings-content";

export default async function Page() {
  const { data, error } = await api.query({
    query: graphql(`
      query SpaceOwnerSettings {
        me {
          id
          email
          name
          avatar
          phone
          createdAt
          lastLoginAt
          activeProfileType
          spaceOwnerProfile {
            id
            businessName
            businessType
            payoutSchedule
            onboardingComplete
            stripeAccountId
            stripeAccountStatus
          }
        }
        myNotificationPreferences {
          id
          notificationType
          inAppEnabled
          emailEnabled
          pushEnabled
        }
      }
    `),
  });

  if (error || !data?.me) {
    redirect("/logout");
  }

  return (
    <SettingsContent
      user={data.me}
      notificationPreferences={data.myNotificationPreferences}
    />
  );
}
