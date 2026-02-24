import { graphql } from "@/types/gql";
import api from "../api";
import SpendingChart from "./spending-chart";

const AnalyticsAdvertiserSpendingChart_QueryFragment = graphql(`
  fragment AnalyticsAdvertiserSpendingChart_QueryFragment on Query {
    advertiserDailyStats(startDate: $startDate, endDate: $endDate) {
      date
      spending
    }
  }
`);

export default async function Page() {
  const dailyStats = await api
    .getAdvertiserAnalytics(AnalyticsAdvertiserSpendingChart_QueryFragment)
    .then((res) =>
      res.advertiserDailyStats.map((item) => ({
        date: item.date,
        spending: Number(item.spending),
      }))
    );

  return <SpendingChart data={dailyStats} />;
}
