import SummaryCards from "./summary-cards";
import SpendingChart from "./spending-chart";
import StatusChart from "./status-chart";
import ReachChart from "./reach-chart";
import MonthlyChart from "./monthly-chart";
import ComparisonCard from "./comparison-card";
import TopPerformers from "./top-performers";
import PerformanceTable from "./performance-table";

export default function Page() {
  return (
    <div className="flex flex-col gap-6">
      <SummaryCards />

      <TopPerformers />

      <div className="grid grid-cols-1 gap-6 @3xl/main:grid-cols-2">
        <SpendingChart />
        <StatusChart />
      </div>

      <div className="grid grid-cols-1 gap-6 @3xl/main:grid-cols-2">
        <MonthlyChart />
        <ReachChart />
      </div>

      <ComparisonCard />

      <PerformanceTable />
    </div>
  );
}
