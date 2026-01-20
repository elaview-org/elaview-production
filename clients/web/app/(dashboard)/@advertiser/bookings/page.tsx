import getBooksQueries from "./book-queries";
import BookingsPage from "./bookings";

export default async function Page() {
  const { name } = await getBooksQueries();
  console.log("name", name);
  return <BookingsPage />;
}
