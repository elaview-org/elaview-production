import { cookies } from "next/headers";
import api from "@/api/server";
import { ViewOptions } from "@/types/constants";
import storage from "@/lib/core/storage";
import { parseSpaceListParams } from "@/lib/space-list-params";
import Toolbar from "@/components/composed/toolbar";
import CreateSpace from "./create-space";
import { TOOLBAR_PROPS } from "./constants";
import ListingsGrid from "./(grid)/listings-grid";
import ListingsTable from "./(table)/listings-table";
import ListingsMap from "./(map)/listings-map";

export default async function Page(props: PageProps<"/listings">) {
  const { view, bounds, zoom, ...variables } = await Promise.all([
    cookies(),
    props.searchParams,
  ]).then(([cookieStore, searchParams]) => {
    const view = cookieStore.get(storage.preferences.listings.view)
      ?.value as ViewOptions;
    const {
      params,
      filterEntries,
      hasBounds,
      boundsFilter,
      bounds,
      zoom,
      order,
      first,
    } = parseSpaceListParams(searchParams, view);

    return {
      view,
      bounds,
      zoom,
      first,
      last: params.last,
      after: params.after,
      before: params.before,
      order,
      where:
        params.q || Object.keys(filterEntries).length > 0 || hasBounds
          ? {
              ...filterEntries,
              ...boundsFilter,
              ...(params.q && { title: { contains: params.q } }),
            }
          : undefined,
      gridView: view === ViewOptions.Grid,
      tableView: view === ViewOptions.Table,
      mapView: view === ViewOptions.Map,
    };
  });

  const { spaces, pageInfo } = await api.listings.list(variables);

  return (
    <div className="flex flex-col gap-6">
      <Toolbar
        {...TOOLBAR_PROPS}
        pageInfo={pageInfo}
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
      {view === ViewOptions.Table && <ListingsTable data={spaces} />}
      {view === ViewOptions.Map && (
        <ListingsMap data={spaces} bounds={bounds} zoom={zoom} />
      )}
      {view === ViewOptions.Grid && <ListingsGrid data={spaces} />}
    </div>
  );
}
