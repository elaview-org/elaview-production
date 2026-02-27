import { graphql } from "@/types/gql";
import api from "../api";
import MonthlyChart from "./monthly-chart";

const AnalyticsAdvertiserMonthlyChart_QueryFragment = graphql(`
  fragment AnalyticsAdvertiserMonthlyChart_QueryFragment on Query {
    advertiserAnalytics(startDate: $startDate, endDate: $endDate) {
      monthlyStats(months: 12) {
        month
        spending
        impressions
      }
    }
  }
`);

export default async function Page() {
  const monthlyStats = await api
    .getAdvertiserAnalytics(AnalyticsAdvertiserMonthlyChart_QueryFragment)
    .then((res) => res.advertiserAnalytics.monthlyStats);

  return <MonthlyChart data={monthlyStats} />;
}
