import { graphql } from "@/types/gql";
import api from "../api";
import SpendingChart from "./spending-chart";

const AdvertiserOverviewSpendingChart_QueryFragment = graphql(`
  fragment AdvertiserOverviewSpendingChart_QueryFragment on Query {
    spendingChartBookings: myBookingsAsAdvertiser(
      first: 20
      where: {
        status: { in: [PAID, FILE_DOWNLOADED, INSTALLED, VERIFIED, COMPLETED] }
      }
    ) {
      nodes {
        payments(where: { status: { eq: SUCCEEDED } }) {
          amount
          paidAt
        }
      }
    }
  }
`);

type ChartDataPoint = {
  date: string;
  spending: number;
};

export default async function Page() {
  const bookings = await api
    .getAdvertiserOverview(AdvertiserOverviewSpendingChart_QueryFragment)
    .then((res) => res.spendingChartBookings?.nodes ?? []);

  const spendingByDate = new Map<string, number>();

  for (const booking of bookings) {
    for (const payment of booking.payments ?? []) {
      if (!payment.paidAt) continue;

      const date = new Date(payment.paidAt).toISOString().split("T")[0];
      const existing = spendingByDate.get(date) ?? 0;
      spendingByDate.set(date, existing + (payment.amount ?? 0));
    }
  }

  const chartData: ChartDataPoint[] = Array.from(spendingByDate.entries())
    .map(([date, spending]) => ({ date, spending }))
    .sort((a, b) => a.date.localeCompare(b.date));

  return <SpendingChart data={chartData} />;
}
