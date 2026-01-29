import { cookies } from "next/headers";
import { ViewOptions } from "@/types/constants";
import storage from "@/lib/storage";
import Toolbar from "@/components/composed/toolbar";
import { GridViewSkeleton } from "@/components/composed/grid-view";
import { TOOLBAR_PROPS } from "./constants";
import { BookingsTableSkeleton } from "./(table)/bookings-table";

export default async function Loading() {
  const cookieStore = await cookies();
  const viewCookie = cookieStore.get(
    storage.preferences.advertiserBookings.view
  )?.value;
  const view = viewCookie === ViewOptions.Table ? viewCookie : ViewOptions.Grid;

  return (
    <div className="flex flex-col gap-6">
      <Toolbar
        {...TOOLBAR_PROPS}
        currentView={view}
        onViewChangeAction={async (view: ViewOptions) => {
          "use server";
          (await cookies()).set(
            storage.preferences.advertiserBookings.view,
            view,
            {
              path: "/",
              maxAge: 60 * 60 * 24 * 365,
              sameSite: "lax",
            }
          );
        }}
      />
      {view === ViewOptions.Table && <BookingsTableSkeleton />}
      {view === ViewOptions.Grid && <GridViewSkeleton count={8} columns={4} />}
    </div>
  );
}
