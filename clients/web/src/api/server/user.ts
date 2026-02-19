import gql from "./gql";
import { graphql } from "@/types/gql";
import assert from "node:assert";
import { cookies } from "next/headers";
import storage from "@/lib/core/storage";

const user = {
  dashboard: async () =>
    Promise.all([
      (await cookies()).get(storage.preferences.sidebar.open)?.value !==
        "false",
      gql
        .query({
          query: graphql(`
            query DashboardUser {
              me {
                id
                ...NavigationSection_UserFragment
                ...UserSection_UserFragment
                ...RoleBasedView_UserFragment
              }
            }
          `),
        })
        .then((res) => {
          assert(!!res.data?.me);
          return res.data.me;
        }),
    ]),
};
export default user;
