import SummaryCards from "./summary-cards";
import BookingsChart from "./bookings-chart";
import StatusChart from "./status-chart";
import RevenueChart from "./revenue-chart";
import MonthlyChart from "./monthly-chart";
import RatingChart from "./rating-chart";
import HeatmapChart from "./heatmap-chart";
import ComparisonCard from "./comparison-card";
import TopPerformers from "./top-performers";
import PerformanceTable from "./performance-table";

export default function Page() {
  return (
    <div className="flex flex-col gap-6">
      <SummaryCards />

      <div className="grid grid-cols-1 gap-6 @3xl/main:grid-cols-2">
        <BookingsChart />
        <StatusChart />
      </div>

      <div className="grid grid-cols-1 gap-6 @3xl/main:grid-cols-2">
        <MonthlyChart />
        <RatingChart />
      </div>

      <div className="grid grid-cols-1 gap-6 @3xl/main:grid-cols-2">
        <HeatmapChart />
        <ComparisonCard />
      </div>

      <TopPerformers />
      <RevenueChart />
      <PerformanceTable />
    </div>
  );
}
