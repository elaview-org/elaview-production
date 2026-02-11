export default function Layout(props: LayoutProps<"/analytics">) {
  return (
    <div className="flex flex-col gap-6">
      {props["summary"]}
      {props["top-performers"]}

      <div className="grid grid-cols-1 gap-6 @3xl/main:grid-cols-2">
        {props["spending-chart"]}
        {props["status-chart"]}
      </div>

      <div className="grid grid-cols-1 gap-6 @3xl/main:grid-cols-2">
        {props["monthly-chart"]}
        {props["reach-chart"]}
      </div>

      {props["comparison"]}
      {props["performance-table"]}
    </div>
  );
}
