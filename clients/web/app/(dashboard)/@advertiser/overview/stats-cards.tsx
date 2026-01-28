import SummaryCard, {
  SummaryCardGrid,
} from "@/components/composed/summary-card";
import { calculateTrend, formatCurrency } from "@/lib/utils";
import mock from "./mock.json";

export default function StatsCards() {
  const { stats } = mock;
  const spendTrend = calculateTrend(stats.thisMonthSpend, stats.lastMonthSpend);
  const campaignTrend = calculateTrend(stats.activeCampaigns, stats.previousActiveCampaigns);

  return (
    <SummaryCardGrid>
      <SummaryCard
        label="Total Spend"
        value={formatCurrency(stats.totalSpend)}
        footer={`${formatCurrency(stats.monthlyBudget)} monthly budget`}
        description="Lifetime ad spend"
        showFooterIcon={false}
      />
      <SummaryCard
        label="This Month"
        value={formatCurrency(stats.thisMonthSpend)}
        badge={spendTrend !== 0 ? { type: "trend", value: spendTrend } : undefined}
        footer={`${formatCurrency(stats.lastMonthSpend)} last month`}
        description="vs previous month"
      />
      <SummaryCard
        label="Active Campaigns"
        value={stats.activeCampaigns.toString()}
        badge={campaignTrend !== 0 ? { type: "trend", value: campaignTrend } : undefined}
        footer={`${stats.activeBookings} active bookings`}
        description="Currently running"
      />
      <SummaryCard
        label="Pending Approvals"
        value={stats.pendingApprovals.toString()}
        footer="Installations to review"
        description="Awaiting your approval"
        showFooterIcon={false}
      />
    </SummaryCardGrid>
  );
}
