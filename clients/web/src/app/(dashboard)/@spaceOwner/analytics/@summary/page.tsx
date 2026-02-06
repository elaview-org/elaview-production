import { graphql } from "@/types/gql";
import api from "../api";
import SummaryCards from "./summary-cards";

const AnalyticsSummary_QueryFragment = graphql(`
  fragment AnalyticsSummary_QueryFragment on Query {
    spaceOwnerAnalytics(startDate: $startDate, endDate: $endDate) {
      summary {
        totalBookings
        previousTotalBookings
        totalRevenue
        previousTotalRevenue
        averageRating
        completionRate
        avgBookingDuration
        previousAvgBookingDuration
        occupancyRate
        previousOccupancyRate
        repeatAdvertiserRate
        previousRepeatAdvertiserRate
        forecastedRevenue
      }
    }
  }
`);

export default async function Page() {
  const summary = await api
    .getAnalytics(AnalyticsSummary_QueryFragment)
    .then((res) => res.spaceOwnerAnalytics.summary);

  return <SummaryCards data={summary} />;
}
