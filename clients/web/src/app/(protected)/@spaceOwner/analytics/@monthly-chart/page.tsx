import { graphql } from "@/types/gql";
import api from "../api";
import MaybePlaceholder from "@/components/status/maybe-placeholder";
import MonthlyChart from "./monthly-chart";
import Placeholder from "./placeholder";

const AnalyticsMonthlyChart_QueryFragment = graphql(`
  fragment AnalyticsMonthlyChart_QueryFragment on Query {
    spaceOwnerAnalytics(startDate: $startDate, endDate: $endDate) {
      monthlyStats(months: 12) {
        month
        revenue
        bookings
      }
    }
  }
`);

export default async function Page() {
  const monthlyStats = await api
    .getAnalytics(AnalyticsMonthlyChart_QueryFragment)
    .then((res) => res.spaceOwnerAnalytics.monthlyStats);

  return (
    <MaybePlaceholder data={monthlyStats} placeholder={<Placeholder />}>
      <MonthlyChart data={monthlyStats} />
    </MaybePlaceholder>
  );
}
