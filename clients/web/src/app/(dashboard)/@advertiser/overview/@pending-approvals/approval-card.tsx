"use client";

import { IconCheck, IconX, IconPhoto } from "@tabler/icons-react";
import { Button } from "@/components/primitives/button";
import ActionCard from "@/components/composed/action-card";
import { formatDate } from "@/lib/utils";
import { graphql, type FragmentType, getFragmentData } from "@/types/gql";

export const AdvertiserOverviewPendingApprovalsApprovalCard_BookingFragment =
  graphql(`
    fragment AdvertiserOverviewPendingApprovalsApprovalCard_BookingFragment on Booking {
      id
      space {
        title
        spaceOwnerProfile {
          user {
            name
            avatar
          }
        }
      }
      proof {
        photos
        submittedAt
      }
    }
  `);

type Props = {
  data: FragmentType<
    typeof AdvertiserOverviewPendingApprovalsApprovalCard_BookingFragment
  >;
};

export default function ApprovalCard({ data }: Props) {
  const booking = getFragmentData(
    AdvertiserOverviewPendingApprovalsApprovalCard_BookingFragment,
    data
  );

  const spaceName = booking.space?.title ?? "Unknown Space";
  const ownerName = booking.space?.spaceOwnerProfile?.user?.name ?? "Unknown";
  const ownerAvatar = booking.space?.spaceOwnerProfile?.user?.avatar ?? null;
  const photoCount = booking.proof?.photos?.length ?? 0;
  const submittedAt = booking.proof?.submittedAt;

  return (
    <ActionCard
      avatar={ownerAvatar}
      name={spaceName}
      subtitle={ownerName}
      timestamp={submittedAt ? formatDate(submittedAt) : undefined}
      metaLeft={
        <span className="flex items-center gap-1">
          <IconPhoto className="size-3" />
          {photoCount} photos
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
