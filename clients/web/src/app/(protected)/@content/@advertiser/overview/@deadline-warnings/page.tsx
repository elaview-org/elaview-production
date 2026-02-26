import SectionCard from "@/components/composed/section-card";
import MaybePlaceholder from "@/components/status/maybe-placeholder";
import DeadlineCard from "./deadline-card";
import Placeholder from "./placeholder";
import { graphql } from "@/types/gql";
import api from "../api";

const AdvertiserOverviewDeadlineWarnings_QueryFragment = graphql(`
  fragment AdvertiserOverviewDeadlineWarnings_QueryFragment on Query {
    deadlineBookings: myBookingsAsAdvertiser(
      first: 5
      where: { status: { eq: VERIFIED } }
      order: [{ proof: { submittedAt: ASC } }]
    ) {
      nodes {
        ...AdvertiserOverviewDeadlineWarningsDeadlineCard_BookingFragment
      }
    }
  }
`);

export default async function Page() {
  const bookings = await api
    .getAdvertiserOverview(AdvertiserOverviewDeadlineWarnings_QueryFragment)
    .then((res) => res.deadlineBookings?.nodes ?? []);

  return (
    <SectionCard
      title="Approval Deadlines"
      description="Installations awaiting your review (48hr auto-approval)"
      count={bookings.length}
      viewAllHref="/bookings?status=verified"
    >
      <MaybePlaceholder data={bookings} placeholder={<Placeholder />}>
        <div className="grid grid-cols-1 gap-4 @lg/main:grid-cols-2 @3xl/main:grid-cols-3">
          {bookings.slice(0, 3).map((booking, index) => (
            <DeadlineCard key={index} data={booking} />
          ))}
        </div>
      </MaybePlaceholder>
    </SectionCard>
  );
}
