import { subDays } from "date-fns";
import { connection } from "next/server";
import api from "@/api/server";
import { graphql } from "@/types/gql";

const getAnalytics = api.createFragmentReader(async () => {
  await connection();
  const end = new Date();
  const start = subDays(end, 90);

  const result = await api.query({
    query: graphql(`
      # noinspection GraphQLSchemaValidation
      query AnalyticsData($startDate: DateTime!, $endDate: DateTime!) {
        ...AnalyticsSummary_QueryFragment
        ...AnalyticsBookingsChart_QueryFragment
        ...AnalyticsStatusChart_QueryFragment
        ...AnalyticsMonthlyChart_QueryFragment
        ...AnalyticsRatingChart_QueryFragment
        ...AnalyticsHeatmapChart_QueryFragment
        ...AnalyticsComparison_QueryFragment
        ...AnalyticsTopPerformers_QueryFragment
        ...AnalyticsRevenueChart_QueryFragment
        ...AnalyticsPerformanceTable_QueryFragment
      }
    `),
    variables: {
      startDate: start.toISOString(),
      endDate: end.toISOString(),
    },
  });
  return result.data!;
});
Object.assign(api, { getAnalytics });

export default api as typeof api & {
  getAnalytics: typeof getAnalytics;
};
