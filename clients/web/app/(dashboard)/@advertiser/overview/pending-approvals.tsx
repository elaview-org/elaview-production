"use client";

import { IconCheck, IconX, IconPhoto } from "@tabler/icons-react";
import { Button } from "@/components/primitives/button";
import ActionCard, {
  ActionCardSkeleton,
} from "@/components/composed/action-card";
import SectionCard, {
  SectionCardSkeleton,
} from "@/components/composed/section-card";
import { formatDate } from "@/lib/utils";
import mock from "./mock.json";

type PendingApproval = {
  id: string;
  spaceName: string;
  ownerName: string;
  ownerAvatar: string | null;
  installDate: string;
  photoCount: number;
  bookingId: string;
};

function ApprovalCard({ approval }: { approval: PendingApproval }) {
  return (
    <ActionCard
      avatar={approval.ownerAvatar}
      name={approval.spaceName}
      subtitle={approval.ownerName}
      timestamp={formatDate(approval.installDate)}
      metaLeft={
        <span className="flex items-center gap-1">
          <IconPhoto className="size-3" />
          {approval.photoCount} photos
        </span>
      }
      actions={
        <>
          <Button size="sm" className="flex-1 gap-1">
            <IconCheck className="size-4" />
            Approve
          </Button>
          <Button size="sm" variant="outline" className="flex-1 gap-1">
            <IconX className="size-4" />
            Dispute
          </Button>
        </>
      }
    />
  );
}

export default function PendingApprovals() {
  const approvals = mock.pendingApprovals as PendingApproval[];

  if (approvals.length === 0) {
    return null;
  }

  return (
    <SectionCard
      title="Pending Approvals"
      description="Installations awaiting your verification"
      count={approvals.length}
      viewAllHref="/bookings?tab=verification"
    >
      <div className="grid grid-cols-1 gap-4 @lg/main:grid-cols-2 @3xl/main:grid-cols-3">
        {approvals.slice(0, 3).map((approval) => (
          <ApprovalCard key={approval.id} approval={approval} />
        ))}
      </div>
    </SectionCard>
  );
}

export function PendingApprovalsSkeleton() {
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
