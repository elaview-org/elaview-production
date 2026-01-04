import { api } from "../../../../../elaview-mvp/src/trpc/server";
import { DisputedBookingsSection } from "./DisputedBookingsSection";

export async function DisputedBookings() {
  const disputes = await api.admin.bookings.getDisputedBookings({ limit: 20 });

  return (
    <DisputedBookingsSection
      bookings={disputes?.bookings ?? []}
      total={disputes?.total ?? 0}
    />
  );
}