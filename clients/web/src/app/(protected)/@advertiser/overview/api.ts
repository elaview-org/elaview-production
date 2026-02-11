import api from "@/lib/gql/server";
import { graphql } from "@/types/gql";

const getAdvertiserOverview = api.createFragmentReader(() =>
  api.query({
    query: graphql(`
      query AdvertiserOverviewData {
        ...AdvertiserOverviewStatCards_QueryFragment
        ...AdvertiserOverviewDeadlineWarnings_QueryFragment
        ...AdvertiserOverviewPendingPayments_QueryFragment
        ...AdvertiserOverviewPendingApprovals_QueryFragment
        ...AdvertiserOverviewActiveCampaigns_QueryFragment
        ...AdvertiserOverviewTopSpaces_QueryFragment
        ...AdvertiserOverviewSpendingChart_QueryFragment
        ...AdvertiserOverviewRecentActivity_QueryFragment
      }
    `),
  })
);
Object.assign(api, { getAdvertiserOverview });

export default api as typeof api & {
  getAdvertiserOverview: typeof getAdvertiserOverview;
};
