
import { ExternalLinkIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/primitives/button";
import { Badge } from "@/components/primitives/badge";
import type { ThreadContext } from "../../../../../types/types";

interface ThreadHeaderProps {
  context: ThreadContext;
  onBack?: () => void;
  showBackButton?: boolean;
}

function getStatusBadgeVariant(
  status: string
): "default" | "secondary" | "outline" {
  const statusMap: Record<string, "default" | "secondary" | "outline"> = {
    PENDING_APPROVAL: "outline",
    ACCEPTED: "secondary",
    PAID: "default",
    FILE_DOWNLOADED: "default",
    INSTALLED: "default",
    VERIFIED: "default",
    COMPLETED: "default",
    CANCELLED: "outline",
    DISPUTED: "outline",
  };
  return statusMap[status] ?? "outline";
}

function formatStatus(status: string): string {
  return status
    .split("_")
    .map((word) => word.charAt(0) + word.slice(1).toLowerCase())
    .join(" ");
}

export function ThreadHeader({
  context,
  onBack,
  showBackButton = false,
}: ThreadHeaderProps) {
  return (
    <div className="bg-background/95 supports-backdrop-filter:bg-background/80 sticky top-0 z-10 border-b backdrop-blur">
      <div className="flex items-center justify-between gap-4 px-4 py-3">
        <div className="flex min-w-0 flex-1 items-center gap-3">
          {showBackButton && (
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={onBack}
              aria-label="Back to conversations"
              className="shrink-0"
            >
              <svg
                className="size-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </Button>
          )}

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h2 className="truncate text-sm font-semibold">
                {context.spaceName}
              </h2>
              <Badge variant={getStatusBadgeVariant(context.bookingStatus)}>
                {formatStatus(context.bookingStatus)}
              </Badge>
            </div>
            <p className="text-muted-foreground truncate text-xs">
              Booking #{context.bookingId.split("-")[1]}
            </p>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <Button variant="outline" size="sm" asChild className="h-8 text-xs">
            <Link href={`/bookings/${context.bookingId}`}>
              View Booking
              <ExternalLinkIcon className="ml-1 size-3" />
            </Link>
          </Button>
          <Button variant="outline" size="sm" asChild className="h-8 text-xs">
            <Link href={`/discover/${context.spaceId}`}>
              View Space
              <ExternalLinkIcon className="ml-1 size-3" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
