function SpaceOwnerLayout(props: LayoutProps<"/analytics">) {
  //it should have some infomation that pass route
  return (
    <div className="flex flex-col gap-6">
      {props["summary-cards"]}
      <div className="grid grid-cols-1 gap-6 @3xl/main:grid-cols-2">
        {props["bookings-chart"]}
        {props["status-chart"]}
      </div>
      <div className="grid grid-cols-1 gap-6 @3xl/main:grid-cols-2">
        {props["monthly-chart"]}
        {props["rating-chart"]}
      </div>
      <div className="grid grid-cols-1 gap-6 @3xl/main:grid-cols-2">
        {props["heatmap-chart"]}
        {props["comparison-card"]}
      </div>
      {props["topPerformers"]}
      {props["revenue-chart"]}
      {props["performance-table"]}
    </div>
  );
}
export default SpaceOwnerLayout;
