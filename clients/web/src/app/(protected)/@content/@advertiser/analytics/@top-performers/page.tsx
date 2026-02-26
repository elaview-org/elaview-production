import { graphql } from "@/types/gql";
import api from "../api";
import MaybePlaceholder from "@/components/status/maybe-placeholder";
import Placeholder from "./placeholder";
import TopPerformers from "./top-performers";

const AnalyticsAdvertiserTopPerformers_QueryFragment = graphql(`
  fragment AnalyticsAdvertiserTopPerformers_QueryFragment on Query {
    advertiserAnalytics(startDate: $startDate, endDate: $endDate) {
      topPerformers {
        bestRoi {
          id
          title
          value
          change
        }
        mostImpressions {
          id
          title
          value
          change
        }
        bestValue {
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
        needsReview {
          id
          title
          roi
          impressions
        }
      }
    }
  }
`);

export default async function Page() {
  const topPerformers = await api
    .getAdvertiserAnalytics(AnalyticsAdvertiserTopPerformers_QueryFragment)
    .then((res) => res.advertiserAnalytics.topPerformers);

  const hasData =
    topPerformers.bestRoi ||
    topPerformers.mostImpressions ||
    topPerformers.bestValue ||
    topPerformers.mostBookings ||
    topPerformers.needsReview;

  return (
    <MaybePlaceholder
      data={hasData ? [topPerformers] : []}
      placeholder={<Placeholder />}
    >
      <TopPerformers data={topPerformers} />
    </MaybePlaceholder>
  );
}
