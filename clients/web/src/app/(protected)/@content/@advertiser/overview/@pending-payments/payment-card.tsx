"use client";

import { IconCreditCard } from "@tabler/icons-react";
import { Button } from "@/components/primitives/button";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/primitives/avatar";
import { Skeleton } from "@/components/primitives/skeleton";
import { formatCurrency, formatDate, getInitials } from "@/lib/core/utils";
import { FragmentType, getFragmentData, graphql } from "@/types/gql";
import Link from "next/link";

export const AdvertiserOverviewPendingPaymentsPaymentCard_BookingFragment =
  graphql(`
    fragment AdvertiserOverviewPendingPaymentsPaymentCard_BookingFragment on Booking {
      id
      totalAmount
      startDate
      space {
        title
        owner {
          user {
            name
            avatar
          }
        }
      }
      campaign {
        name
      }
    }
  `);

type Props = {
  data: FragmentType<
    typeof AdvertiserOverviewPendingPaymentsPaymentCard_BookingFragment
  >;
};

export default function PaymentCard({ data }: Props) {
  const booking = getFragmentData(
    AdvertiserOverviewPendingPaymentsPaymentCard_BookingFragment,
    data
  );

  const name = booking.space?.owner?.user.name ?? "Unknown";
  const avatar = booking.space?.owner?.user.avatar ?? null;

  return (
    <div className="flex flex-col gap-3 rounded-lg border p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <Avatar className="size-10">
            <AvatarImage src={avatar ?? undefined} />
            <AvatarFallback className="bg-primary/10 text-primary text-sm">
              {getInitials(name)}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="font-medium">
              {booking.space?.title ?? "Unknown Space"}
            </span>
            <span className="text-muted-foreground text-sm">{name}</span>
          </div>
        </div>
        <span className="font-semibold tabular-nums">
          {formatCurrency(booking.totalAmount)}
        </span>
      </div>

      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">
          Starts {formatDate(booking.startDate)}
        </span>
        <span className="font-medium">{booking.campaign?.name}</span>
      </div>

      <Button size="sm" className="gap-1" asChild>
        <Link href={`/bookings/${booking.id}/pay`}>
          <IconCreditCard className="size-4" />
          Pay Now
        </Link>
      </Button>
    </div>
  );
}

export function PaymentCardSkeleton() {
  return (
    <div className="flex flex-col gap-3 rounded-lg border p-4">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <Skeleton className="size-10 rounded-full" />
          <div className="flex flex-col gap-1">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-3 w-20" />
          </div>
        </div>
        <Skeleton className="h-5 w-16" />
      </div>
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-20" />
      </div>
      <Skeleton className="h-9 w-full" />
    </div>
  );
}
