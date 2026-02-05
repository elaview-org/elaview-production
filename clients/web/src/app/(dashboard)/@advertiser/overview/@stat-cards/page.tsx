import SummaryCard, {
  SummaryCardGrid,
} from "@/components/composed/summary-card";
import { calculateTrend, formatCurrency } from "@/lib/utils";
import { graphql } from "@/types/gql";
import api from "../api";
import {
  startOfMonth,
  subMonths,
  isWithinInterval,
  endOfMonth,
} from "date-fns";

const AdvertiserOverviewStatCards_QueryFragment = graphql(`
  fragment AdvertiserOverviewStatCards_QueryFragment on Query {
    me {
      advertiserProfile {
        totalSpend
      }
    }
    mySavedPaymentMethods {
      id
      isDefault
    }
    activeCampaigns: myCampaigns(
      where: { status: { in: [ACTIVE, SUBMITTED] } }
    ) {
      nodes {
        id
      }
    }
    activeBookings: myBookingsAsAdvertiser(
      where: { status: { in: [PAID, FILE_DOWNLOADED, INSTALLED, VERIFIED] } }
    ) {
      totalCount
    }
    pendingApprovals: myBookingsAsAdvertiser(
      where: { status: { eq: VERIFIED } }
    ) {
      totalCount
    }
    recentPayments: myBookingsAsAdvertiser(
      first: 50
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

export default async function Page() {
  const data = await api.getAdvertiserOverview(
    AdvertiserOverviewStatCards_QueryFragment
  );

  const paymentMethods = data.mySavedPaymentMethods ?? [];
  const hasDefaultPayment = paymentMethods.some((pm) => pm.isDefault);
  const hasPaymentMethods = paymentMethods.length > 0;
  const totalSpend = data.me?.advertiserProfile?.totalSpend ?? 0;
  const activeCampaignsCount = data.activeCampaigns?.nodes?.length ?? 0;
  const activeBookingsCount = data.activeBookings?.totalCount ?? 0;
  const pendingApprovalsCount = data.pendingApprovals?.totalCount ?? 0;

  const now = new Date();
  const thisMonthStart = startOfMonth(now);
  const thisMonthEnd = endOfMonth(now);
  const lastMonthStart = startOfMonth(subMonths(now, 1));
  const lastMonthEnd = endOfMonth(subMonths(now, 1));

  let thisMonthSpending = 0;
  let lastMonthSpending = 0;

  const bookings = data.recentPayments?.nodes ?? [];
  for (const booking of bookings) {
    for (const payment of booking.payments ?? []) {
      if (!payment.paidAt) continue;
      const paidAt = new Date(payment.paidAt);
      const amount = payment.amount ?? 0;

      if (
        isWithinInterval(paidAt, { start: thisMonthStart, end: thisMonthEnd })
      ) {
        thisMonthSpending += amount;
      } else if (
        isWithinInterval(paidAt, { start: lastMonthStart, end: lastMonthEnd })
      ) {
        lastMonthSpending += amount;
      }
    }
  }

  const spendingTrend = calculateTrend(thisMonthSpending, lastMonthSpending);

  const getPaymentBadge = () => {
    if (hasDefaultPayment) {
      return {
        type: "text" as const,
        text: "Payment Ready",
        className: "text-emerald-600 dark:text-emerald-400",
      };
    }
    if (hasPaymentMethods) {
      return {
        type: "text" as const,
        text: "Set Default",
        className: "text-amber-600 dark:text-amber-400",
      };
    }
    return {
      type: "text" as const,
      text: "Add Payment",
      className: "text-destructive",
    };
  };

  return (
    <SummaryCardGrid>
      <SummaryCard
        label="Total Spend"
        value={formatCurrency(totalSpend)}
        badge={getPaymentBadge()}
        footer="Lifetime ad spend"
        description="Across all campaigns"
        showFooterIcon={false}
      />
      <SummaryCard
        label="This Month"
        value={formatCurrency(thisMonthSpending)}
        badge={
          spendingTrend !== 0
            ? { type: "trend", value: spendingTrend }
            : undefined
        }
        footer={`${formatCurrency(lastMonthSpending)} last month`}
        description="vs previous month"
      />
      <SummaryCard
        label="Active Campaigns"
        value={activeCampaignsCount.toString()}
        footer={`${activeBookingsCount} active bookings`}
        description="Currently running"
        showFooterIcon={false}
      />
      <SummaryCard
        label="Pending Approvals"
        value={pendingApprovalsCount.toString()}
        footer="Installations to review"
        description="Awaiting your approval"
        showFooterIcon={false}
      />
    </SummaryCardGrid>
  );
}
