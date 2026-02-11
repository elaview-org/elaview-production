import api from "@/lib/gql/server";
import {
  graphql,
  type PayoutFilterInput,
  type PayoutSortInput,
  SortEnumType,
} from "@/types/gql";
import { ViewOptions } from "@/types/constants";
import Toolbar from "@/components/composed/toolbar";
import PayoutsHistoryTable from "./payouts-table";
import DateRangeFilter from "../date-range-filter";
import ExportButton from "./export-button";
import MaybePlaceholder from "@/components/status/maybe-placeholder";
import Placeholder from "./placeholder";
import {
  type FilterTabKey,
  getStatusFilter,
  getStageFilter,
  TOOLBAR_PROPS,
} from "./constants";

const PAGE_SIZE = 20;

function getSortInput(
  sortField?: string,
  sortOrder?: string
): PayoutSortInput[] | undefined {
  if (!sortField) return [{ processedAt: SortEnumType.Desc }];

  const order = sortOrder === "asc" ? SortEnumType.Asc : SortEnumType.Desc;

  switch (sortField) {
    case "processedAt":
      return [{ processedAt: order }];
    case "amount":
      return [{ amount: order }];
    default:
      return [{ processedAt: SortEnumType.Desc }];
  }
}

function getDateFilter(
  dateFrom?: string,
  dateTo?: string
): PayoutFilterInput | undefined {
  if (!dateFrom || !dateTo) return undefined;

  return {
    processedAt: {
      gte: new Date(dateFrom).toISOString(),
      lte: new Date(dateTo).toISOString(),
    },
  };
}

function combineFilters(
  ...filters: (PayoutFilterInput | undefined)[]
): PayoutFilterInput | undefined {
  const validFilters = filters.filter(Boolean) as PayoutFilterInput[];
  if (validFilters.length === 0) return undefined;
  if (validFilters.length === 1) return validFilters[0];
  return { and: validFilters };
}

export default async function Page(props: PageProps<"/earnings/payouts">) {
  const searchParams = await props.searchParams;
  const tabKey = (searchParams.status as FilterTabKey) ?? "all";
  const stage = searchParams.stage as string | undefined;
  const sortField = searchParams.sort as string | undefined;
  const sortOrder = searchParams.order as string | undefined;
  const after = searchParams.after as string | undefined;
  const dateFrom = searchParams.dateFrom as string | undefined;
  const dateTo = searchParams.dateTo as string | undefined;

  const statusFilter = getStatusFilter(tabKey);
  const stageFilter = getStageFilter(stage);
  const dateFilter = getDateFilter(dateFrom, dateTo);
  const order = getSortInput(sortField, sortOrder);
  const where = combineFilters(statusFilter, stageFilter, dateFilter);

  const { payouts, pageInfo } = await api
    .query({
      query: graphql(`
        query SpaceOwnerPayoutsHistory(
          $first: Int
          $after: String
          $where: PayoutFilterInput
          $order: [PayoutSortInput!]
        ) {
          myPayouts(
            first: $first
            after: $after
            where: $where
            order: $order
          ) {
            nodes {
              id
              ...PayoutsHistoryTable_PayoutFragment
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
    })
    .then((res) => ({
      payouts: res.data?.myPayouts?.nodes ?? [],
      pageInfo: res.data?.myPayouts?.pageInfo,
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
            <ExportButton
              payouts={
                payouts as unknown as Parameters<
                  typeof ExportButton
                >[0]["payouts"]
              }
            />
          </div>
        }
      />
      <MaybePlaceholder
        data={payouts}
        placeholder={<Placeholder tabKey={tabKey} />}
      >
        <PayoutsHistoryTable
          data={
            payouts as unknown as Parameters<
              typeof PayoutsHistoryTable
            >[0]["data"]
          }
        />
      </MaybePlaceholder>
    </div>
  );
}
