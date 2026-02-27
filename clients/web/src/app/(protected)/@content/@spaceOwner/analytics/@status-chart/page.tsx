import { graphql } from "@/types/gql";
import api from "../api";
import StatusChart from "./status-chart";

const AnalyticsStatusChart_QueryFragment = graphql(`
  fragment AnalyticsStatusChart_QueryFragment on Query {
    spaceOwnerAnalytics(startDate: $startDate, endDate: $endDate) {
      statusDistribution {
        status
        count
      }
    }
  }
`);

export default async function Page() {
  const statusDistribution = await api
    .getAnalytics(AnalyticsStatusChart_QueryFragment)
    .then((res) => res.spaceOwnerAnalytics.statusDistribution);

  return <StatusChart data={statusDistribution} />;
}
