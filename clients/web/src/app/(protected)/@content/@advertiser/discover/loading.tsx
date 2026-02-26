import { cookies } from "next/headers";
import { ViewOptions } from "@/types/constants";
import storage from "@/lib/core/storage";
import Toolbar from "@/components/composed/toolbar";
import { GridViewSkeleton } from "@/components/composed/grid-view";
import { TableViewSkeleton } from "@/components/composed/table-view";
import { MapViewSkeleton } from "@/components/composed/map-view";
import { TOOLBAR_PROPS } from "./constants";
import { columns } from "./(table)/columns";

export default async function Loading() {
  const cookieStore = await cookies();
  const viewCookie = cookieStore.get(storage.preferences.discover.view)?.value;
  const view =
    viewCookie === ViewOptions.Table || viewCookie === ViewOptions.Map
      ? viewCookie
      : ViewOptions.Grid;

  return (
    <div className="flex flex-col gap-6">
      <Toolbar
        {...TOOLBAR_PROPS}
        currentView={view}
        onViewChangeAction={async (view: ViewOptions) => {
          "use server";
          (await cookies()).set(storage.preferences.discover.view, view, {
            path: "/",
            maxAge: 60 * 60 * 24 * 365,
            sameSite: "lax",
          });
        }}
      />
      {view === ViewOptions.Table && (
        <TableViewSkeleton columns={columns} rows={8} />
      )}
      {view === ViewOptions.Map && (
        <MapViewSkeleton height="calc(100dvh - 13rem)" />
      )}
      {view === ViewOptions.Grid && <GridViewSkeleton count={8} columns={4} />}
    </div>
  );
}
