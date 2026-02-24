import SectionCard from "@/components/composed/section-card";
import MaybePlaceholder from "@/components/status/maybe-placeholder";
import ApprovalCard from "./approval-card";
import Placeholder from "./placeholder";
import { graphql } from "@/types/gql";
import api from "../api";

const AdvertiserOverviewPendingApprovals_QueryFragment = graphql(`
  fragment AdvertiserOverviewPendingApprovals_QueryFragment on Query {
    pendingApprovalsBookings: myBookingsAsAdvertiser(
      first: 3
      where: { status: { eq: VERIFIED } }
      order: [{ createdAt: DESC }]
    ) {
      nodes {
        ...AdvertiserOverviewPendingApprovalsApprovalCard_BookingFragment
      }
    }
  }
`);

export default async function Page() {
  const approvals = await api
    .getAdvertiserOverview(AdvertiserOverviewPendingApprovals_QueryFragment)
    .then((res) => res.pendingApprovalsBookings?.nodes ?? []);

  return (
    <SectionCard
      title="Pending Approvals"
      description="Installations awaiting your verification"
      count={approvals.length}
      viewAllHref="/bookings?tab=verification"
    >
      <MaybePlaceholder data={approvals} placeholder={<Placeholder />}>
        <div className="grid grid-cols-1 gap-4 @lg/main:grid-cols-2 @3xl/main:grid-cols-3">
          {approvals.map((approval, index) => (
            <ApprovalCard key={index} data={approval} />
          ))}
        </div>
      </MaybePlaceholder>
    </SectionCard>
  );
}
