import { graphql } from "@/types/gql";
import api from "../api";
import PerformanceTable from "./performance-table";

const AnalyticsAdvertiserPerformanceTable_QueryFragment = graphql(`
  fragment AnalyticsAdvertiserPerformanceTable_QueryFragment on Query {
    advertiserAnalytics(startDate: $startDate, endDate: $endDate) {
      spacePerformance(first: 10) {
        id
        title
        image
        totalBookings
        totalSpend
        impressions
        roi
      }
    }
  }
`);

export default async function Page() {
  const spacePerformance = await api
    .getAdvertiserAnalytics(AnalyticsAdvertiserPerformanceTable_QueryFragment)
    .then((res) => res.advertiserAnalytics.spacePerformance);

  return <PerformanceTable data={spacePerformance} />;
}
