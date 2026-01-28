import { cookies } from "next/headers";
import api from "@/api/gql/server";
import { graphql } from "@/types/gql";
import { ViewOptions } from "@/types/constants";
import storageKey from "@/lib/storage-keys";
import Toolbar from "@/components/composed/toolbar";
import BookingsGrid from "./(grid)/bookings-grid";
import BookingsTable from "./(table)/bookings-table";
import { type FilterTabKey, TOOLBAR_PROPS } from "./constants";
import mockData from "./mock.json";

export default async function Page(props: PageProps<"/bookings">) {
  const [{ status }, view] = await Promise.all([
    props.searchParams,
    cookies().then((cookieStore) => {
      const viewCookie = cookieStore.get(
        storageKey.preferences.bookings.view
      )?.value;
      return viewCookie === ViewOptions.Table ? viewCookie : ViewOptions.Grid;
    }),
  ]);
  const tabKey = (status as FilterTabKey) ?? "all";

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
            ...BookingCard_BookingFragment
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
      <Toolbar
        {...TOOLBAR_PROPS}
        currentView={view}
        onViewChangeAction={async (view: ViewOptions) => {
          "use server";
          (await cookies()).set(storageKey.preferences.bookings.view, view, {
            path: "/",
            maxAge: 60 * 60 * 24 * 365,
            sameSite: "lax",
          });
        }}
      />
      {view === ViewOptions.Table && (
        <BookingsTable
          data={bookings as Parameters<typeof BookingsTable>[0]["data"]}
          tabKey={tabKey}
        />
      )}
      {view === ViewOptions.Grid && (
        <BookingsGrid
          data={bookings as Parameters<typeof BookingsGrid>[0]["data"]}
          tabKey={tabKey}
        />
      )}
    </div>
  );
}
