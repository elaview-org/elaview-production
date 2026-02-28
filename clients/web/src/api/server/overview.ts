import gql from "./gql";
import { graphql } from "@/types/gql";

const getMyOverview = gql.createFragmentReader(() =>
  gql.query({
    query: graphql(`
      query OverviewData {
        ...OverviewStatCards_QueryFragment
        ...OverviewDeadlineWarnings_QueryFragment
        ...OverviewPendingRequests_QueryFragment
        ...OverviewActiveBookings_QueryFragment
        ...OverviewTopSpaces_QueryFragment
        ...OverviewUpcomingPayouts_QueryFragment
        ...OverviewActivityChart_QueryFragment
        ...OverviewRecentActivity_QueryFragment
      }
    `),
  })
);

export const overview = {
  getMyOverView: getMyOverview,
};
