import { FragmentType, getFragmentData, graphql } from "@/types/gql";
import SummaryCard, {
  SummaryCardGrid,
} from "@/components/composed/summary-card";

export const BalanceCards_EarningsSummaryFragment = graphql(`
  fragment BalanceCards_EarningsSummaryFragment on EarningsSummary {
    availableBalance
    pendingPayouts
    thisMonthEarnings
    lastMonthEarnings
    totalEarnings
  }
`);

type Props = {
  data: FragmentType<typeof BalanceCards_EarningsSummaryFragment>;
};

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(amount);
}

function calculateChange(current: number, previous: number): number {
  if (previous === 0) return current > 0 ? 100 : 0;
  return ((current - previous) / previous) * 100;
}

export default function BalanceCards({ data }: Props) {
  const summary = getFragmentData(BalanceCards_EarningsSummaryFragment, data);

  const availableBalance = Number(summary.availableBalance);
  const pendingPayouts = Number(summary.pendingPayouts);
  const thisMonthEarnings = Number(summary.thisMonthEarnings);
  const lastMonthEarnings = Number(summary.lastMonthEarnings);
  const totalEarnings = Number(summary.totalEarnings);

  const monthlyChange = calculateChange(thisMonthEarnings, lastMonthEarnings);
  const isPositiveChange = monthlyChange >= 0;

  return (
    <SummaryCardGrid>
      <SummaryCard
        label="Available Balance"
        value={formatCurrency(availableBalance)}
        badge={{ type: "text", text: "Ready", className: "text-green-600" }}
        footer="Ready for withdrawal"
        description="Funds available in your account"
        showFooterIcon={false}
      />
      <SummaryCard
        label="Pending Payouts"
        value={formatCurrency(pendingPayouts)}
        badge={{ type: "text", text: "Processing", className: "text-yellow-600" }}
        footer="In escrow awaiting release"
        description="Pending booking verifications"
        showFooterIcon={false}
      />
      <SummaryCard
        label="This Month"
        value={formatCurrency(thisMonthEarnings)}
        badge={{ type: "trend", value: monthlyChange }}
        footer={`${isPositiveChange ? "Trending up" : "Trending down"} this month`}
        description={`Compared to ${formatCurrency(lastMonthEarnings)} last month`}
      />
      <SummaryCard
        label="Total Earnings"
        value={formatCurrency(totalEarnings)}
        badge={{ type: "text", text: "Lifetime" }}
        footer="All-time earnings"
        description="Since you joined the platform"
        showFooterIcon={false}
      />
    </SummaryCardGrid>
  );
}