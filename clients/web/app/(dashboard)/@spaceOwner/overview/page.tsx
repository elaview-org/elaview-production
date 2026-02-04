import StatsCards from "./@stat-cards/stats-cards";
import PendingRequests from "./@pending-requests/pending-requests";
import Page from "./@active-bookings/page";
import TopSpaces from "./@top-spaces/top-spaces";
import ActivityChart from "./@activity-chart/activity-chart";
import RecentActivity from "./@recent-activity/recent-activity";

export default async function Page() {
  return (
    <div className="flex flex-col gap-4 md:gap-6">
      <StatsCards />
      <PendingRequests />
      <div className="grid grid-cols-1 gap-4 md:gap-6 @3xl/main:grid-cols-2">
        <Page />
        <TopSpaces />
      </div>
      <ActivityChart />
      <RecentActivity />
    </div>
  );
}
