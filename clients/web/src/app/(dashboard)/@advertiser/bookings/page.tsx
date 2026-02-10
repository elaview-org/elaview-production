import { cookies } from "next/headers";
import api from "@/lib/gql/server";
import {
  graphql,
  type BookingFilterInput,
  type BookingSortInput,
  SortEnumType,
} from "@/types/gql";
import { ViewOptions } from "@/types/constants";
import storage from "@/lib/core/storage";
import Toolbar from "@/components/composed/toolbar";
import BookingsGrid from "./(grid)/bookings-grid";
import BookingsTable from "./(table)/bookings-table";
import DateRangeFilter from "./date-range-filter";
import { type FilterTabKey, getStatusFilter, TOOLBAR_PROPS } from "./constants";

const PAGE_SIZE = 20;

function getSortInput(
  sortField?: string,
  sortOrder?: string
): BookingSortInput[] | undefined {
  if (!sortField) return [{ startDate: SortEnumType.Desc }];

  const order = sortOrder === "asc" ? SortEnumType.Asc : SortEnumType.Desc;

  switch (sortField) {
    case "startDate":
      return [{ startDate: order }];
    case "endDate":
      return [{ endDate: order }];
    case "createdAt":
      return [{ createdAt: order }];
    case "totalAmount":
      return [{ totalAmount: order }];
    default:
      return [{ startDate: SortEnumType.Desc }];
  }
}

function getDateFilter(
  dateFrom?: string,
  dateTo?: string
): BookingFilterInput | undefined {
  if (!dateFrom || !dateTo) return undefined;

  return {
    startDate: { gte: new Date(dateFrom).toISOString() },
    endDate: { lte: new Date(dateTo).toISOString() },
  };
}

function combineFilters(
  ...filters: (BookingFilterInput | undefined)[]
): BookingFilterInput | undefined {
  const validFilters = filters.filter(Boolean) as BookingFilterInput[];
  if (validFilters.length === 0) return undefined;
  if (validFilters.length === 1) return validFilters[0];
  return { and: validFilters };
}

export default async function Page(props: PageProps<"/bookings">) {
  const searchParams = await props.searchParams;
  const tabKey = (searchParams.status as FilterTabKey) ?? "all";
  const searchText = searchParams.q as string | undefined;
  const sortField = searchParams.sort as string | undefined;
  const sortOrder = searchParams.order as string | undefined;
  const after = searchParams.after as string | undefined;
  const dateFrom = searchParams.dateFrom as string | undefined;
  const dateTo = searchParams.dateTo as string | undefined;

  const statusFilter = getStatusFilter(tabKey);
  const dateFilter = getDateFilter(dateFrom, dateTo);
  const order = getSortInput(sortField, sortOrder);
  const where = combineFilters(statusFilter, dateFilter);

  const [view, queryResult] = await Promise.all([
    cookies().then((cookieStore) => {
      const viewCookie = cookieStore.get(
        storage.preferences.advertiserBookings.view
      )?.value;
      return viewCookie === ViewOptions.Table ? viewCookie : ViewOptions.Grid;
    }),
    api.query({
      query: graphql(`
        query AdvertiserBookings(
          $first: Int
          $after: String
          $where: BookingFilterInput
          $order: [BookingSortInput!]
          $searchText: String
        ) {
          myBookingsAsAdvertiser(
            first: $first
            after: $after
            where: $where
            order: $order
            searchText: $searchText
          ) {
            nodes {
              id
              ...BookingCard_AdvertiserBookingFragment
              ...BookingsTable_AdvertiserBookingFragment
            }
            pageInfo {
              hasNextPage
              hasPreviousPage
              startCursor
              endCursor
            }
            totalCount
          }
        }
      `),
      variables: {
        first: PAGE_SIZE,
        after,
        where,
        order,
        searchText: searchText || null,
      },
    }),
  ]);

  const bookings = queryResult.data?.myBookingsAsAdvertiser?.nodes ?? [];
  const pageInfo = queryResult.data?.myBookingsAsAdvertiser?.pageInfo;

  return (
    <div className="flex flex-col gap-6">
      <Toolbar
        {...TOOLBAR_PROPS}
        currentView={view}
        pageInfo={pageInfo}
        pageSize={PAGE_SIZE}
        onViewChangeAction={async (view: ViewOptions) => {
          "use server";
          (await cookies()).set(
            storage.preferences.advertiserBookings.view,
            view,
            {
              path: "/",
              maxAge: 60 * 60 * 24 * 365,
              sameSite: "lax",
            }
          );
        }}
        action={<DateRangeFilter />}
      />
      {view === ViewOptions.Table && (
        <BookingsTable data={bookings} tabKey={tabKey} />
      )}
      {view === ViewOptions.Grid && (
        <BookingsGrid data={bookings} tabKey={tabKey} />
      )}
    </div>
  );
}
