import SummaryCard, {
  SummaryCardGrid,
} from "@/components/composed/summary-card";
import { calculateTrend, formatCurrency } from "@/lib/core/utils";
import { graphql } from "@/types/gql";
import api from "../api";

const OverviewStatCards_QueryFragment = graphql(`
  fragment OverviewStatCards_QueryFragment on Query {
    me {
      spaceOwnerProfile {
        stripeAccountStatus
      }
    }
    earningsSummary {
      availableBalance
      pendingPayouts
      thisMonthEarnings
      lastMonthEarnings
    }
    activeBookings: myBookingsAsOwner(
      where: { status: { in: [PAID, FILE_DOWNLOADED, INSTALLED, VERIFIED] } }
    ) {
      totalCount
    }
    mySpaces {
      totalCount
    }
  }
`);

export default async function Page() {
  const data = await api.getMyOverview(OverviewStatCards_QueryFragment);

  const stripeStatus = data.me?.spaceOwnerProfile?.stripeAccountStatus;
  const earnings = data.earningsSummary ?? null;
  const availableBalance = earnings?.availableBalance ?? 0;
  const pendingPayouts = earnings?.pendingPayouts ?? 0;
  const thisMonth = earnings?.thisMonthEarnings ?? 0;
  const lastMonth = earnings?.lastMonthEarnings ?? 0;
  const earningsTrend = calculateTrend(thisMonth, lastMonth);
  const activeBookingsCount = data.activeBookings?.totalCount ?? 0;
  const totalSpacesCount = data.mySpaces?.totalCount ?? 0;

  const getStripeBadge = () => {
    if (stripeStatus === "complete") {
      return {
        type: "text" as const,
        text: "Connected",
        className: "text-emerald-600 dark:text-emerald-400",
      };
    }
    if (stripeStatus === "pending") {
      return {
        type: "text" as const,
        text: "Pending",
        className: "text-amber-600 dark:text-amber-400",
      };
    }
    return {
      type: "text" as const,
      text: "Action Required",
      className: "text-destructive",
    };
  };

  return (
    <SummaryCardGrid>
      <SummaryCard
        label="Available Balance"
        value={formatCurrency(availableBalance)}
        badge={getStripeBadge()}
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
        value={activeBookingsCount.toString()}
        footer={`${totalSpacesCount} total spaces`}
        description="Currently in progress"
        showFooterIcon={false}
      />
    </SummaryCardGrid>
  );
}
