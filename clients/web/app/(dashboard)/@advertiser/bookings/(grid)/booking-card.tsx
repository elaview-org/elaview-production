import MediaCard from "@/components/composed/media-card";
import { BOOKING_STATUS } from "@/lib/constants";
import { FragmentType, getFragmentData, graphql } from "@/types/gql";

export const BookingCard_AdvertiserBookingFragment = graphql(`
  fragment BookingCard_AdvertiserBookingFragment on Booking {
    id
    status
    startDate
    endDate
    totalAmount
    space {
      title
      images
      city
      state
      owner {
        businessName
      }
    }
    campaign {
      name
    }
  }
`);

type Props = {
  data: FragmentType<typeof BookingCard_AdvertiserBookingFragment>;
};

export default function BookingCard({ data }: Props) {
  const booking = getFragmentData(BookingCard_AdvertiserBookingFragment, data);
  const startDate = new Date(booking.startDate as string);
  const endDate = new Date(booking.endDate as string);
  const dateRange = `${startDate.toLocaleDateString("en-US", { month: "short", day: "numeric" })} - ${endDate.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`;
  const location = booking.space
    ? `${booking.space.city}, ${booking.space.state}`
    : undefined;

  return (
    <MediaCard
      href={`/bookings/${booking.id}`}
      image={booking.space?.images[0]}
      alt={booking.space?.title ?? "Booking"}
      title={booking.space?.title ?? "Untitled Space"}
      description={location}
      indicator={{
        className: BOOKING_STATUS.indicators[booking.status],
        title: BOOKING_STATUS.labels[booking.status],
      }}
      badges={[
        {
          position: "top-right",
          content: BOOKING_STATUS.labels[booking.status],
          className:
            "text-muted-foreground bg-background p-1 tracking-wide uppercase",
        },
      ]}
      metaLeft={dateRange}
      metaRight={`$${Number(booking.totalAmount).toLocaleString()}`}
    />
  );
}
