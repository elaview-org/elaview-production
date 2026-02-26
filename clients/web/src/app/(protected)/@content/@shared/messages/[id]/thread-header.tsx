"use client";

import { useState } from "react";
import {
  ExternalLinkIcon,
  ChevronLeftIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  CalendarIcon,
  MapPinIcon,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/primitives/button";
import { Badge } from "@/components/primitives/badge";
import { Separator } from "@/components/primitives/separator";
import { BOOKING_STATUS } from "@/lib/core/constants";
import { formatCurrency, formatDate } from "@/lib/core/utils";
import { graphql, getFragmentData, type FragmentType } from "@/types/gql";

export const ThreadHeader_ConversationFragment = graphql(`
  fragment ThreadHeader_ConversationFragment on Conversation {
    id
    booking {
      id
      status
      startDate
      endDate
      totalAmount
      pricePerDay
      totalDays
      installationFee
      space {
        id
        title
        images
        address
        city
        state
      }
    }
  }
`);

type Props = {
  data: FragmentType<typeof ThreadHeader_ConversationFragment>;
  showBackButton?: boolean;
};

export default function ThreadHeader({ data, showBackButton = false }: Props) {
  const [isExpanded, setIsExpanded] = useState(false);
  const conversation = getFragmentData(ThreadHeader_ConversationFragment, data);

  const booking = conversation.booking;
  const spaceName = booking?.space?.title ?? "Unknown Space";
  const bookingId = booking?.id;
  const spaceId = booking?.space?.id;
  const bookingStatus = booking?.status;
  const spaceImage = booking?.space?.images?.[0];
  const spaceLocation = booking?.space
    ? `${booking.space.address}, ${booking.space.city}, ${booking.space.state}`
    : null;

  return (
    <div className="bg-background/95 supports-backdrop-filter:bg-background/80 sticky top-0 z-10 border-b backdrop-blur">
      <div className="flex items-center justify-between gap-4 px-4 py-3">
        <div className="flex min-w-0 flex-1 items-center gap-3">
          {showBackButton && (
            <Button variant="ghost" size="icon-sm" asChild className="shrink-0">
              <Link href="/messages" aria-label="Back to conversations">
                <ChevronLeftIcon className="size-4" />
              </Link>
            </Button>
          )}

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h2 className="truncate text-sm font-semibold">{spaceName}</h2>
              {bookingStatus && (
                <Badge variant={BOOKING_STATUS.variants[bookingStatus]}>
                  {BOOKING_STATUS.labels[bookingStatus]}
                </Badge>
              )}
            </div>
            {bookingId && (
              <p className="text-muted-foreground truncate text-xs">
                Booking #{bookingId.split("-")[0]}
              </p>
            )}
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          {booking && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="h-8 gap-1 text-xs"
            >
              {isExpanded ? "Hide" : "Details"}
              {isExpanded ? (
                <ChevronUpIcon className="size-3" />
              ) : (
                <ChevronDownIcon className="size-3" />
              )}
            </Button>
          )}
          {bookingId && (
            <Button variant="outline" size="sm" asChild className="h-8 text-xs">
              <Link href={`/bookings/${bookingId}`}>
                View Booking
                <ExternalLinkIcon className="ml-1 size-3" />
              </Link>
            </Button>
          )}
        </div>
      </div>

      {isExpanded && booking && (
        <>
          <Separator />
          <div className="px-4 py-3">
            <div className="flex gap-4">
              {spaceImage && (
                <div className="relative size-20 shrink-0 overflow-hidden rounded-lg">
                  <Image
                    src={spaceImage}
                    alt={spaceName}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <div className="min-w-0 flex-1 space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="text-sm font-medium">{spaceName}</h3>
                    {spaceLocation && (
                      <p className="text-muted-foreground flex items-center gap-1 text-xs">
                        <MapPinIcon className="size-3" />
                        <span className="truncate">{spaceLocation}</span>
                      </p>
                    )}
                  </div>
                  {spaceId && (
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      asChild
                      className="shrink-0"
                    >
                      <Link href={`/space/${spaceId}`}>
                        <ExternalLinkIcon className="size-3" />
                      </Link>
                    </Button>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
                  {booking.startDate && booking.endDate && (
                    <div className="flex items-center gap-1">
                      <CalendarIcon className="text-muted-foreground size-3" />
                      <span>
                        {formatDate(booking.startDate)} -{" "}
                        {formatDate(booking.endDate)}
                      </span>
                    </div>
                  )}
                  {booking.totalDays && (
                    <div className="text-muted-foreground">
                      {booking.totalDays} day
                      {booking.totalDays !== 1 ? "s" : ""}
                    </div>
                  )}
                </div>

                <div className="bg-muted/50 flex items-center justify-between rounded-md px-3 py-2">
                  <div className="space-y-0.5">
                    <p className="text-muted-foreground text-[10px] tracking-wider uppercase">
                      Total Amount
                    </p>
                    <p className="text-sm font-semibold">
                      {formatCurrency(booking.totalAmount)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-muted-foreground text-[10px]">
                      {formatCurrency(booking.pricePerDay)}/day
                      {booking.installationFee &&
                        ` + ${formatCurrency(booking.installationFee)} install`}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
