import SummaryCard, {
  SummaryCardGrid,
} from "@/components/composed/summary-card";
import { calculateTrend, formatCurrency } from "@/lib/utils";
import { graphql } from "@/types/gql";
import api from "../api";
import mock from "./mock.json";

const OverviewStatCards_QueryFragment = graphql(`
  fragment OverviewStatCards_QueryFragment on Query {
    earningsSummary {
      availableBalance
      pendingPayouts
      thisMonthEarnings
      lastMonthEarnings
    }
  }
`);

export default async function Page() {
  const earnings = await api
    .getMyOverview(OverviewStatCards_QueryFragment)
    .then((res) => res.earningsSummary ?? null);

  const availableBalance = earnings?.availableBalance ?? 0;
  const pendingPayouts = earnings?.pendingPayouts ?? 0;
  const thisMonth = earnings?.thisMonthEarnings ?? 0;
  const lastMonth = earnings?.lastMonthEarnings ?? 0;
  const earningsTrend = calculateTrend(thisMonth, lastMonth);
  const bookingsTrend = calculateTrend(
    mock.activeBookings,
    mock.previousActiveBookings
  );

  return (
    <SummaryCardGrid>
      <SummaryCard
        label="Available Balance"
        value={formatCurrency(availableBalance)}
        footer="Ready to withdraw"
        description="From completed bookings"
        showFooterIcon={false}
      />
      <SummaryCard
        label="Pending Payouts"
        value={formatCurrency(pendingPayouts)}
        footer="Processing"
        description="Awaiting verification"
        showFooterIcon={false}
      />
      <SummaryCard
        label="This Month"
        value={formatCurrency(thisMonth)}
        badge={
          earningsTrend !== 0
            ? { type: "trend", value: earningsTrend }
            : undefined
        }
        footer={`${formatCurrency(lastMonth)} last month`}
        description="vs previous month"
      />
      <SummaryCard
        label="Active Bookings"
        value={mock.activeBookings.toString()}
        badge={
          bookingsTrend !== 0
            ? { type: "trend", value: bookingsTrend }
            : undefined
        }
        footer={`${mock.totalSpaces} total spaces`}
        description="Currently in progress"
      />
    </SummaryCardGrid>
  );
}
