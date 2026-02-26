import SectionCard from "@/components/composed/section-card";
import MaybePlaceholder from "@/components/status/maybe-placeholder";
import RequestCard from "./request-card";
import Placeholder from "./placeholder";
import { graphql } from "@/types/gql";
import api from "../api";

const OverviewPendingRequests_QueryFragment = graphql(`
  fragment OverviewPendingRequests_QueryFragment on Query {
    incomingBookingRequests(first: 5) {
      nodes {
        ...OverviewPendingRequestsRequestCard_BookingFragment
      }
    }
  }
`);

export default async function Page() {
  const requests = await api
    .getMyOverview(OverviewPendingRequests_QueryFragment)
    .then((res) => res.incomingBookingRequests?.nodes ?? []);

  return (
    <SectionCard
      title="Pending Requests"
      description="Booking requests awaiting your approval"
      count={requests.length}
      viewAllHref="/bookings?tab=incoming"
    >
      <MaybePlaceholder data={requests} placeholder={<Placeholder />}>
        <div className="grid grid-cols-1 gap-4 @lg/main:grid-cols-2 @3xl/main:grid-cols-3">
          {requests.slice(0, 3).map((request, index) => (
            <RequestCard key={index} data={request} />
          ))}
        </div>
      </MaybePlaceholder>
    </SectionCard>
  );
}
