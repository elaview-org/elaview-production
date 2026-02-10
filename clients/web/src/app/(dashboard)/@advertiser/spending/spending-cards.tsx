"use client";

import { FragmentType, getFragmentData, graphql } from "@/types/gql";
import SummaryCard, {
  SummaryCardGrid,
} from "@/components/composed/summary-card";
import { calculateTrend, formatCurrency } from "@/lib/core/utils";

export const SpendingCards_SpendingSummaryFragment = graphql(`
  fragment SpendingCards_SpendingSummaryFragment on SpendingSummary {
    totalSpent
    pendingPayments
    thisMonthSpending
    lastMonthSpending
  }
`);

type Props = {
  data: FragmentType<typeof SpendingCards_SpendingSummaryFragment>;
  activeCampaignsCount: number;
};

export default function SpendingCards({ data, activeCampaignsCount }: Props) {
  const summary = getFragmentData(SpendingCards_SpendingSummaryFragment, data);

  const totalSpent = Number(summary.totalSpent ?? 0);
  const pendingPayments = Number(summary.pendingPayments ?? 0);
  const thisMonthSpending = Number(summary.thisMonthSpending ?? 0);
  const lastMonthSpending = Number(summary.lastMonthSpending ?? 0);

  const monthlyChange = calculateTrend(thisMonthSpending, lastMonthSpending);
  const isNegativeChange = monthlyChange < 0;

  return (
    <SummaryCardGrid>
      <SummaryCard
        label="Total Spent"
        value={formatCurrency(totalSpent, { decimals: true })}
        badge={{ type: "text", text: "Lifetime" }}
        footer="All-time spending"
        description="Since you joined the platform"
        showFooterIcon={false}
      />
      <SummaryCard
        label="Pending Payments"
        value={formatCurrency(pendingPayments, { decimals: true })}
        badge={{
          type: "text",
          text: "In Escrow",
          className: "text-yellow-600",
        }}
        footer="Awaiting booking completion"
        description="Will be released upon verification"
        showFooterIcon={false}
      />
      <SummaryCard
        label="This Month"
        value={formatCurrency(thisMonthSpending, { decimals: true })}
        badge={{ type: "trend", value: monthlyChange }}
        footer={`${isNegativeChange ? "Spending down" : "Spending up"} this month`}
        description={`Compared to ${formatCurrency(lastMonthSpending, { decimals: true })} last month`}
      />
      <SummaryCard
        label="Active Campaigns"
        value={String(activeCampaignsCount)}
        badge={{ type: "text", text: "Currently Running" }}
        footer="Campaigns in progress"
        description="Active and submitted campaigns"
        showFooterIcon={false}
      />
    </SummaryCardGrid>
  );
}
