import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import api from "@/api/gql/server";
import { graphql } from "@/types/gql";
import { ViewOptions } from "@/types/constants";
import storageKey from "@/lib/storage-keys";
import Toolbar from "@/components/composed/toolbar";
import CreateSpace from "./create-space";
import { TOOLBAR_PROPS } from "./constants";
import ListingsGrid from "./(grid)/listings-grid";
import ListingsTable from "./(table)/listings-table";
import ListingsMap from "./(map)/listings-map";

export default async function Page() {
  const [cookieStore, { data, error }] = await Promise.all([
    cookies(),
    api.query({
      query: graphql(`
        query SpaceOwnerListings {
          mySpaces {
            nodes {
              id
              ...SpaceCard_SpaceFragment
              ...ListingsTable_SpaceFragment
            }
          }
        }
      `),
    }),
  ]);

  const viewCookie = cookieStore.get(
    storageKey.preferences.listings.view
  )?.value;
  const view =
    viewCookie === ViewOptions.Table || viewCookie === ViewOptions.Map
      ? viewCookie
      : ViewOptions.Grid;

  if (error) {
    redirect("/logout");
  }

  const spaces = data?.mySpaces?.nodes ?? [];

  return (
    <div className="flex flex-col gap-6">
      <Toolbar
        {...TOOLBAR_PROPS}
        currentView={view}
        onViewChangeAction={async (view: ViewOptions) => {
          "use server";
          (await cookies()).set(storageKey.preferences.listings.view, view, {
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
