import "server-only";
import api from "@/lib/gql/server";
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

Object.assign(api, { getSettingsUser, getNotificationPreferences });

export default api as typeof api & {
  getSettingsUser: typeof getSettingsUser;
  getNotificationPreferences: typeof getNotificationPreferences;
};
