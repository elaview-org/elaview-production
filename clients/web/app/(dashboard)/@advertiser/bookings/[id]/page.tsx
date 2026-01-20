import BookingDetailsPage from "./booking-details";

interface PageProps {
  params: {
    id: string;
  };
}

export default function Page({ params }: PageProps) {
  return <BookingDetailsPage bookingId={params.id} />;
}
