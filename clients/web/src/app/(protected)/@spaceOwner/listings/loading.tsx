import { cookies } from "next/headers";
import { ViewOptions } from "@/types/constants";
import storage from "@/lib/core/storage";
import Toolbar from "@/components/composed/toolbar";
import { GridViewSkeleton } from "@/components/composed/grid-view";
import { TableViewSkeleton } from "@/components/composed/table-view";
import { MapViewSkeleton } from "@/components/composed/map-view";
import CreateSpace from "./create-space";
import { TOOLBAR_PROPS } from "./constants";
import { columns } from "./(table)/columns";

export default async function Loading() {
  const cookieStore = await cookies();
  const viewCookie = cookieStore.get(storage.preferences.listings.view)?.value;
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
          (await cookies()).set(storage.preferences.listings.view, view, {
            path: "/",
            maxAge: 60 * 60 * 24 * 365,
            sameSite: "lax",
          });
        }}
        action={<CreateSpace />}
      />
      {view === ViewOptions.Table && (
        <TableViewSkeleton columns={columns} rows={8} />
      )}
      {view === ViewOptions.Map && <MapViewSkeleton height={600} />}
      {view === ViewOptions.Grid && <GridViewSkeleton count={8} columns={4} />}
    </div>
  );
}
