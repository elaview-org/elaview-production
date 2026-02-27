import { graphql } from "@/types/gql";
import api from "../api";
import MaybePlaceholder from "@/components/status/maybe-placeholder";
import RatingChart from "./rating-chart";
import Placeholder from "./placeholder";

const AnalyticsRatingChart_QueryFragment = graphql(`
  fragment AnalyticsRatingChart_QueryFragment on Query {
    spaceOwnerAnalytics(startDate: $startDate, endDate: $endDate) {
      ratingTrends(months: 12) {
        month
        rating
        reviews
      }
    }
  }
`);

export default async function Page() {
  const ratingTrends = await api
    .getAnalytics(AnalyticsRatingChart_QueryFragment)
    .then((res) => res.spaceOwnerAnalytics.ratingTrends);

  return (
    <MaybePlaceholder data={ratingTrends} placeholder={<Placeholder />}>
      <RatingChart data={ratingTrends} />
    </MaybePlaceholder>
  );
}
