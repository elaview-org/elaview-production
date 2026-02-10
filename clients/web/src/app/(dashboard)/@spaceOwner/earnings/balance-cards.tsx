"use client";

import { FragmentType, getFragmentData, graphql } from "@/types/gql";
import SummaryCard, {
  SummaryCardGrid,
} from "@/components/composed/summary-card";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/primitives/card";
import { Badge } from "@/components/primitives/badge";
import { calculateTrend, formatCurrency } from "@/lib/core/utils";
import WithdrawDialog from "./withdraw-dialog";

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
  stripeAccountStatus?: string | null;
};

export default function BalanceCards({ data, stripeAccountStatus }: Props) {
  const summary = getFragmentData(BalanceCards_EarningsSummaryFragment, data);
  const stripeBadge = getStripeBadge(stripeAccountStatus);
  const stripeConnected = isStripeConnected(stripeAccountStatus);

  const availableBalance = Number(summary.availableBalance);
  const pendingPayouts = Number(summary.pendingPayouts);
  const thisMonthEarnings = Number(summary.thisMonthEarnings);
  const lastMonthEarnings = Number(summary.lastMonthEarnings);
  const totalEarnings = Number(summary.totalEarnings);

  const monthlyChange = calculateTrend(thisMonthEarnings, lastMonthEarnings);
  const isPositiveChange = monthlyChange >= 0;

  return (
    <SummaryCardGrid>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Available Balance</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {formatCurrency(availableBalance, { decimals: true })}
          </CardTitle>
          <CardAction>
            <Badge variant="outline" className={stripeBadge.className}>
              {stripeBadge.text}
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="flex w-full items-center justify-between">
            <div className="line-clamp-1 font-medium">Ready for withdrawal</div>
            <WithdrawDialog
              availableBalance={availableBalance}
              stripeConnected={stripeConnected}
            />
          </div>
          <div className="text-muted-foreground">
            Funds available in your account
          </div>
        </CardFooter>
      </Card>
      <SummaryCard
        label="Pending Payouts"
        value={formatCurrency(pendingPayouts, { decimals: true })}
        badge={{
          type: "text",
          text: "Processing",
          className: "text-yellow-600",
        }}
        footer="In escrow awaiting release"
        description="Pending booking verifications"
        showFooterIcon={false}
      />
      <SummaryCard
        label="This Month"
        value={formatCurrency(thisMonthEarnings, { decimals: true })}
        badge={{ type: "trend", value: monthlyChange }}
        footer={`${isPositiveChange ? "Trending up" : "Trending down"} this month`}
        description={`Compared to ${formatCurrency(lastMonthEarnings, { decimals: true })} last month`}
      />
      <SummaryCard
        label="Total Earnings"
        value={formatCurrency(totalEarnings, { decimals: true })}
        badge={{ type: "text", text: "Lifetime" }}
        footer="All-time earnings"
        description="Since you joined the platform"
        showFooterIcon={false}
      />
    </SummaryCardGrid>
  );
}

type TextBadge = {
  type: "text";
  text: string;
  className?: string;
};

function getStripeBadge(status?: string | null): TextBadge {
  switch (status?.toLowerCase()) {
    case "active":
    case "complete":
      return {
        type: "text",
        text: "Connected",
        className: "text-emerald-600 dark:text-emerald-400",
      };
    case "pending":
    case "incomplete":
      return {
        type: "text",
        text: "Pending",
        className: "text-amber-600 dark:text-amber-400",
      };
    case "restricted":
    case "restricted_soon":
      return {
        type: "text",
        text: "Action Required",
        className: "text-destructive",
      };
    default:
      return {
        type: "text",
        text: "Not Connected",
        className: "text-muted-foreground",
      };
  }
}

function isStripeConnected(status?: string | null): boolean {
  const connectedStatuses = ["active", "complete"];
  return connectedStatuses.includes(status?.toLowerCase() ?? "");
}
