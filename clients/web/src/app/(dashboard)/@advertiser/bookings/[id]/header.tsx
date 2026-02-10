"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import Link from "next/link";
import { IconArrowLeft, IconLoader2, IconMessage } from "@tabler/icons-react";
import { Badge } from "@/components/primitives/badge";
import { Button } from "@/components/primitives/button";
import { BOOKING_STATUS } from "@/lib/core/constants";
import { formatDate } from "@/lib/core/utils";
import type { BookingStatus } from "@/types/gql/graphql";
import { toast } from "sonner";
import { createBookingConversationAction } from "../bookings.actions";

type Props = {
  booking: {
    id: unknown;
    status: BookingStatus;
    startDate: unknown;
    endDate: unknown;
    space?: { title: string } | null;
  };
};

export default function Header({ booking }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const title = booking.space?.title ?? "Booking Details";
  const dateRange = `${formatDate(booking.startDate as string)} - ${formatDate(booking.endDate as string)}`;

  const handleMessageClick = () => {
    startTransition(async () => {
      const result = await createBookingConversationAction(
        booking.id as string
      );
      if (result.success && result.conversationId) {
        router.push(`/messages/${result.conversationId}`);
      } else {
        toast.error(result.error ?? "Failed to open conversation");
      }
    });
  };

  return (
    <div className="flex flex-col gap-4">
      <Link
        href="/bookings"
        className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1 text-sm transition-colors"
      >
        <IconArrowLeft className="size-4" />
        Back to Bookings
      </Link>

      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-semibold">{title}</h1>
            <Badge variant={BOOKING_STATUS.variants[booking.status]}>
              {BOOKING_STATUS.labels[booking.status]}
            </Badge>
          </div>
          <p className="text-muted-foreground text-sm">{dateRange}</p>
        </div>

        <Button
          variant="outline"
          onClick={handleMessageClick}
          disabled={isPending}
        >
          {isPending ? (
            <IconLoader2 className="size-4 animate-spin" />
          ) : (
            <IconMessage className="size-4" />
          )}
          Message Owner
        </Button>
      </div>
    </div>
  );
}
