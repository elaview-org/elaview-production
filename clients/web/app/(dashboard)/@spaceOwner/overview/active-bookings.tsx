"use client";

import Link from "next/link";
import { Badge } from "@/components/primitives/badge";
import ProgressSteps, { ProgressStepsSkeleton } from "@/components/composed/progress-steps";
import SectionCard, { SectionCardSkeleton } from "@/components/composed/section-card";
import { Skeleton } from "@/components/primitives/skeleton";
import { cn, formatDateRange } from "@/lib/utils";
import {
  BOOKING_STATUS_CONFIG,
  NEXT_ACTION_CONFIG,
  type ActiveBookingStatus,
  type NextAction,
} from "./constants";
import mock from "./mock.json";

type ActiveBooking = {
  id: string;
  status: ActiveBookingStatus;
  advertiserName: string;
  spaceName: string;
  spaceId: string;
  startDate: string;
  endDate: string;
  nextAction: NextAction;
  daysRemaining: number;
};

const BOOKING_STEPS = ["Paid", "Downloaded", "Installed", "Verified"];

function BookingCard({ booking }: { booking: ActiveBooking }) {
  const statusConfig = BOOKING_STATUS_CONFIG[booking.status];
  const actionConfig = NEXT_ACTION_CONFIG[booking.nextAction];
  const ActionIcon = actionConfig.icon;

  return (
    <Link
      href={`/bookings/${booking.id}`}
      className="flex flex-col gap-3 rounded-lg border p-4 transition-colors hover:bg-muted/50"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex flex-col gap-0.5">
          <span className="font-medium">{booking.spaceName}</span>
          <span className="text-muted-foreground text-sm">
            {booking.advertiserName}
          </span>
        </div>
        {booking.daysRemaining <= 2 && (
          <Badge variant="destructive" className="shrink-0">
            {booking.daysRemaining === 0 ? "Due today" : `${booking.daysRemaining}d left`}
          </Badge>
        )}
      </div>

      <ProgressSteps steps={BOOKING_STEPS} currentStep={statusConfig.step} />

      <div className="flex items-center justify-between">
        <span className="text-muted-foreground text-xs">
          {formatDateRange(booking.startDate, booking.endDate)}
        </span>
        <div
          className={cn(
            "flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium",
            actionConfig.bgColor,
            actionConfig.color
          )}
        >
          <ActionIcon className="size-3" />
          {booking.nextAction}
        </div>
      </div>
    </Link>
  );
}

export default function ActiveBookings() {
  const bookings = mock.activeBookings as ActiveBooking[];

  if (bookings.length === 0) {
    return null;
  }

  return (
    <SectionCard
      title="Active Bookings"
      description="Bookings in progress"
      count={bookings.length}
      viewAllHref="/bookings?tab=active"
    >
      <div className="flex flex-col gap-3">
        {bookings.slice(0, 4).map((booking) => (
          <BookingCard key={booking.id} booking={booking} />
        ))}
      </div>
    </SectionCard>
  );
}

export function ActiveBookingsSkeleton() {
  return (
    <SectionCardSkeleton>
      <div className="flex flex-col gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex flex-col gap-3 rounded-lg border p-4">
            <div className="flex items-start justify-between">
              <div className="flex flex-col gap-1">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-24" />
              </div>
              <Skeleton className="h-5 w-16 rounded-full" />
            </div>
            <ProgressStepsSkeleton count={4} />
            <div className="flex items-center justify-between">
              <Skeleton className="h-3 w-28" />
              <Skeleton className="h-6 w-28 rounded-md" />
            </div>
          </div>
        ))}
      </div>
    </SectionCardSkeleton>
  );
}