import { graphql } from "@/types/gql";
import api from "../api";
import StatusChart from "./status-chart";

const AnalyticsAdvertiserStatusChart_QueryFragment = graphql(`
  fragment AnalyticsAdvertiserStatusChart_QueryFragment on Query {
    advertiserAnalytics(startDate: $startDate, endDate: $endDate) {
      statusDistribution {
        status
        count
      }
    }
  }
`);

export default async function Page() {
  const statusDistribution = await api
    .getAdvertiserAnalytics(AnalyticsAdvertiserStatusChart_QueryFragment)
    .then((res) => res.advertiserAnalytics.statusDistribution);

  return <StatusChart data={statusDistribution} />;
}
