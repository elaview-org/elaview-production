import api from "@/lib/gql/server";
import { graphql } from "@/types/gql";

export default async function getSpaceOwnerSettingsQuery() {
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

  return {
    error: error || !data?.me,
    user: data?.me,
    notificationPreferences: data?.myNotificationPreferences ?? [],
  };
}
