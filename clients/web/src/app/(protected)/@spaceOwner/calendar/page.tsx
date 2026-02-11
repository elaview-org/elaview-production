import api from "@/lib/gql/server";
import { graphql } from "@/types/gql";
import { cookies } from "next/headers";
import CalendarWrapper from "./calendar-wrapper";
import MaybePlaceholder from "@/components/status/maybe-placeholder";
import Placeholder from "./placeholder";
import type {
  CalendarSpace,
  CalendarBooking,
  CalendarBlockedDate,
} from "./types";

export default async function Page() {
  await cookies();

  const now = new Date();
  const windowStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const windowEnd = new Date(now.getFullYear(), now.getMonth() + 2, 0);

  const startDate = windowStart.toISOString();
  const endDate = windowEnd.toISOString();

  const [spacesResult, bookingsResult] = await Promise.all([
    api
      .query({
        query: graphql(`
          query CalendarSpaces {
            mySpaces(first: 50, where: { status: { eq: ACTIVE } }) {
              nodes {
                id
                title
                blockedDates {
                  id
                  date
                  reason
                }
              }
            }
          }
        `),
      })
      .then((res) => res.data?.mySpaces?.nodes ?? []),

    api
      .query({
        query: graphql(`
          query CalendarBookings($startDate: DateTime!, $endDate: DateTime!) {
            myBookingsAsOwner(
              first: 50
              where: {
                startDate: { lte: $endDate }
                endDate: { gte: $startDate }
                status: { nin: [REJECTED, CANCELLED] }
              }
            ) {
              nodes {
                id
                spaceId
                status
                startDate
                endDate
                totalAmount
                campaign {
                  name
                  advertiserProfile {
                    companyName
                  }
                }
              }
            }
          }
        `),
        variables: { startDate, endDate },
      })
      .then((res) => res.data?.myBookingsAsOwner?.nodes ?? []),
  ]);

  const blockedWindowStart = windowStart.toISOString().split("T")[0];
  const blockedWindowEnd = windowEnd.toISOString().split("T")[0];

  const spaceIds = new Set(spacesResult.map((s) => s.id));

  const spaces: CalendarSpace[] = spacesResult.map((space, i) => ({
    id: space.id,
    title: space.title,
    colorIndex: i,
  }));

  const bookings: CalendarBooking[] = bookingsResult
    .filter((b) => spaceIds.has(b.spaceId))
    .map((b) => ({
      id: b.id,
      spaceId: b.spaceId,
      status: b.status,
      startDate: b.startDate.split("T")[0],
      endDate: b.endDate.split("T")[0],
      advertiserName: b.campaign?.advertiserProfile?.companyName ?? "Unknown",
      campaignName: b.campaign?.name ?? "Untitled",
      totalAmount: b.totalAmount,
    }));

  const blockedDates: CalendarBlockedDate[] = spacesResult.flatMap((space) =>
    space.blockedDates
      .filter((bd) => {
        const d = String(bd.date);
        return d >= blockedWindowStart && d <= blockedWindowEnd;
      })
      .map((bd) => ({
        spaceId: space.id,
        date: String(bd.date),
        reason: bd.reason,
      }))
  );

  return (
    <MaybePlaceholder data={spaces} placeholder={<Placeholder />}>
      <CalendarWrapper
        spaces={spaces}
        initialBookings={bookings}
        initialBlockedDates={blockedDates}
      />
    </MaybePlaceholder>
  );
}
