import { cookies } from "next/headers";
import api from "@/lib/gql/server";
import { graphql } from "@/types/gql";
import { ViewOptions } from "@/types/constants";
import storage from "@/lib/storage";
import Toolbar from "@/components/composed/toolbar";
import CreateCampaign from "./create-campaign";
import CampaignsGrid from "./(grid)/campaigns-grid";
import CampaignsTable from "./(table)/campaigns-table";
import { type FilterTabKey, TOOLBAR_PROPS } from "./constants";
import mockData from "./mock.json";

export default async function Page(props: PageProps<"/campaigns">) {
  const [{ status }, view] = await Promise.all([
    props.searchParams,
    cookies().then((cookieStore) => {
      const viewCookie = cookieStore.get(
        storage.preferences.campaigns.view
      )?.value;
      return viewCookie === ViewOptions.Table ? viewCookie : ViewOptions.Grid;
    }),
  ]);
  const tabKey = (status as FilterTabKey) ?? "all";

  const { data, error } = await api.query({
    query: graphql(`
      query AdvertiserCampaigns {
        myCampaigns {
          nodes {
            id
            ...CampaignCard_CampaignFragment
            ...CampaignsTable_CampaignFragment
          }
        }
      }
    `),
  });

  if (error) {
    console.error("Campaigns query error:", error);
  }

  const queryCampaigns = data?.myCampaigns?.nodes ?? [];
  const campaigns = queryCampaigns.length > 0 ? queryCampaigns : mockData;

  return (
    <div className="flex flex-col gap-6">
      <Toolbar
        {...TOOLBAR_PROPS}
        currentView={view}
        onViewChangeAction={async (view: ViewOptions) => {
          "use server";
          (await cookies()).set(storage.preferences.campaigns.view, view, {
            path: "/",
            maxAge: 60 * 60 * 24 * 365,
            sameSite: "lax",
          });
        }}
        action={<CreateCampaign />}
      />
      {view === ViewOptions.Table && (
        <CampaignsTable
          data={campaigns as Parameters<typeof CampaignsTable>[0]["data"]}
          tabKey={tabKey}
        />
      )}
      {view === ViewOptions.Grid && (
        <CampaignsGrid
          data={campaigns as Parameters<typeof CampaignsGrid>[0]["data"]}
          tabKey={tabKey}
        />
      )}
    </div>
  );
}
