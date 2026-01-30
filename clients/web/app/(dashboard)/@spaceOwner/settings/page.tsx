import api from "@/api/gql/server";
import { graphql } from "@/types/gql";
import assert from "node:assert";
import SettingsContent from "./settings-content";

export default async function Page() {
  const { user, notificationPreferences } = await api
    .query({
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
    })
    .then((res) => {
      assert(!!res.data?.me);
      return {
        user: res.data.me,
        notificationPreferences: res.data.myNotificationPreferences,
      };
    });

  return (
    <SettingsContent
      user={user}
      notificationPreferences={notificationPreferences}
    />
  );
}
