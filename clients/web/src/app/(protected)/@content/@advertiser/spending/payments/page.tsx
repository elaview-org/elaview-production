import api from "@/api/server";
import {
  graphql,
  type PaymentFilterInput,
  type PaymentSortInput,
  SortEnumType,
} from "@/types/gql";
import { ViewOptions } from "@/types/constants";
import Toolbar from "@/components/composed/toolbar";
import PaymentsHistoryTable from "./payments-table";
import DateRangeFilter from "../date-range-filter";
import CampaignFilter from "../campaign-filter";
import ExportButton from "./export-button";
import MaybePlaceholder from "@/components/status/maybe-placeholder";
import Placeholder from "./placeholder";
import { type FilterTabKey, getStatusFilter, TOOLBAR_PROPS } from "./constants";

const PAGE_SIZE = 20;

function getSortInput(
  sortField?: string,
  sortOrder?: string
): PaymentSortInput[] | undefined {
  if (!sortField) return [{ createdAt: SortEnumType.Desc }];

  const order = sortOrder === "asc" ? SortEnumType.Asc : SortEnumType.Desc;

  switch (sortField) {
    case "createdAt":
      return [{ createdAt: order }];
    case "amount":
      return [{ amount: order }];
    default:
      return [{ createdAt: SortEnumType.Desc }];
  }
}

function getDateFilter(
  dateFrom?: string,
  dateTo?: string
): PaymentFilterInput | undefined {
  if (!dateFrom || !dateTo) return undefined;

  return {
    createdAt: {
      gte: new Date(dateFrom).toISOString(),
      lte: new Date(dateTo).toISOString(),
    },
  };
}

function getCampaignFilter(campaign?: string): PaymentFilterInput | undefined {
  if (!campaign) return undefined;
  return { booking: { campaignId: { eq: campaign } } };
}

function combineFilters(
  ...filters: (PaymentFilterInput | undefined)[]
): PaymentFilterInput | undefined {
  const validFilters = filters.filter(Boolean) as PaymentFilterInput[];
  if (validFilters.length === 0) return undefined;
  if (validFilters.length === 1) return validFilters[0];
  return { and: validFilters };
}

export default async function Page(props: PageProps<"/spending/payments">) {
  const searchParams = await props.searchParams;
  const tabKey = (searchParams.status as FilterTabKey) ?? "all";
  const campaign = searchParams.campaign as string | undefined;
  const sortField = searchParams.sort as string | undefined;
  const sortOrder = searchParams.order as string | undefined;
  const after = searchParams.after as string | undefined;
  const dateFrom = searchParams.dateFrom as string | undefined;
  const dateTo = searchParams.dateTo as string | undefined;

  const statusFilter = getStatusFilter(tabKey);
  const campaignFilter = getCampaignFilter(campaign);
  const dateFilter = getDateFilter(dateFrom, dateTo);
  const order = getSortInput(sortField, sortOrder);
  const where = combineFilters(statusFilter, campaignFilter, dateFilter);

  const { payments, pageInfo, campaigns } = await api
    .query({
      query: graphql(`
        query AdvertiserPaymentsHistory(
          $first: Int
          $after: String
          $where: PaymentFilterInput
          $order: [PaymentSortInput!]
        ) {
          myPayments(
            first: $first
            after: $after
            where: $where
            order: $order
          ) {
            nodes {
              id
              ...PaymentsHistoryTable_PaymentFragment
            }
            pageInfo {
              hasNextPage
              hasPreviousPage
              startCursor
              endCursor
            }
          }
          allCampaigns: myCampaigns(
            where: { status: { in: [ACTIVE, SUBMITTED, COMPLETED] } }
          ) {
            nodes {
              id
              name
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
    })
    .then((res) => ({
      payments: res.data?.myPayments?.nodes ?? [],
      pageInfo: res.data?.myPayments?.pageInfo,
      campaigns: res.data?.allCampaigns?.nodes ?? [],
    }));

  return (
    <div className="flex flex-col gap-6">
      <Toolbar
        {...TOOLBAR_PROPS}
        currentView={ViewOptions.Table}
        pageInfo={pageInfo}
        pageSize={PAGE_SIZE}
        action={
          <div className="flex items-center gap-2">
            <DateRangeFilter />
            <CampaignFilter campaigns={campaigns} />
            <ExportButton
              payments={
                payments as unknown as Parameters<
                  typeof ExportButton
                >[0]["payments"]
              }
            />
          </div>
        }
      />
      <MaybePlaceholder
        data={payments}
        placeholder={<Placeholder tabKey={tabKey} />}
      >
        <PaymentsHistoryTable
          data={
            payments as unknown as Parameters<
              typeof PaymentsHistoryTable
            >[0]["data"]
          }
        />
      </MaybePlaceholder>
    </div>
  );
}
