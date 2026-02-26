import "server-only";
import api from "@/api/server";
import { graphql } from "@/types/gql";
import { cache } from "react";
import assert from "node:assert";

const fetchSettings = cache(async () =>
  api
    .query({
      query: graphql(`
        query Settings {
          me {
            id
            email
            name
            avatar
            phone
            createdAt
            lastLoginAt
            activeProfileType
            ...SettingsLayout_UserFragment
            ...ProfileSettings_UserFragment
            ...BusinessSettings_UserFragment
            ...PayoutSettings_UserFragment
            ...AccountSettings_UserFragment
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
      return res.data;
    })
);

const getSettingsUser = api.createFragmentReader(async () => {
  const data = await fetchSettings();
  return data.me!;
});

async function getNotificationPreferences() {
  const data = await fetchSettings();
  return data.myNotificationPreferences;
}

async function getPaymentMethods() {
  const { data } = await api.query({
    query: graphql(`
      query GetSavedPaymentMethods {
        mySavedPaymentMethods {
          id
          brand
          last4
          expMonth
          expYear
          isDefault
          createdAt
        }
      }
    `),
  });
  return data?.mySavedPaymentMethods ?? [];
}

Object.assign(api, {
  getSettingsUser,
  getNotificationPreferences,
  getPaymentMethods,
});

export default api as typeof api & {
  getSettingsUser: typeof getSettingsUser;
  getNotificationPreferences: typeof getNotificationPreferences;
  getPaymentMethods: typeof getPaymentMethods;
};
