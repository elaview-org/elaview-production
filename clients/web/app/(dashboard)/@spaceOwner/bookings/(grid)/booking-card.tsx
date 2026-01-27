import MediaCard from "@/components/composed/media-card";
import { FragmentType, getFragmentData, graphql } from "@/types/gql";
import { STATUS_INDICATORS, STATUS_LABELS } from "../constants";

export const BookingCard_BookingFragment = graphql(`
  fragment BookingCard_BookingFragment on Booking {
    id
    status
    startDate
    endDate
    ownerPayoutAmount
    space {
      title
      images
    }
    campaign {
      name
      advertiserProfile {
        companyName
      }
    }
  }
`);

type Props = {
  data: FragmentType<typeof BookingCard_BookingFragment>;
};

export default function BookingCard({ data }: Props) {
  const booking = getFragmentData(BookingCard_BookingFragment, data);
  const startDate = new Date(booking.startDate as string);
  const endDate = new Date(booking.endDate as string);
  const dateRange = `${startDate.toLocaleDateString("en-US", { month: "short", day: "numeric" })} - ${endDate.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`;

  return (
    <MediaCard
      href={`/bookings/${booking.id}`}
      image={booking.space?.images[0]}
      alt={booking.space?.title ?? "Booking"}
      title={booking.space?.title ?? "Untitled Space"}
      description={booking.campaign?.advertiserProfile?.companyName}
      indicator={{
        className: STATUS_INDICATORS[booking.status],
        title: STATUS_LABELS[booking.status],
      }}
      badges={[
        {
          position: "top-right",
          content: STATUS_LABELS[booking.status],
          className:
            "text-muted-foreground bg-background p-1 tracking-wide uppercase",
        },
      ]}
      metaLeft={dateRange}
      metaRight={`$${Number(booking.ownerPayoutAmount).toLocaleString()}`}
    />
  );
}