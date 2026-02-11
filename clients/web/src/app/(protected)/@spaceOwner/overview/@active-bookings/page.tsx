import SectionCard from "@/components/composed/section-card";
import MaybePlaceholder from "@/components/status/maybe-placeholder";
import BookingCard from "./booking-card";
import Placeholder from "./placeholder";
import { graphql } from "@/types/gql";
import api from "../api";

const OverviewActiveBookings_QueryFragment = graphql(`
  fragment OverviewActiveBookings_QueryFragment on Query {
    myBookingsAsOwner(
      first: 5
      where: { status: { in: [PAID, FILE_DOWNLOADED, INSTALLED] } }
    ) {
      nodes {
        ...OverviewActiveBookingsBookingCard_BookingFragment
      }
    }
  }
`);

export default async function Page() {
  const bookings = await api
    .getMyOverview(OverviewActiveBookings_QueryFragment)
    .then((res) => res.myBookingsAsOwner?.nodes ?? []);

  return (
    <SectionCard
      title="Active Bookings"
      description="Bookings in progress"
      count={bookings.length}
      viewAllHref="/bookings?tab=active"
    >
      <MaybePlaceholder data={bookings} placeholder={<Placeholder />}>
        <div className="flex flex-col gap-3">
          {bookings.slice(0, 4).map((booking, index) => (
            <BookingCard key={index} data={booking} />
          ))}
        </div>
      </MaybePlaceholder>
    </SectionCard>
  );
}
