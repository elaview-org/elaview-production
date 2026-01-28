import { FragmentType } from "@/types/gql";
import { GridView } from "@/components/composed/grid-view";
import MaybePlaceholder from "@/components/status/maybe-placeholder";
import BookingCard, {
  BookingCard_AdvertiserBookingFragment,
} from "./booking-card";
import Placeholder from "./placeholder";
import { type FilterTabKey } from "../constants";

type Props = {
  data: FragmentType<typeof BookingCard_AdvertiserBookingFragment>[];
  tabKey: FilterTabKey;
};

export default function BookingsGrid({ data, tabKey }: Props) {
  return (
    <MaybePlaceholder data={data} placeholder={<Placeholder tabKey={tabKey} />}>
      <GridView columns={4}>
        {data.map((booking, i) => (
          <BookingCard key={i} data={booking} />
        ))}
      </GridView>
    </MaybePlaceholder>
  );
}
