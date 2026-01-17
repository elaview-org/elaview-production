import getBooksQuries from "./book-quries";
import BookingsPage from "./components/bookings";

export default async function Page() {
  const { name } = await getBooksQuries();
  console.log('name',name);
  return <BookingsPage />;
}
