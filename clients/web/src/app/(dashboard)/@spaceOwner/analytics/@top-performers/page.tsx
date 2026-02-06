import { graphql } from "@/types/gql";
import api from "../api";
import MaybePlaceholder from "@/components/status/maybe-placeholder";
import TopPerformers from "./top-performers";
import Placeholder from "./placeholder";

const AnalyticsTopPerformers_QueryFragment = graphql(`
  fragment AnalyticsTopPerformers_QueryFragment on Query {
    spaceOwnerAnalytics(startDate: $startDate, endDate: $endDate) {
      topPerformers {
        bestRevenue {
          id
          title
          value
          change
        }
        bestRating {
          id
          title
          value
          reviews
        }
        bestOccupancy {
          id
          title
          value
          change
        }
        mostBookings {
          id
          title
          value
          change
        }
        needsAttention {
          id
          title
          occupancy
          bookings
        }
      }
    }
  }
`);

export default async function Page() {
  const topPerformers = await api
    .getAnalytics(AnalyticsTopPerformers_QueryFragment)
    .then((res) => res.spaceOwnerAnalytics.topPerformers);

  const hasData =
    topPerformers.bestRevenue ||
    topPerformers.bestRating ||
    topPerformers.bestOccupancy ||
    topPerformers.mostBookings ||
    topPerformers.needsAttention;

  return (
    <MaybePlaceholder
      data={hasData ? [topPerformers] : []}
      placeholder={<Placeholder />}
    >
      <TopPerformers data={topPerformers} />
    </MaybePlaceholder>
  );
}
