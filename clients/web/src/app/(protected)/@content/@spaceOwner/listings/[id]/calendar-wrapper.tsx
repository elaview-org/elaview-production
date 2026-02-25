import api from "@/api/server";
import SpaceCalendar from "./calendar";

type Props = {
  spaceId: string;
};

export default async function CalendarWrapper({ spaceId }: Props) {
  const blockedDates = await api.listings.blockedDates(spaceId);

  return <SpaceCalendar spaceId={spaceId} blockedDates={blockedDates} />;
}
