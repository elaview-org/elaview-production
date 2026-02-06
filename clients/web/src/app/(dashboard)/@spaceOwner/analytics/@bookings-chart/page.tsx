import { graphql } from "@/types/gql";
import api from "../api";
import BookingsChart from "./bookings-chart";

const AnalyticsBookingsChart_QueryFragment = graphql(`
  fragment AnalyticsBookingsChart_QueryFragment on Query {
    spaceOwnerDailyStats(startDate: $startDate, endDate: $endDate) {
      date
      bookings
    }
  }
`);

export default async function Page() {
  const dailyStats = await api
    .getAnalytics(AnalyticsBookingsChart_QueryFragment)
    .then((res) => res.spaceOwnerDailyStats);

  return <BookingsChart data={dailyStats} />;
}
