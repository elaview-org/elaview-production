import SectionCard from "@/components/composed/section-card";
import BookingCard from "./booking-card";
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

const OverviewPendingRequests_QueryFragment = graphql(`
  fragment OverviewPendingRequests_QueryFragment on Query {
    incomingBookingRequests(first: 5) {
      nodes {
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
    }
  }
`);

const OverviewTopSpaces_QueryFragment = graphql(`
  fragment OverviewTopSpaces_QueryFragment on Query {
    mySpaces(first: 5, order: { totalRevenue: DESC }) {
      nodes {
        id
        title
        images
        totalBookings
        totalRevenue
        averageRating
        status
      }
    }
  }
`);

export default async function Page() {
  const bookings = await api
    .getMyOverview(OverviewActiveBookings_QueryFragment)
    .then((res) => res.myBookingsAsOwner?.nodes ?? []);

  if (bookings.length === 0) {
    return null;
  }

  return (
    <SectionCard
      title="Active Bookings"
      description="Bookings in progress"
      count={bookings.length}
      viewAllHref="/bookings?tab=active"
    >
      <div className="flex flex-col gap-3">
        {bookings.slice(0, 4).map((booking, index) => (
          <BookingCard key={index} data={booking} />
        ))}
      </div>
    </SectionCard>
  );
}
