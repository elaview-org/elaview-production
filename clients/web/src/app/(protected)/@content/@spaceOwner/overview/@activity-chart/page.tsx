import { graphql } from "@/types/gql";
import api from "../api";
import ActivityChart from "./activity-chart";

const OverviewActivityChart_QueryFragment = graphql(`
  fragment OverviewActivityChart_QueryFragment on Query {
    myPayouts(first: 20, order: [{ processedAt: DESC }]) {
      nodes {
        amount
        processedAt
      }
    }
  }
`);

type ChartDataPoint = {
  date: string;
  bookings: number;
  earnings: number;
};

export default async function Page() {
  const payouts = await api
    .getMyOverview(OverviewActivityChart_QueryFragment)
    .then((res) => res.myPayouts?.nodes ?? []);

  const dataByDate = new Map<string, { bookings: number; earnings: number }>();

  for (const payout of payouts) {
    if (!payout.processedAt) continue;
    const date = new Date(payout.processedAt).toISOString().split("T")[0];
    const existing = dataByDate.get(date) ?? { bookings: 0, earnings: 0 };
    dataByDate.set(date, {
      bookings: existing.bookings + 1,
      earnings: existing.earnings + (payout.amount ?? 0),
    });
  }

  const chartData: ChartDataPoint[] = Array.from(dataByDate.entries())
    .map(([date, data]) => ({ date, ...data }))
    .sort((a, b) => a.date.localeCompare(b.date));

  return <ActivityChart data={chartData} />;
}
