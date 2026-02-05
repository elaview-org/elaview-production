import { ExternalLinkIcon, ChevronLeftIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/primitives/button";
import { Badge } from "@/components/primitives/badge";
import { BOOKING_STATUS } from "@/lib/constants";
import type { ThreadDataQuery } from "@/types/gql";

type Conversation = NonNullable<
  NonNullable<ThreadDataQuery["myConversations"]>["nodes"]
>[number];

type Props = {
  conversation: Conversation;
  showBackButton?: boolean;
};

export default function ThreadHeader({
  conversation,
  showBackButton = false,
}: Props) {
  const spaceName = conversation.booking?.space?.title ?? "Unknown Space";
  const bookingId = conversation.booking?.id;
  const spaceId = conversation.booking?.space?.id;
  const bookingStatus = conversation.booking?.status;

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
          {bookingId && (
            <Button variant="outline" size="sm" asChild className="h-8 text-xs">
              <Link href={`/bookings/${bookingId}`}>
                View Booking
                <ExternalLinkIcon className="ml-1 size-3" />
              </Link>
            </Button>
          )}
          {spaceId && (
            <Button variant="outline" size="sm" asChild className="h-8 text-xs">
              <Link href={`/space/${spaceId}`}>
                View Space
                <ExternalLinkIcon className="ml-1 size-3" />
              </Link>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
