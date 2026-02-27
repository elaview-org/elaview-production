import gql from "./gql";
import { graphql } from "@/types/gql";
import assert from "node:assert";

const user = {
  dashboard: () =>
    gql
      .query({
        query: graphql(`
          query DashboardUser {
            me {
              id
              ...UserProvider_UserFragment
            }
          }
        `),
      })
      .then((res) => {
        assert(!!res.data?.me);
        return res.data.me;
      }),
};
export default user;
