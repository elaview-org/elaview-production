import { cookies } from "next/headers";
import api from "@/lib/gql/server";
import { graphql, SortEnumType } from "@/types/gql";
import { z } from "zod";
import { ViewOptions } from "@/types/constants";
import storage from "@/lib/storage";
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
        .filter(([key]) => !mapKeys.has(key))
        .map(([key, value]) => [key, { eq: value }])
    );

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

    const where =
      params.q || Object.keys(filterEntries).length > 0 || hasBounds
        ? {
            ...filterEntries,
            ...boundsFilter,
            ...(params.q && { title: { contains: params.q } }),
          }
        : undefined;

    const bounds = hasBounds
      ? {
          minLat: mapEntries.minLat!,
          maxLat: mapEntries.maxLat!,
          minLng: mapEntries.minLng!,
          maxLng: mapEntries.maxLng!,
        }
      : undefined;

    const zoom = mapEntries.zoom;

    return {
      ...(params satisfies Omit<typeof params, "filter" | "sort" | "q">),
      view,
      bounds,
      zoom,
      first: params.last || params.before ? undefined : (params.first ?? 32),
      where,
      order: params.sort?.split(",").map((entry) => {
        const [key, dir] = entry.split(":");
        return {
          [key]: dir === "DESC" ? SortEnumType.Desc : SortEnumType.Asc,
        };
      }),
      gridView: view === ViewOptions.Grid,
      tableView: view === ViewOptions.Table,
      mapView: view === ViewOptions.Map,
    };
  });

  const { spaces, pageInfo } = await api
    .query({
      query: graphql(`
        query SpaceOwnerListings(
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
          mySpaces(
            first: $first
            last: $last
            after: $after
            before: $before
            order: $order
            where: $where
          ) {
            nodes {
              id
              ...SpaceCard_SpaceFragment @include(if: $gridView)
              ...ListingsTable_SpaceFragment @include(if: $tableView)
              ...ListingsMap_SpaceFragment @include(if: $mapView)
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
      variables: variables,
    })
    .then((res) => ({
      spaces: res.data?.mySpaces?.nodes ?? [],
      pageInfo: res.data?.mySpaces?.pageInfo,
    }));

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
