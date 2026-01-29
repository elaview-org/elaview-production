import { cookies } from "next/headers";
import api from "@/api/gql/server";
import { graphql } from "@/types/gql";
import { ViewOptions } from "@/types/constants";
import storage from "@/lib/storage";
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
        storage.preferences.advertiserBookings.view
      )?.value;
      return viewCookie === ViewOptions.Table ? viewCookie : ViewOptions.Grid;
    }),
  ]);
  const tabKey = (status as FilterTabKey) ?? "all";

  const { data, error } = await api.query({
    query: graphql(`
      query AdvertiserBookings {
        myBookingsAsAdvertiser {
          nodes {
            id
            ...BookingCard_AdvertiserBookingFragment
            ...BookingsTable_AdvertiserBookingFragment
          }
        }
      }
    `),
  });

  if (error) {
    console.error("Bookings query error:", error);
  }

  const queryBookings = data?.myBookingsAsAdvertiser?.nodes ?? [];
  const bookings = queryBookings.length > 0 ? queryBookings : mockData;

  return (
    <div className="flex flex-col gap-6">
      <Toolbar
        {...TOOLBAR_PROPS}
        currentView={view}
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
