import { subDays } from "date-fns";
import { connection } from "next/server";
import baseApi from "@/lib/gql/server";
import { graphql } from "@/types/gql";

const getAdvertiserAnalytics = baseApi.createFragmentReader(async () => {
  await connection();
  const end = new Date();
  const start = subDays(end, 90);

  const result = await baseApi.query({
    query: graphql(`
      query AdvertiserAnalyticsData(
        $startDate: DateTime!
        $endDate: DateTime!
      ) {
        ...AnalyticsAdvertiserSummary_QueryFragment
        ...AnalyticsAdvertiserSpendingChart_QueryFragment
        ...AnalyticsAdvertiserStatusChart_QueryFragment
        ...AnalyticsAdvertiserMonthlyChart_QueryFragment
        ...AnalyticsAdvertiserComparison_QueryFragment
        ...AnalyticsAdvertiserTopPerformers_QueryFragment
        ...AnalyticsAdvertiserPerformanceTable_QueryFragment
      }
    `),
    variables: {
      startDate: start.toISOString(),
      endDate: end.toISOString(),
    },
  });
  if (!result.data) {
    throw new Error(
      `AdvertiserAnalyticsData query failed. Error: ${JSON.stringify(result.error)}, Data: ${JSON.stringify(result.data)}`
    );
  }
  return result.data;
});

const api = {
  ...baseApi,
  getAdvertiserAnalytics,
};

export default api;
