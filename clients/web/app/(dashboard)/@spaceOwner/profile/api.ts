import "server-only";
import api from "@/lib/gql/server";
import { graphql } from "@/types/gql";
import assert from "node:assert";

const getSpaceOwnerProfile = api.createFragmentReader(async () =>
  api
    .query({
      query: graphql(`
        query SpaceOwnerProfile {
          me {
            id
            name
            ...Info_UserFragment
            ...About_UserFragment
            ...Reviews_UserFragment
          }
        }
      `),
    })
    .then((res) => {
      assert(!!res.data?.me);
      return res.data.me;
    })
);
Object.assign(api, { getSpaceOwnerProfile });

export default api as typeof api & {
  getSpaceOwnerProfile: typeof getSpaceOwnerProfile;
};
