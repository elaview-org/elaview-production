import SectionCard from "@/components/composed/section-card";
import MaybePlaceholder from "@/components/status/maybe-placeholder";
import DeadlineCard from "./deadline-card";
import Placeholder from "./placeholder";
import { graphql } from "@/types/gql";
import api from "../api";

const OverviewDeadlineWarnings_QueryFragment = graphql(`
  fragment OverviewDeadlineWarnings_QueryFragment on Query {
    deadlineBookings: myBookingsAsOwner(
      first: 5
      where: { status: { in: [FILE_DOWNLOADED, INSTALLED] } }
      order: [{ endDate: ASC }]
    ) {
      nodes {
        ...OverviewDeadlineWarningsDeadlineCard_BookingFragment
      }
    }
  }
`);

export default async function Page() {
  const bookings = await api
    .getMyOverview(OverviewDeadlineWarnings_QueryFragment)
    .then((res) => res.deadlineBookings?.nodes ?? []);

  return (
    <SectionCard
      title="Deadline Warnings"
      description="Bookings approaching their end dates"
      count={bookings.length}
      viewAllHref="/bookings?status=active"
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
