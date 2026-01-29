import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import api from "@/api/gql/server";
import { graphql } from "@/types/gql";
import { ViewOptions } from "@/types/constants";
import storage from "@/lib/storage";
import Toolbar from "@/components/composed/toolbar";
import CreateSpace from "./create-space";
import { TOOLBAR_PROPS } from "./constants";
import ListingsGrid from "./(grid)/listings-grid";
import ListingsTable from "./(table)/listings-table";
import ListingsMap from "./(map)/listings-map";

export default async function Page(props: PageProps<"/listings">) {
  const [{ data, error }, view] = await Promise.all([
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
    (await cookies()).get(storage.preferences.listings.view)
      ?.value as ViewOptions,
  ]);

  console.log(props);

  // const viewCookie = cookieStore.;
  // const view =
  //   viewCookie === ViewOptions.Table || viewCookie === ViewOptions.Map
  //     ? viewCookie
  //     : ViewOptions.Grid;

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
