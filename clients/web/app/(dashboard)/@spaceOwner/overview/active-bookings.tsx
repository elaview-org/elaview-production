"use client";

import Link from "next/link";
import { Button } from "@/components/primitives/button";
import { Badge } from "@/components/primitives/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/primitives/card";
import { Skeleton } from "@/components/primitives/skeleton";
import { cn } from "@/lib/utils";
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

function formatDateRange(start: string, end: string) {
  const startDate = new Date(start);
  const endDate = new Date(end);
  return `${startDate.toLocaleDateString("en-US", { month: "short", day: "numeric" })} - ${endDate.toLocaleDateString("en-US", { month: "short", day: "numeric" })}`;
}

function ProgressSteps({ currentStep }: { currentStep: number }) {
  const steps = ["Paid", "Downloaded", "Installed", "Verified"];

  return (
    <div className="flex items-center gap-1">
      {steps.map((step, index) => (
        <div key={step} className="flex items-center">
          <div
            className={cn(
              "flex size-5 items-center justify-center rounded-full text-xs font-medium",
              index < currentStep
                ? "bg-primary text-primary-foreground"
                : index === currentStep
                  ? "bg-primary/20 text-primary ring-2 ring-primary"
                  : "bg-muted text-muted-foreground"
            )}
          >
            {index + 1}
          </div>
          {index < steps.length - 1 && (
            <div
              className={cn(
                "h-0.5 w-4",
                index < currentStep ? "bg-primary" : "bg-muted"
              )}
            />
          )}
        </div>
      ))}
    </div>
  );
}

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

      <ProgressSteps currentStep={statusConfig.step} />

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
    <Card className="flex flex-col">
      <CardHeader className="flex-row items-center justify-between">
        <div>
          <CardTitle className="flex items-center gap-2">
            Active Bookings
            <Badge variant="secondary" className="tabular-nums">
              {bookings.length}
            </Badge>
          </CardTitle>
          <CardDescription>Bookings in progress</CardDescription>
        </div>
        <Button variant="outline" size="sm" asChild>
          <Link href="/bookings?tab=active">View All</Link>
        </Button>
      </CardHeader>
      <CardContent className="flex-1">
        <div className="flex flex-col gap-3">
          {bookings.slice(0, 4).map((booking) => (
            <BookingCard key={booking.id} booking={booking} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export function ActiveBookingsSkeleton() {
  return (
    <Card className="flex flex-col">
      <CardHeader className="flex-row items-center justify-between">
        <div className="flex flex-col gap-1">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-4 w-40" />
        </div>
        <Skeleton className="h-9 w-20" />
      </CardHeader>
      <CardContent className="flex-1">
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
              <div className="flex items-center gap-1">
                {Array.from({ length: 4 }).map((_, j) => (
                  <div key={j} className="flex items-center">
                    <Skeleton className="size-5 rounded-full" />
                    {j < 3 && <Skeleton className="h-0.5 w-4" />}
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-between">
                <Skeleton className="h-3 w-28" />
                <Skeleton className="h-6 w-28 rounded-md" />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}