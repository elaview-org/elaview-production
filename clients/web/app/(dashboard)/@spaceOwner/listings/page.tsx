import { redirect } from "next/navigation";
import api from "@/api/gql/server";
import { graphql } from "@/types/gql";
import { ViewOptions } from "@/types/constants";
import Toolbar from "@/components/composed/toolbar";
import CreateSpace from "./create-space";
import { TOOLBAR_PROPS } from "./constants";
import { getListingsView, setListingsView } from "./actions";
import ListingsGridView from "./(grid)/grid-view";
import ListingsTableView from "./(table)/table-view";
import ListingsMapView from "./(map)/map-view";

export default async function Page() {
  const [view, { data, error }] = await Promise.all([
    getListingsView(),
    api.query({
      query: graphql(`
        query SpaceOwnerListings {
          mySpaces {
            nodes {
              id
              ...SpaceCard_SpaceFragment
              ...TableView_SpaceFragment
            }
          }
        }
      `),
    }),
  ]);

  if (error) {
    redirect("/logout");
  }

  const spaces = data?.mySpaces?.nodes ?? [];

  return (
    <div className="flex flex-col gap-6">
      <Toolbar
        {...TOOLBAR_PROPS}
        currentView={view}
        onViewChangeAction={setListingsView}
        action={<CreateSpace />}
      />
      {view === ViewOptions.Table && <ListingsTableView data={spaces} />}
      {view === ViewOptions.Map && <ListingsMapView data={spaces} />}
      {view === ViewOptions.Grid && <ListingsGridView data={spaces} />}
    </div>
  );
}