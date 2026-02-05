import MaybePlaceholder from "@/components/status/maybe-placeholder";
import SpendingCards from "./spending-cards";
import SpendingChart from "./spending-chart";
import PaymentsTable from "./payments-table";
import Placeholder from "./placeholder";
import mockData from "./mock.json";

export default async function Page() {
  const summary = mockData.summary;
  const payments = mockData.payments;

  const chartData = generateChartData(payments);

  return (
    <div className="flex flex-col gap-6">
      <MaybePlaceholder
        data={summary ? [summary] : []}
        placeholder={<Placeholder />}
      >
        <>
          {summary && <SpendingCards data={summary} />}
          <SpendingChart data={chartData} />
          <PaymentsTable data={payments} />
        </>
      </MaybePlaceholder>
    </div>
  );
}

type PaymentNode = {
  createdAt?: unknown;
  amount?: unknown;
  status?: unknown;
};

function generateChartData(payments: PaymentNode[]) {
  const dailySpending = new Map<string, number>();

  for (const payment of payments) {
    if (!payment.createdAt || payment.status === "FAILED") continue;
    const date = new Date(String(payment.createdAt))
      .toISOString()
      .split("T")[0];
    const current = dailySpending.get(date) ?? 0;
    dailySpending.set(date, current + Number(payment.amount ?? 0));
  }

  const sortedDates = Array.from(dailySpending.keys()).sort();

  return sortedDates.map((date) => ({
    date,
    spending: dailySpending.get(date) ?? 0,
  }));
}
