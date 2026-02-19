import api from "@/api/server";
import { graphql } from "@/types/gql";
import BalanceCards from "./balance-cards";
import EarningsChart from "./earnings-chart";
import PayoutsTable from "./payouts-table";
import ExportButton from "./export-button";
import MaybePlaceholder from "@/components/status/maybe-placeholder";
import Placeholder from "./placeholder";
import Link from "next/link";
import { Button } from "@/components/primitives/button";

export default async function Page() {
  const { summary, payouts, stripeAccountStatus } = await api
    .query({
      query: graphql(`
        query SpaceOwnerEarnings {
          me {
            spaceOwnerProfile {
              stripeAccountStatus
            }
          }
          earningsSummary {
            ...BalanceCards_EarningsSummaryFragment
          }
          myPayouts {
            nodes {
              id
              amount
              processedAt
              ...PayoutsTable_PayoutFragment
            }
          }
        }
      `),
    })
    .then((res) => ({
      summary: res.data?.earningsSummary,
      payouts: res.data?.myPayouts?.nodes ?? [],
      stripeAccountStatus: res.data?.me?.spaceOwnerProfile?.stripeAccountStatus,
    }));

  const chartData = generateChartData(payouts);

  return (
    <div className="flex flex-col gap-6">
      <MaybePlaceholder
        data={summary ? [summary] : []}
        placeholder={<Placeholder />}
      >
        <>
          {summary && (
            <BalanceCards
              data={summary}
              stripeAccountStatus={stripeAccountStatus}
            />
          )}
          <EarningsChart data={chartData} />
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Recent Payouts</h2>
            <div className="flex items-center gap-2">
              <ExportButton
                payouts={
                  payouts as unknown as Parameters<
                    typeof ExportButton
                  >[0]["payouts"]
                }
              />
              <Button variant="outline" size="sm" asChild>
                <Link href="/earnings/payouts">View All</Link>
              </Button>
            </div>
          </div>
          <PayoutsTable
            data={
              payouts as unknown as Parameters<typeof PayoutsTable>[0]["data"]
            }
          />
        </>
      </MaybePlaceholder>
    </div>
  );
}

type PayoutNode = {
  processedAt?: unknown;
  amount?: unknown;
};

function generateChartData(payouts: PayoutNode[]) {
  const dailyEarnings = new Map<string, number>();

  for (const payout of payouts) {
    if (!payout.processedAt) continue;
    const date = new Date(String(payout.processedAt))
      .toISOString()
      .split("T")[0];
    const current = dailyEarnings.get(date) ?? 0;
    dailyEarnings.set(date, current + Number(payout.amount ?? 0));
  }

  const sortedDates = Array.from(dailyEarnings.keys()).sort();

  return sortedDates.map((date) => ({
    date,
    earnings: dailyEarnings.get(date) ?? 0,
  }));
}
