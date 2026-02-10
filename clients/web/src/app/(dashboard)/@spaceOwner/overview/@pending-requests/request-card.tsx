"use client";

import { IconCheck, IconX } from "@tabler/icons-react";
import { Button } from "@/components/primitives/button";
import ActionCard from "@/components/composed/action-card";
import { formatCurrency, formatDateRange, formatTime } from "@/lib/core/utils";
import { FragmentType, getFragmentData, graphql } from "@/types/gql";

export const OverviewPendingRequestsRequestCard_BookingFragment = graphql(`
  fragment OverviewPendingRequestsRequestCard_BookingFragment on Booking {
    id
    campaign {
      advertiser {
        user {
          name
          avatar
        }
      }
    }
    space {
      id
      title
    }
    startDate
    endDate
    totalAmount
    createdAt
  }
`);

type Props = {
  data: FragmentType<typeof OverviewPendingRequestsRequestCard_BookingFragment>;
};

export default function RequestCard({ data }: Props) {
  const request = getFragmentData(
    OverviewPendingRequestsRequestCard_BookingFragment,
    data
  );

  return (
    <ActionCard
      avatar={request.campaign?.advertiser?.user.avatar ?? null}
      name={request.campaign?.advertiser?.user.name ?? ""}
      subtitle={request.space?.title ?? ""}
      timestamp={formatTime(request.createdAt)}
      metaLeft={formatDateRange(request.startDate, request.endDate)}
      metaRight={formatCurrency(request.totalAmount)}
      actions={
        <>
          <Button size="sm" className="flex-1 gap-1">
            <IconCheck className="size-4" />
            Accept
          </Button>
          <Button size="sm" variant="outline" className="flex-1 gap-1">
            <IconX className="size-4" />
            Decline
          </Button>
        </>
      }
    />
  );
}
