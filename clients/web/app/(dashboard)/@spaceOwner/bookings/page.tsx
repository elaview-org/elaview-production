import api from "@/api/gql/server";
import { Button } from "@/components/primitives/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/primitives/empty";
import { graphql } from "@/types/gql";
import { IconCalendar } from "@tabler/icons-react";
import Link from "next/link";
import BookingsTable from "./bookings-table";
import { type FilterTabKey, getStatusFilter } from "./constants";
import Toolbar from "./toolbar";
import mockData from "./mock-data.json";

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
      <Toolbar />
      {bookings.length === 0 ? (
        <Empty className="border py-16">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <IconCalendar />
            </EmptyMedia>
            <EmptyTitle>No bookings yet</EmptyTitle>
            <EmptyDescription>
              {tabKey === "incoming"
                ? "No pending booking requests at the moment"
                : tabKey === "active"
                  ? "No active bookings right now"
                  : tabKey === "completed"
                    ? "No completed bookings yet"
                    : "Bookings will appear here once advertisers book your spaces"}
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button variant="outline" asChild>
              <Link href="/listings">View Your Listings</Link>
            </Button>
          </EmptyContent>
        </Empty>
      ) : (
        <BookingsTable data={bookings as Parameters<typeof BookingsTable>[0]["data"]} />
      )}
    </div>
  );
}
