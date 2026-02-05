import StatsCards from "./stats-cards";
import PendingApprovals from "./pending-approvals";
import ActiveCampaigns from "./active-campaigns";
import TopSpaces from "./top-spaces";
import SpendingChart from "./spending-chart";
import RecentActivity from "./recent-activity";

export default function Page() {
  return (
    <div className="flex flex-col gap-4 md:gap-6">
      <StatsCards />
      <PendingApprovals />
      <div className="grid grid-cols-1 gap-4 md:gap-6 @3xl/main:grid-cols-2">
        <ActiveCampaigns />
        <TopSpaces />
      </div>
      <SpendingChart />
      <RecentActivity />
    </div>
  );
}
