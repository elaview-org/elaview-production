import BookingDetailsPage from "@/components/pages/adventiser-booking-details/adventiser-booking-details";

interface PageProps {
  params: {
    bookingId: string;
  };
}

export default function Page({ params }: PageProps) {
  const { bookingId } = params;

  return <BookingDetailsPage bookingId={bookingId} />;
}
