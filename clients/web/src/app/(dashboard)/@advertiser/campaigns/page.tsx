import { cookies } from "next/headers";
import api from "@/lib/gql/server";
import { graphql, type CampaignFilterInput } from "@/types/gql";
import { ViewOptions } from "@/types/constants";
import storage from "@/lib/storage";
import Toolbar from "@/components/composed/toolbar";
import CreateCampaign from "./create-campaign";
import CampaignsGrid from "./(grid)/campaigns-grid";
import CampaignsTable from "./(table)/campaigns-table";
import {
  type FilterTabKey,
  getStatusFilter,
  getSortInput,
  TOOLBAR_PROPS,
} from "./constants";

const PAGE_SIZE = 20;

function combineFilters(
  ...filters: (CampaignFilterInput | undefined)[]
): CampaignFilterInput | undefined {
  const validFilters = filters.filter(Boolean) as CampaignFilterInput[];
  if (validFilters.length === 0) return undefined;
  if (validFilters.length === 1) return validFilters[0];
  return { and: validFilters };
}

export default async function Page(props: PageProps<"/campaigns">) {
  const searchParams = await props.searchParams;
  const tabKey = (searchParams.status as FilterTabKey) ?? "all";
  const searchText = searchParams.q as string | undefined;
  const sortField = searchParams.sort as string | undefined;
  const sortOrder = searchParams.order as string | undefined;
  const after = searchParams.after as string | undefined;

  const statusFilter = getStatusFilter(tabKey);
  const nameFilter = searchText
    ? { name: { contains: searchText } }
    : undefined;
  const order = getSortInput(sortField, sortOrder);
  const where = combineFilters(statusFilter, nameFilter);

  const [view, queryResult] = await Promise.all([
    cookies().then((cookieStore) => {
      const viewCookie = cookieStore.get(
        storage.preferences.campaigns.view
      )?.value;
      return viewCookie === ViewOptions.Table ? viewCookie : ViewOptions.Grid;
    }),
    api.query({
      query: graphql(`
        query AdvertiserCampaigns(
          $first: Int
          $after: String
          $where: CampaignFilterInput
          $order: [CampaignSortInput!]
        ) {
          myCampaigns(
            first: $first
            after: $after
            where: $where
            order: $order
          ) {
            nodes {
              id
              ...CampaignCard_CampaignFragment
              ...CampaignsTable_CampaignFragment
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
      variables: {
        first: PAGE_SIZE,
        after,
        where,
        order,
      },
    }),
  ]);

  const campaigns = queryResult.data?.myCampaigns?.nodes ?? [];
  const pageInfo = queryResult.data?.myCampaigns?.pageInfo;

  return (
    <div className="flex flex-col gap-6">
      <Toolbar
        {...TOOLBAR_PROPS}
        currentView={view}
        pageInfo={pageInfo}
        pageSize={PAGE_SIZE}
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
        <CampaignsTable data={campaigns} tabKey={tabKey} />
      )}
      {view === ViewOptions.Grid && (
        <CampaignsGrid data={campaigns} tabKey={tabKey} />
      )}
    </div>
  );
}
