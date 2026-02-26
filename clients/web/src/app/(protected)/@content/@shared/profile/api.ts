import "server-only";
import api from "@/api/server";
import { graphql } from "@/types/gql";
import assert from "node:assert";

const getProfile = api.createFragmentReader(async () =>
  api
    .query({
      query: graphql(`
        query Profile {
          me {
            id
            name
            ...ProfileLayout_UserFragment
            ...Info_UserFragment
            ...About_UserFragment
            ...Activity_UserFragment
          }
        }
      `),
    })
    .then((res) => {
      assert(!!res.data?.me);
      return res.data.me;
    })
);
Object.assign(api, { getProfile });

export default api as typeof api & {
  getProfile: typeof getProfile;
};
