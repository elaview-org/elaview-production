import { graphql } from "@/types/gql";
import api from "../api";
import ComparisonCard from "./comparison-card";

const AnalyticsAdvertiserComparison_QueryFragment = graphql(`
  fragment AnalyticsAdvertiserComparison_QueryFragment on Query {
    advertiserAnalytics(startDate: $startDate, endDate: $endDate) {
      periodComparison {
        current {
          period
          startDate
          endDate
          bookings
          spending
          impressions
          roi
        }
        previous {
          period
          startDate
          endDate
          bookings
          spending
          impressions
          roi
        }
      }
    }
  }
`);

export default async function Page() {
  const comparison = await api
    .getAdvertiserAnalytics(AnalyticsAdvertiserComparison_QueryFragment)
    .then((res) => res.advertiserAnalytics.periodComparison);

  return <ComparisonCard data={comparison} />;
}
