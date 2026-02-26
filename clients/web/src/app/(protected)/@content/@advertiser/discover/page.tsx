import { cookies } from "next/headers";
import api from "@/api/server";
import { graphql } from "@/types/gql";
import { ViewOptions } from "@/types/constants";
import storage from "@/lib/core/storage";
import { parseSpaceListParams } from "@/lib/space-list-params";
import Toolbar from "@/components/composed/toolbar";
import { TOOLBAR_PROPS, PRICE_RANGES } from "./constants";
import DiscoverGrid from "./(grid)/discover-grid";
import DiscoverTable from "./(table)/discover-table";
import DiscoverMap from "./(map)/discover-map";

export default async function Page(props: PageProps<"/discover">) {
  const { view, bounds, zoom, ...variables } = await Promise.all([
    cookies(),
    props.searchParams,
  ]).then(([cookieStore, searchParams]) => {
    const view = cookieStore.get(storage.preferences.discover.view)
      ?.value as ViewOptions;
    const {
      params,
      allEntries,
      filterEntries,
      boundsFilter,
      bounds,
      zoom,
      order,
      first,
    } = parseSpaceListParams(searchParams, view, ["price"]);

    const priceRange = allEntries.price
      ? PRICE_RANGES[allEntries.price]
      : undefined;
    const priceFilter = priceRange ? { pricePerDay: priceRange } : {};
    const searchFilter = params.q
      ? {
          or: [
            { title: { contains: params.q } },
            { city: { contains: params.q } },
          ],
        }
      : {};

    const filters = [
      { status: { eq: "ACTIVE" } },
      ...(Object.keys(filterEntries).length > 0 ? [filterEntries] : []),
      ...(Object.keys(priceFilter).length > 0 ? [priceFilter] : []),
      ...(Object.keys(boundsFilter).length > 0 ? [boundsFilter] : []),
      ...(Object.keys(searchFilter).length > 0 ? [searchFilter] : []),
    ];

    return {
      view,
      bounds,
      zoom,
      first,
      last: params.last,
      after: params.after,
      before: params.before,
      order,
      where: filters.length > 1 ? { and: filters } : filters[0],
      gridView:
        view === ViewOptions.Grid ||
        !view ||
        (view !== ViewOptions.Table && view !== ViewOptions.Map),
      tableView: view === ViewOptions.Table,
      mapView: view === ViewOptions.Map,
    };
  });

  const { spaces, pageInfo } = await api
    .query({
      query: graphql(`
        query DiscoverSpaces(
          $first: Int
          $last: Int
          $after: String
          $before: String
          $order: [SpaceSortInput!]
          $where: SpaceFilterInput
          $gridView: Boolean!
          $tableView: Boolean!
          $mapView: Boolean!
        ) {
          spaces(
            first: $first
            last: $last
            after: $after
            before: $before
            order: $order
            where: $where
          ) {
            nodes {
              id
              ...DiscoverSpaceCard_SpaceFragment @include(if: $gridView)
              ...DiscoverTable_SpaceFragment @include(if: $tableView)
              ...DiscoverMap_SpaceFragment @include(if: $mapView)
            }
            pageInfo {
              hasNextPage
              hasPreviousPage
              startCursor
              endCursor
            }
          }
        }
      `),
      variables,
    })
    .then((res) => ({
      spaces: res.data?.spaces?.nodes ?? [],
      pageInfo: res.data?.spaces?.pageInfo,
    }));

  return (
    <div className="flex flex-col gap-6">
      <Toolbar
        {...TOOLBAR_PROPS}
        pageInfo={pageInfo}
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
      {view === ViewOptions.Table && <DiscoverTable data={spaces} />}
      {view === ViewOptions.Map && (
        <DiscoverMap data={spaces} bounds={bounds} zoom={zoom} />
      )}
      {(view === ViewOptions.Grid ||
        !view ||
        (view !== ViewOptions.Table && view !== ViewOptions.Map)) && (
        <DiscoverGrid data={spaces} />
      )}
    </div>
  );
}
