import { cookies } from "next/headers";
import api from "@/api/gql/server";
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
  const { view, ...variables } = await Promise.all([
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
        sort: z.string().optional().catch(undefined), // todo: :ASC | :DESC
        filter: z.string().optional().catch(undefined), // todo: validate values & fields
      })
      .parse(searchParams);

    return {
      ...(params satisfies Omit<typeof params, "filter" | "sort">),
      view,
      first: params.last || params.before ? undefined : (params.first ?? 32),
      where: params.filter
        ? Object.fromEntries(
            params.filter.split(",").map((entry) => {
              const [key, value] = entry.split(":");
              return [key, { eq: value }];
            })
          )
        : undefined,
      order: params.sort?.split(",").map((entry) => {
        const [key, dir] = entry.split(":");
        return {
          [key]: dir === "DESC" ? SortEnumType.Desc : SortEnumType.Asc,
        };
      }),
      gridView: view === ViewOptions.Grid,
      tableView: view === ViewOptions.Table,
    };
  });

  const spaces = await api
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
    .then((res) => res.data?.mySpaces?.nodes ?? [])
    .catch((err) => {
      throw err;
    });

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
      {view === ViewOptions.Table && <ListingsTable data={spaces} />}
      {view === ViewOptions.Map && <ListingsMap data={spaces} />}
      {view === ViewOptions.Grid && <ListingsGrid data={spaces} />}
    </div>
  );
}
