import StatsCards from "./stats-cards";
import PendingRequests from "./pending-requests";
import ActiveBookings from "./active-bookings";
import TopSpaces from "./top-spaces";
import ActivityChart from "./activity-chart";
import RecentActivity from "./recent-activity";

export default function Page() {
  console.log("[PARALLEL ROUTE TEST] @spaceOwner/overview rendered");
  return (
    <div className="flex flex-col gap-4 md:gap-6">
      <StatsCards />
      <PendingRequests />
      <div className="grid grid-cols-1 gap-4 md:gap-6 @3xl/main:grid-cols-2">
        <ActiveBookings />
        <TopSpaces />
      </div>
      <ActivityChart />
      <RecentActivity />
    </div>
  );
}