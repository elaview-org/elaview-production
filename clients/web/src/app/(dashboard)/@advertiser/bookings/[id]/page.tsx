import getBookingDetailsQuery from "./booking-queries";
import BookingDetailsWrapper from "./booking-details-wrapper";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function BookingDetailsPage({ params }: PageProps) {
  const { id: bookingId } = await params;

  const bookingData = await getBookingDetailsQuery(bookingId);

  return (
    <BookingDetailsWrapper bookingId={bookingId} initialData={bookingData} />
  );
}
