"use client";

import { Badge } from "@/components/primitives/badge";
import { Skeleton } from "@/components/primitives/skeleton";
import { formatCurrency, formatTime } from "@/lib/utils";
import {
  FragmentType,
  getFragmentData,
  graphql,
  PayoutStage,
  PayoutStatus,
} from "@/types/gql";

export const OverviewUpcomingPayoutsPayoutCard_PayoutFragment = graphql(`
  fragment OverviewUpcomingPayoutsPayoutCard_PayoutFragment on Payout {
    id
    amount
    stage
    status
    createdAt
    booking {
      space {
        title
      }
    }
  }
`);

type Props = {
  data: FragmentType<typeof OverviewUpcomingPayoutsPayoutCard_PayoutFragment>;
};

export default function PayoutCard({ data }: Props) {
  const payout = getFragmentData(
    OverviewUpcomingPayoutsPayoutCard_PayoutFragment,
    data
  );

  const getStageBadge = () => {
    if (payout.stage === PayoutStage.Stage1) {
      return {
        label: "Stage 1",
        className:
          "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300",
      };
    }
    return {
      label: "Stage 2",
      className:
        "bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300",
    };
  };

  const getStatusIndicator = () => {
    if (payout.status === PayoutStatus.Pending) {
      return {
        label: "Pending",
        className:
          "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
      };
    }
    if (payout.status === PayoutStatus.Processing) {
      return {
        label: "Processing",
        className:
          "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300",
      };
    }
    return null;
  };

  const stageBadge = getStageBadge();
  const statusIndicator = getStatusIndicator();

  return (
    <div className="flex items-center justify-between gap-4 rounded-lg border p-4">
      <div className="flex min-w-0 flex-col gap-1">
        <div className="flex items-center gap-2">
          <span className="truncate font-medium">
            {payout.booking?.space?.title ?? "Unknown Space"}
          </span>
          <Badge variant="secondary" className={stageBadge.className}>
            {stageBadge.label}
          </Badge>
        </div>
        <div className="text-muted-foreground flex items-center gap-2 text-sm">
          <span>{formatTime(payout.createdAt)}</span>
          {statusIndicator && (
            <Badge variant="secondary" className={statusIndicator.className}>
              {statusIndicator.label}
            </Badge>
          )}
        </div>
      </div>
      <span className="font-semibold whitespace-nowrap tabular-nums">
        {formatCurrency(payout.amount)}
      </span>
    </div>
  );
}

export function PayoutCardSkeleton() {
  return (
    <div className="flex items-center justify-between gap-4 rounded-lg border p-4">
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-5 w-16 rounded-full" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-16 rounded-full" />
        </div>
      </div>
      <Skeleton className="h-5 w-20" />
    </div>
  );
}
