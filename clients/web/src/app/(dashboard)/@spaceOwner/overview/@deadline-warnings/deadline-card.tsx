"use client";

import { IconClock, IconDownload, IconCamera } from "@tabler/icons-react";
import { Button } from "@/components/primitives/button";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/primitives/avatar";
import { Badge } from "@/components/primitives/badge";
import { Skeleton } from "@/components/primitives/skeleton";
import { formatDateRange, getInitials, cn } from "@/lib/utils";
import {
  FragmentType,
  getFragmentData,
  graphql,
  BookingStatus,
} from "@/types/gql";
import Link from "next/link";
import { differenceInHours, differenceInDays } from "date-fns";

export const OverviewDeadlineWarningsDeadlineCard_BookingFragment = graphql(`
  fragment OverviewDeadlineWarningsDeadlineCard_BookingFragment on Booking {
    id
    status
    startDate
    endDate
    space {
      title
    }
    campaign {
      name
      advertiser {
        user {
          name
          avatar
        }
      }
    }
  }
`);

type Props = {
  data: FragmentType<
    typeof OverviewDeadlineWarningsDeadlineCard_BookingFragment
  >;
};

export default function DeadlineCard({ data }: Props) {
  const booking = getFragmentData(
    OverviewDeadlineWarningsDeadlineCard_BookingFragment,
    data
  );

  const now = new Date();
  const endDate = new Date(booking.endDate);
  const hoursUntilDeadline = differenceInHours(endDate, now);
  const daysUntilDeadline = differenceInDays(endDate, now);

  const getDeadlineBadge = () => {
    if (hoursUntilDeadline < 24) {
      return {
        variant: "destructive" as const,
        label: "< 24h",
        urgent: true,
        className: "",
      };
    }
    if (hoursUntilDeadline < 48) {
      return {
        variant: "secondary" as const,
        label: "< 48h",
        urgent: false,
        className:
          "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
      };
    }
    return {
      variant: "outline" as const,
      label: `${daysUntilDeadline}d`,
      urgent: false,
      className: "",
    };
  };

  const badge = getDeadlineBadge();
  const name = booking.campaign?.advertiser?.user.name ?? "Unknown";
  const avatar = booking.campaign?.advertiser?.user.avatar ?? null;

  const getActionConfig = () => {
    if (booking.status === BookingStatus.FileDownloaded) {
      return {
        icon: IconCamera,
        label: "Upload Verification",
        href: `/bookings/${booking.id}/verify`,
      };
    }
    return {
      icon: IconDownload,
      label: "Download File",
      href: `/bookings/${booking.id}`,
    };
  };

  const action = getActionConfig();

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

      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">
          {formatDateRange(booking.startDate, booking.endDate)}
        </span>
        <span className="font-medium">{booking.campaign?.name}</span>
      </div>

      <Button size="sm" className="gap-1" asChild>
        <Link href={action.href}>
          <action.icon className="size-4" />
          {action.label}
        </Link>
      </Button>
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
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-4 w-20" />
      </div>
      <Skeleton className="h-9 w-full" />
    </div>
  );
}
