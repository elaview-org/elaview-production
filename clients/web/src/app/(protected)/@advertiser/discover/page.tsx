import { cookies } from "next/headers";
import api from "@/lib/gql/server";
import { graphql, SortEnumType } from "@/types/gql";
import { z } from "zod";
import { ViewOptions } from "@/types/constants";
import storage from "@/lib/core/storage";
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
    const params = z
      .object({
        first: z.coerce
          .number()
          .int()
          .positive()
          .max(100)
          .optional()
          .catch(undefined),
        last: z.coerce
          .number()
          .int()
          .positive()
          .max(100)
          .optional()
          .catch(undefined),
        after: z.string().optional().catch(undefined),
        before: z.string().optional().catch(undefined),
        sort: z.string().optional().catch(undefined),
        filter: z.string().optional().catch(undefined),
        q: z.string().optional().catch(undefined),
      })
      .parse(searchParams);

    const mapKeys = new Set(["minLat", "maxLat", "minLng", "maxLng", "zoom"]);
    const allEntries = params.filter
      ? Object.fromEntries(
          params.filter.split(",").map((entry) => {
            const [key, ...rest] = entry.split(":");
            return [key, rest.join(":")];
          })
        )
      : {};

    const mapEntries = {
      minLat: allEntries.minLat ? Number(allEntries.minLat) : undefined,
      maxLat: allEntries.maxLat ? Number(allEntries.maxLat) : undefined,
      minLng: allEntries.minLng ? Number(allEntries.minLng) : undefined,
      maxLng: allEntries.maxLng ? Number(allEntries.maxLng) : undefined,
      zoom: allEntries.zoom ? Number(allEntries.zoom) : undefined,
    };

    const filterEntries = Object.fromEntries(
      Object.entries(allEntries)
        .filter(([key]) => !mapKeys.has(key) && key !== "price")
        .map(([key, value]) => [key, { eq: value }])
    );

    const priceRange = allEntries.price
      ? PRICE_RANGES[allEntries.price]
      : undefined;
    const priceFilter = priceRange ? { pricePerDay: priceRange } : {};

    const hasBounds =
      mapEntries.minLat !== undefined &&
      mapEntries.maxLat !== undefined &&
      mapEntries.minLng !== undefined &&
      mapEntries.maxLng !== undefined;

    const boundsFilter =
      view === ViewOptions.Map && hasBounds
        ? {
            latitude: { gte: mapEntries.minLat, lte: mapEntries.maxLat },
            longitude: { gte: mapEntries.minLng, lte: mapEntries.maxLng },
          }
        : {};

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

    const where = filters.length > 1 ? { and: filters } : filters[0];

    const boundsResult = hasBounds
      ? {
          minLat: mapEntries.minLat!,
          maxLat: mapEntries.maxLat!,
          minLng: mapEntries.minLng!,
          maxLng: mapEntries.maxLng!,
        }
      : undefined;

    return {
      ...(params satisfies Omit<typeof params, "filter" | "sort" | "q">),
      view,
      bounds: boundsResult,
      zoom: mapEntries.zoom,
      first: params.last || params.before ? undefined : (params.first ?? 32),
      where,
      order: params.sort?.split(",").map((entry) => {
        const [key, dir] = entry.split(":");
        return {
          [key]: dir === "DESC" ? SortEnumType.Desc : SortEnumType.Asc,
        };
      }),
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
