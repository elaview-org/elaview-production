import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import api from "@/api/gql/server";
import { graphql } from "@/types/gql";
import { ViewOptions } from "@/types/constants";
import storage from "@/lib/storage";
import Toolbar from "@/components/composed/toolbar";
import { TOOLBAR_PROPS } from "./constants";
import DiscoverGrid from "./(grid)/discover-grid";
import DiscoverTable from "./(table)/discover-table";
import DiscoverMap from "./(map)/discover-map";

export default async function Page() {
  const [cookieStore, { data, error }] = await Promise.all([
    cookies(),
    api.query({
      query: graphql(`
        query DiscoverSpaces {
          spaces(first: 32, where: { status: { eq: ACTIVE } }) {
            nodes {
              id
              ...DiscoverSpaceCard_SpaceFragment
              ...DiscoverTable_SpaceFragment
              ...DiscoverMap_SpaceFragment
            }
          }
        }
      `),
    }),
  ]);

  const viewCookie = cookieStore.get(storage.preferences.discover.view)?.value;
  const view =
    viewCookie === ViewOptions.Table || viewCookie === ViewOptions.Map
      ? viewCookie
      : ViewOptions.Grid;

  if (error) {
    redirect("/logout");
  }

  const spaces = data?.spaces?.nodes ?? [];

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
      {view === ViewOptions.Table && <DiscoverTable data={spaces} />}
      {view === ViewOptions.Map && <DiscoverMap data={spaces} />}
      {view === ViewOptions.Grid && <DiscoverGrid data={spaces} />}
    </div>
  );
}
