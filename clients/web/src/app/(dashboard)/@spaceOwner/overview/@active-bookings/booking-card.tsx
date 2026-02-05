import Link from "next/link";
import { Badge } from "@/components/primitives/badge";
import ProgressSteps from "@/components/composed/progress-steps";
import { cn, formatDateRange } from "@/lib/utils";
import {
  ActiveBookingStatus,
  BOOKING_STATUS_CONFIG,
  NEXT_ACTION_CONFIG,
} from "../constants";
import { FragmentType, getFragmentData, graphql } from "@/types/gql";

const OverviewActiveBookingsBookingCard_BookingFragment = graphql(`
  fragment OverviewActiveBookingsBookingCard_BookingFragment on Booking {
    id
    status
    campaign {
      advertiser {
        user {
          name
        }
      }
    }
    space {
      id
      title
    }
    startDate
    endDate
  }
`);

const BOOKING_STEPS = ["Paid", "Downloaded", "Installed", "Verified"];

type Props = {
  data: FragmentType<typeof OverviewActiveBookingsBookingCard_BookingFragment>;
};

export default function BookingCard({ data }: Props) {
  const booking = getFragmentData(
    OverviewActiveBookingsBookingCard_BookingFragment,
    data
  );
  const statusConfig =
    BOOKING_STATUS_CONFIG[booking.status as ActiveBookingStatus];
  const nextAction = "Upload Verification";
  const actionConfig = NEXT_ACTION_CONFIG[nextAction]; // todo
  const ActionIcon = actionConfig.icon;
  const daysRemaining: number = 10; // todo

  return (
    <Link
      href={`/bookings/${booking.id}`}
      className="hover:bg-muted/50 flex flex-col gap-3 rounded-lg border p-4 transition-colors"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex flex-col gap-0.5">
          <span className="font-medium">{booking.space?.title}</span>
          <span className="text-muted-foreground text-sm">
            {booking.campaign?.advertiser?.user.name}
          </span>
        </div>
        {daysRemaining <= 2 && (
          <Badge variant="destructive" className="shrink-0">
            {daysRemaining === 0 ? "Due today" : `${daysRemaining}d left`}
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
          {nextAction}
        </div>
      </div>
    </Link>
  );
}
