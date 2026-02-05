"use client";

import { IconClock, IconCheck, IconAlertTriangle } from "@tabler/icons-react";
import { Button } from "@/components/primitives/button";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/primitives/avatar";
import { Badge } from "@/components/primitives/badge";
import { Skeleton } from "@/components/primitives/skeleton";
import { getInitials, cn } from "@/lib/utils";
import { FragmentType, getFragmentData, graphql } from "@/types/gql";
import Link from "next/link";
import { differenceInHours } from "date-fns";

export const AdvertiserOverviewDeadlineWarningsDeadlineCard_BookingFragment =
  graphql(`
    fragment AdvertiserOverviewDeadlineWarningsDeadlineCard_BookingFragment on Booking {
      id
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
      proof {
        submittedAt
      }
    }
  `);

type Props = {
  data: FragmentType<
    typeof AdvertiserOverviewDeadlineWarningsDeadlineCard_BookingFragment
  >;
};

export default function DeadlineCard({ data }: Props) {
  const booking = getFragmentData(
    AdvertiserOverviewDeadlineWarningsDeadlineCard_BookingFragment,
    data
  );

  const now = new Date();
  const submittedAt = booking.proof?.submittedAt
    ? new Date(booking.proof.submittedAt)
    : now;
  const hoursSinceSubmission = differenceInHours(now, submittedAt);
  const hoursRemaining = Math.max(0, 48 - hoursSinceSubmission);

  const getDeadlineBadge = () => {
    if (hoursRemaining < 12) {
      return {
        variant: "destructive" as const,
        label: `${hoursRemaining}h left`,
        urgent: true,
        className: "",
      };
    }
    if (hoursRemaining < 24) {
      return {
        variant: "secondary" as const,
        label: `${hoursRemaining}h left`,
        urgent: false,
        className:
          "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
      };
    }
    return {
      variant: "outline" as const,
      label: `${hoursRemaining}h left`,
      urgent: false,
      className: "",
    };
  };

  const badge = getDeadlineBadge();
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
            <span className="font-medium">{name}</span>
            <span className="text-muted-foreground text-sm">
              {booking.space?.title ?? ""}
            </span>
          </div>
        </div>
        <Badge
          variant={badge.variant}
          className={cn(
            "gap-1",
            badge.className,
            badge.urgent && "animate-pulse"
          )}
        >
          <IconClock className="size-3" />
          {badge.label}
        </Badge>
      </div>

      <div className="flex items-center text-sm">
        <span className="font-medium">{booking.campaign?.name}</span>
      </div>

      <div className="flex gap-2">
        <Button size="sm" className="flex-1 gap-1" asChild>
          <Link href={`/bookings/${booking.id}/review`}>
            <IconCheck className="size-4" />
            Approve
          </Link>
        </Button>
        <Button size="sm" variant="outline" className="flex-1 gap-1" asChild>
          <Link href={`/bookings/${booking.id}/dispute`}>
            <IconAlertTriangle className="size-4" />
            Dispute
          </Link>
        </Button>
      </div>
    </div>
  );
}

export function DeadlineCardSkeleton() {
  return (
    <div className="flex flex-col gap-3 rounded-lg border p-4">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <Skeleton className="size-10 rounded-full" />
          <div className="flex flex-col gap-1">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-3 w-24" />
          </div>
        </div>
        <Skeleton className="h-5 w-16 rounded-full" />
      </div>
      <Skeleton className="h-4 w-32" />
      <div className="flex gap-2">
        <Skeleton className="h-9 flex-1" />
        <Skeleton className="h-9 flex-1" />
      </div>
    </div>
  );
}
