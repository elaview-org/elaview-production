import api from "@/lib/gql/server";
import { graphql } from "@/types/gql";

const getMyOverview = api.createFragmentReader(() =>
  api.query({
    query: graphql(`
      query OverviewData {
        ...OverviewStatCards_QueryFragment
        ...OverviewPendingRequests_QueryFragment
        ...OverviewActiveBookings_QueryFragment
        ...OverviewTopSpaces_QueryFragment
      }
    `),
  })
);
Object.assign(api, { getMyOverview });

export default api as typeof api & {
  getMyOverview: typeof getMyOverview;
};
