import { graphql } from "@/types/gql";
import api from "../api";
import ComparisonCard from "./comparison-card";

const AnalyticsComparison_QueryFragment = graphql(`
  fragment AnalyticsComparison_QueryFragment on Query {
    spaceOwnerAnalytics(startDate: $startDate, endDate: $endDate) {
      periodComparison {
        current {
          period
          startDate
          endDate
          bookings
          revenue
          avgRating
          completionRate
        }
        previous {
          period
          startDate
          endDate
          bookings
          revenue
          avgRating
          completionRate
        }
      }
    }
  }
`);

export default async function Page() {
  const periodComparison = await api
    .getAnalytics(AnalyticsComparison_QueryFragment)
    .then((res) => res.spaceOwnerAnalytics.periodComparison);

  return <ComparisonCard data={periodComparison} />;
}
