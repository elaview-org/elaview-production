import SummaryCard, {
  SummaryCardGrid,
} from "@/components/composed/summary-card";
import { calculateTrend, formatCurrency } from "@/lib/utils";

type SpendingSummary = {
  totalSpent: string;
  pendingPayments: string;
  thisMonthSpending: string;
  lastMonthSpending: string;
};

type Props = {
  data: SpendingSummary;
};

export default function SpendingCards({ data }: Props) {
  const totalSpent = Number(data.totalSpent);
  const pendingPayments = Number(data.pendingPayments);
  const thisMonthSpending = Number(data.thisMonthSpending);
  const lastMonthSpending = Number(data.lastMonthSpending);

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
        label="Last Month"
        value={formatCurrency(lastMonthSpending, { decimals: true })}
        badge={{ type: "text", text: "Previous" }}
        footer="Previous month total"
        description="Your spending last month"
        showFooterIcon={false}
      />
    </SummaryCardGrid>
  );
}
