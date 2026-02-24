import { graphql } from "@/types/gql";
import api from "../api";
import PerformanceTable from "./performance-table";

const AnalyticsPerformanceTable_QueryFragment = graphql(`
  fragment AnalyticsPerformanceTable_QueryFragment on Query {
    spaceOwnerAnalytics(startDate: $startDate, endDate: $endDate) {
      spacePerformance(first: 10) {
        id
        title
        image
        totalBookings
        totalRevenue
        averageRating
        occupancyRate
      }
    }
  }
`);

export default async function Page() {
  const spacePerformance = await api
    .getAnalytics(AnalyticsPerformanceTable_QueryFragment)
    .then((res) => res.spaceOwnerAnalytics.spacePerformance);

  return <PerformanceTable data={spacePerformance} />;
}
