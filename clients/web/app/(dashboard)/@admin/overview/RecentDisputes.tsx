import Link from "next/link";
// import { api } from "../../../../../elaview-mvp/src/trpc/server";

export default async function RecentDisputes() {
  // const disputes = await api.admin.bookings.getDisputedBookings({ limit: 5 });
  const disputes = {};
  return (
    <>
      {disputes && disputes.bookings.length > 0 && (
        <div className="rounded-lg border border-red-500/20 bg-red-500/5 p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-white">
              Recent Disputes
            </h2>
            <Link
              href="/disputes"
              className="text-sm text-blue-400 hover:text-blue-300"
            >
              View all →
            </Link>
          </div>
          <div className="space-y-3">
            {disputes.bookings.slice(0, 3).map((booking) => (
              <div
                key={booking.id}
                className="rounded-lg border border-slate-700 bg-slate-900/50 p-3"
              >
                <p className="font-medium text-white">{booking.space.title}</p>
                <p className="mt-1 text-sm text-slate-400">
                  Advertiser: {booking.campaign.advertiser.email}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
