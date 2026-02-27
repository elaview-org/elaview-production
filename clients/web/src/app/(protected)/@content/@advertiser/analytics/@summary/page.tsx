import { graphql } from "@/types/gql";
import api from "../api";
import SummaryCards from "./summary-cards";

const AnalyticsAdvertiserSummary_QueryFragment = graphql(`
  fragment AnalyticsAdvertiserSummary_QueryFragment on Query {
    advertiserAnalytics(startDate: $startDate, endDate: $endDate) {
      summary {
        totalSpend
        previousTotalSpend
        totalBookings
        previousTotalBookings
        totalImpressions
        previousTotalImpressions
        reach
        previousReach
        avgCostPerImpression
        previousAvgCostPerImpression
        roi
        previousRoi
        completionRate
        previousCompletionRate
      }
    }
  }
`);

export default async function Page() {
  const summary = await api
    .getAdvertiserAnalytics(AnalyticsAdvertiserSummary_QueryFragment)
    .then((res) => res.advertiserAnalytics.summary);

  return <SummaryCards data={summary} />;
}
