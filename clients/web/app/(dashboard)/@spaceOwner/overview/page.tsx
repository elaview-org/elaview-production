import StatsCards from "./stats-cards";
import ActivityChart from "./activity-chart";
import RecentActivity from "./recent-activity";

export default function Page() {
  return (
    <div className="flex flex-col gap-4 md:gap-6">
      <StatsCards />
      <ActivityChart />
      <RecentActivity />
    </div>
  );
}