import { graphql } from "@/types/gql";
import api from "../api";
import MaybePlaceholder from "@/components/status/maybe-placeholder";
import RevenueChart from "./revenue-chart";
import Placeholder from "./placeholder";

const AnalyticsRevenueChart_QueryFragment = graphql(`
  fragment AnalyticsRevenueChart_QueryFragment on Query {
    spaceOwnerAnalytics(startDate: $startDate, endDate: $endDate) {
      spacePerformance(first: 10) {
        id
        title
        totalRevenue
      }
    }
  }
`);

export default async function Page() {
  const spacePerformance = await api
    .getAnalytics(AnalyticsRevenueChart_QueryFragment)
    .then((res) => res.spaceOwnerAnalytics.spacePerformance);

  return (
    <MaybePlaceholder data={spacePerformance} placeholder={<Placeholder />}>
      <RevenueChart data={spacePerformance} />
    </MaybePlaceholder>
  );
}
