import api from "@/api/gql/server";
import { graphql } from "@/types/gql";
import assert from "node:assert";
import SettingsContent from "./settings-content";

export default async function Page() {
  const { user, notificationPreferences } = await api
    .query({
      query: graphql(`
        query AdvertiserSettings {
          me {
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
