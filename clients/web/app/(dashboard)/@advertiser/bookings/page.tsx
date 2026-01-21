import getBookingsQuery from "./book-queries";
import BookingsPage from "./bookings";

export default async function Page() {
  const { bookings } = await getBookingsQuery();
  return <BookingsPage bookings={bookings} />;
}
