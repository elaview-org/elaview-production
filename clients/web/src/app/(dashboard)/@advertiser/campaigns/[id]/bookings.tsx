import api from "@/lib/gql/server";
import { BOOKING_STATUS } from "@/lib/core/constants";
import { formatCurrency, formatDate } from "@/lib/core/utils";
import { Badge } from "@/components/primitives/badge";
import { graphql } from "@/types/gql";
import Link from "next/link";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/primitives/empty";
import { IconCalendarOff } from "@tabler/icons-react";

type Props = {
  campaignId: string;
};

export default async function Bookings({ campaignId }: Props) {
  const bookings = await api
    .query({
      query: graphql(`
        query CampaignBookings($id: ID!, $first: Int) {
          campaignById(id: $id) {
            bookings(first: $first) {
              nodes {
                id
                status
                startDate
                endDate
                totalAmount
                space {
                  title
                }
              }
            }
          }
        }
      `),
      variables: { id: campaignId, first: 10 },
    })
    .then((res) => res.data?.campaignById?.bookings?.nodes ?? []);

  if (bookings.length === 0) {
    return (
      <div className="rounded-lg border">
        <div className="border-b px-4 py-3">
          <h2 className="font-medium">Associated Bookings</h2>
        </div>
        <Empty className="border-0 py-8">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <IconCalendarOff />
            </EmptyMedia>
            <EmptyTitle>No bookings yet</EmptyTitle>
            <EmptyDescription>
              Bookings for this campaign will appear here once spaces are
              booked.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      </div>
    );
  }

  return (
    <div className="rounded-lg border">
      <div className="border-b px-4 py-3">
        <h2 className="font-medium">Associated Bookings</h2>
      </div>
      <div className="divide-y">
        {bookings.map((booking) => (
          <Link
            key={booking.id}
            href={`/bookings/${booking.id}`}
            className="hover:bg-muted/50 flex items-center justify-between gap-4 px-4 py-3 transition-colors"
          >
            <div className="min-w-0 flex-1">
              <p className="truncate font-medium">
                {booking.space?.title ?? "Unknown Space"}
              </p>
              <p className="text-muted-foreground text-xs">
                {formatDate(booking.startDate)} – {formatDate(booking.endDate)}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm">{formatCurrency(booking.totalAmount)}</p>
            </div>
            <Badge variant={BOOKING_STATUS.variants[booking.status]}>
              {BOOKING_STATUS.labels[booking.status]}
            </Badge>
          </Link>
        ))}
      </div>
    </div>
  );
}

export function BookingsSkeleton() {
  return (
    <div className="rounded-lg border">
      <div className="border-b px-4 py-3">
        <div className="bg-muted h-5 w-32 animate-pulse rounded" />
      </div>
      <div className="divide-y">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="flex items-center justify-between gap-4 px-4 py-3"
          >
            <div className="flex-1 space-y-2">
              <div className="bg-muted h-4 w-40 animate-pulse rounded" />
              <div className="bg-muted h-3 w-28 animate-pulse rounded" />
            </div>
            <div className="bg-muted h-4 w-16 animate-pulse rounded" />
            <div className="bg-muted h-5 w-16 animate-pulse rounded-full" />
          </div>
        ))}
      </div>
    </div>
  );
}
