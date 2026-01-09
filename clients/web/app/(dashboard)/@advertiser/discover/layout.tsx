import Content from "./content";

export default function Layout({ grid, map }: LayoutProps<"/discover">) {
  return (
    <div className="bg-background min-h-screen">
      <div className="p-4 lg:p-8">
        <Content gridView={grid} mapView={map} />
      </div>
    </div>
  );
}
