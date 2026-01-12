import { Suspense } from "react";
import Content from "./content";
import DiscoverSkeleton from "./discover-skeleton";

export default function Layout({ grid, map }: LayoutProps<"/discover">) {
  return (
    <div className="bg-background">
      <div className="p-4 lg:p-8">
        <Suspense fallback={<DiscoverSkeleton />}>
          <Content gridView={grid} mapView={map} />
        </Suspense>
      </div>
    </div>
  );
}