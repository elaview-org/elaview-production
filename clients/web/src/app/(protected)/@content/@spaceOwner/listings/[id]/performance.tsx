import { FragmentType, getFragmentData, graphql } from "@/types/gql";

export const Performance_SpaceFragment = graphql(`
  fragment Performance_SpaceFragment on Space {
    totalBookings
    totalRevenue
    averageRating
  }
`);

type Props = {
  data: FragmentType<typeof Performance_SpaceFragment>;
};

export default function Performance({ data }: Props) {
  const space = getFragmentData(Performance_SpaceFragment, data);

  return (
    <div className="rounded-lg border p-4">
      <p className="text-muted-foreground mb-3 text-sm">Performance</p>
      <div className="grid grid-cols-3 gap-4 text-center">
        <div>
          <p className="text-2xl font-semibold">{space.totalBookings}</p>
          <p className="text-muted-foreground text-xs">Bookings</p>
        </div>
        <div>
          <p className="text-2xl font-semibold">
            ${String(space.totalRevenue)}
          </p>
          <p className="text-muted-foreground text-xs">Revenue</p>
        </div>
        <div>
          <p className="text-2xl font-semibold">
            {space.averageRating ? `${space.averageRating.toFixed(1)}★` : "—"}
          </p>
          <p className="text-muted-foreground text-xs">Rating</p>
        </div>
      </div>
    </div>
  );
}
