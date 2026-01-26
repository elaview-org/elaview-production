import api from "@/api/gql/server";
import { graphql } from "@/types/gql";
import BookingsTable from "./bookings-table";
import { type FilterTabKey, getStatusFilter, TOOLBAR_PROPS } from "./constants";
import Toolbar from "@/components/composed/toolbar";
import mockData from "./mock.json";
import MaybePlaceholder from "@/components/status/maybe-placeholder";
import Placeholder from "@/app/(dashboard)/@spaceOwner/bookings/placeholder";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  const tabKey = (status as FilterTabKey) ?? "all";
  const filter = getStatusFilter(tabKey);

  const { data, error } = await api.query({
    // query: graphql(`
    //   query SpaceOwnerBookings($where: BookingFilterInput) {
    //     myBookingsAsOwner(where: $where) {
    //       nodes {
    //         id
    //         ...BookingsTable_BookingFragment
    //       }
    //     }
    //   }
    // `),
    // variables: { where: filter },
    query: graphql(`
      query SpaceOwnerBookings {
        myBookingsAsOwner {
          nodes {
            id
            ...BookingsTable_BookingFragment
          }
        }
      }
    `),
  });

  if (error) {
    console.error("Bookings query error:", error);
  }

  const queryBookings = data?.myBookingsAsOwner?.nodes ?? [];
  const bookings = queryBookings.length > 0 ? queryBookings : mockData;

  return (
    <div className="flex flex-col gap-6">
      <Toolbar {...TOOLBAR_PROPS} />
      <MaybePlaceholder
        data={bookings as Parameters<typeof BookingsTable>[0]["data"]}
        placeholder={<Placeholder tabKey={tabKey} />}
      >
        <BookingsTable
          data={bookings as Parameters<typeof BookingsTable>[0]["data"]}
        />
      </MaybePlaceholder>
    </div>
  );
}
