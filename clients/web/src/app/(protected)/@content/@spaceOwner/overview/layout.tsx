export default function Layout(props: LayoutProps<"/overview">) {
  return (
    <div className="flex flex-col gap-4 md:gap-6">
      {props["stat-cards"]}
      {props["deadline-warnings"]}
      {props["pending-requests"]}
      <div className="grid grid-cols-1 gap-4 md:gap-6 @3xl/main:grid-cols-2">
        {props["active-bookings"]}
        {props["top-spaces"]}
      </div>
      {props["upcoming-payouts"]}
      {props["activity-chart"]}
      {props["recent-activity"]}
    </div>
  );
}
