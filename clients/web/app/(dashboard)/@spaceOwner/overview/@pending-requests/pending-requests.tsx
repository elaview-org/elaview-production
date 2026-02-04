"use client";

import { IconCheck, IconX } from "@tabler/icons-react";
import { Button } from "@/components/primitives/button";
import ActionCard, {
  ActionCardSkeleton,
} from "@/components/composed/action-card";
import SectionCard, {
  SectionCardSkeleton,
} from "@/components/composed/section-card";
import { formatCurrency, formatDateRange, formatTime } from "@/lib/utils";
import mock from "../mock.json";

type PendingRequest = {
  id: string;
  advertiserName: string;
  advertiserAvatar: string | null;
  spaceName: string;
  spaceId: string;
  startDate: string;
  endDate: string;
  totalAmount: number;
  createdAt: string;
};

function RequestCard({ request }: { request: PendingRequest }) {
  return (
    <ActionCard
      avatar={request.advertiserAvatar}
      name={request.advertiserName}
      subtitle={request.spaceName}
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

export default function PendingRequests() {
  const requests = mock.pendingRequests as PendingRequest[];

  if (requests.length === 0) {
    return null;
  }

  return (
    <SectionCard
      title="Pending Requests"
      description="Booking requests awaiting your approval"
      count={requests.length}
      viewAllHref="/bookings?tab=incoming"
    >
      <div className="grid grid-cols-1 gap-4 @lg/main:grid-cols-2 @3xl/main:grid-cols-3">
        {requests.slice(0, 3).map((request) => (
          <RequestCard key={request.id} request={request} />
        ))}
      </div>
    </SectionCard>
  );
}

export function PendingRequestsSkeleton() {
  return (
    <SectionCardSkeleton>
      <div className="grid grid-cols-1 gap-4 @lg/main:grid-cols-2 @3xl/main:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <ActionCardSkeleton key={i} />
        ))}
      </div>
    </SectionCardSkeleton>
  );
}
