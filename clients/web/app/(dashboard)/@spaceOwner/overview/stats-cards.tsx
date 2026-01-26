import SummaryCard, {
  SummaryCardGrid,
} from "@/components/composed/summary-card";
import mock from "./mock.json";

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
  }).format(amount);
}

function calculateTrend(current: number, previous: number) {
  if (previous === 0) return 0;
  return Math.round(((current - previous) / previous) * 100);
}

export default function StatsCards() {
  const { stats } = mock;
  const earningsTrend = calculateTrend(stats.thisMonthEarnings, stats.lastMonthEarnings);
  const bookingsTrend = calculateTrend(stats.activeBookings, stats.previousActiveBookings);

  return (
    <SummaryCardGrid>
      <SummaryCard
        label="Available Balance"
        value={formatCurrency(stats.availableBalance)}
        footer="Ready to withdraw"
        description="From completed bookings"
        showFooterIcon={false}
      />
      <SummaryCard
        label="Pending Payouts"
        value={formatCurrency(stats.pendingPayouts)}
        footer="Processing"
        description="Awaiting verification"
        showFooterIcon={false}
      />
      <SummaryCard
        label="This Month"
        value={formatCurrency(stats.thisMonthEarnings)}
        badge={earningsTrend !== 0 ? { type: "trend", value: earningsTrend } : undefined}
        footer={`${formatCurrency(stats.lastMonthEarnings)} last month`}
        description="vs previous month"
      />
      <SummaryCard
        label="Active Bookings"
        value={stats.activeBookings.toString()}
        badge={bookingsTrend !== 0 ? { type: "trend", value: bookingsTrend } : undefined}
        footer={`${stats.totalSpaces} total spaces`}
        description="Currently in progress"
      />
    </SummaryCardGrid>
  );
}