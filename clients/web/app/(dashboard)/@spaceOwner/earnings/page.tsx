import api from "@/api/gql/server";
import { graphql } from "@/types/gql";
import { redirect } from "next/navigation";
import BalanceCards from "./balance-cards";
import EarningsChart from "./earnings-chart";
import PayoutsTable from "./payouts-table";
import MaybePlaceholder from "@/components/status/maybe-placeholder";
import Placeholder from "./placeholder";

export default async function Page() {
  const { data, error } = await api.query({
    query: graphql(`
      query SpaceOwnerEarnings {
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
  });

  if (error) {
    redirect("/logout");
  }

  const summary = data?.earningsSummary;
  const payouts = data?.myPayouts?.nodes ?? [];

  const chartData = generateChartData(payouts);

  return (
    <div className="flex flex-col gap-6">
      <MaybePlaceholder
        data={summary ? [summary] : []}
        placeholder={<Placeholder />}
      >
        <>
          {summary && <BalanceCards data={summary} />}
          <EarningsChart data={chartData} />
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
