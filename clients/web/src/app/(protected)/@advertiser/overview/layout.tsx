export default function Layout(props: LayoutProps<"/overview">) {
  return (
    <div className="flex flex-col gap-4 md:gap-6">
      {props["stat-cards"]}
      {props["deadline-warnings"]}
      {props["pending-payments"]}
      {props["pending-approvals"]}
      <div className="grid grid-cols-1 gap-4 md:gap-6 @3xl/main:grid-cols-2">
        {props["active-campaigns"]}
        {props["top-spaces"]}
      </div>
      {props["spending-chart"]}
      {props["recent-activity"]}
    </div>
  );
}
