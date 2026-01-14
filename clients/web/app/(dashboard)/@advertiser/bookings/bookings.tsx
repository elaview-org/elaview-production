import { BookingCard, BookingStatus } from "./booking-card";

const books = [
  {
    id: 1,
    status: "active" as BookingStatus,
    location: "Los Angeles, CA",
    spaceName: "Downtown Billboard",
    startDate: "Jan 12",
    endDate: "Jan 18",
    campaignName: "Brand Awareness",
    thumbnailUrl: "/mock/spaces/billboard-1.jpg",
  },
  {
    id: 2,
    status: "pending" as BookingStatus,
    location: "San Francisco, CA",
    spaceName: "Market Street LED",
    startDate: "Feb 02",
    endDate: "Feb 10",
    campaignName: "Product Launch",
    thumbnailUrl: "/mock/spaces/led-1.jpg",
  },
  {
    id: 3,
    status: "completed" as BookingStatus,
    location: "New York, NY",
    spaceName: "Times Square Screen",
    startDate: "Dec 01",
    endDate: "Dec 07",
    campaignName: "Holiday Promo",
    thumbnailUrl: "/mock/spaces/screen-1.jpg",
  },
  {
    id: 4,
    status: "cancelled" as BookingStatus,
    location: "Chicago, IL",
    spaceName: "Loop Transit Display",
    startDate: "Nov 10",
    endDate: "Nov 15",
    campaignName: "Transit Ads",
    thumbnailUrl: "/mock/spaces/transit-1.jpg",
  },
  {
    id: 5,
    status: "active" as BookingStatus,
    location: "Austin, TX",
    spaceName: "Congress Ave Banner",
    startDate: "Jan 20",
    endDate: "Jan 30",
    campaignName: "Startup Growth",
    thumbnailUrl: "/mock/spaces/banner-1.jpg",
  },
  {
    id: 6,
    status: "pending" as BookingStatus,
    location: "Seattle, WA",
    spaceName: "Pike Place Display",
    startDate: "Feb 15",
    endDate: "Feb 22",
    campaignName: "Event Promotion",
    thumbnailUrl: "/mock/spaces/display-1.jpg",
  },
  {
    id: 7,
    status: "completed" as BookingStatus,
    location: "Miami, FL",
    spaceName: "Ocean Drive Billboard",
    startDate: "Oct 05",
    endDate: "Oct 12",
    campaignName: "Summer Sale",
    thumbnailUrl: "/mock/spaces/billboard-2.jpg",
  },
  {
    id: 8,
    status: "active" as BookingStatus,
    location: "Las Vegas, NV",
    spaceName: "Strip LED Wall",
    startDate: "Jan 05",
    endDate: "Jan 25",
    campaignName: "Casino Promotion",
    thumbnailUrl: "/mock/spaces/led-2.jpg",
  },
  {
    id: 9,
    status: "pending" as BookingStatus,
    location: "Boston, MA",
    spaceName: "Seaport Digital Board",
    startDate: "Mar 01",
    endDate: "Mar 08",
    campaignName: "Tech Conference",
    thumbnailUrl: "/mock/spaces/digital-1.jpg",
  },
  {
    id: 10,
    status: "completed" as BookingStatus,
    location: "Denver, CO",
    spaceName: "Union Station Screen",
    startDate: "Sep 15",
    endDate: "Sep 22",
    campaignName: "Travel Campaign",
    thumbnailUrl: "/mock/spaces/screen-2.jpg",
  },
];

export default function BookingsPage() {
  return (
    <>
      <div className="grid grid-cols-1 gap-6 p-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {books.map((b) => (
          <BookingCard {...b} key={b.id} />
        ))}
      </div>
    </>
  );
}
