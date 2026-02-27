import { FragmentType } from "@/types/gql";
import { GridView } from "@/components/composed/grid-view";
import MaybePlaceholder from "@/components/status/maybe-placeholder";
import SpaceCard, { DiscoverSpaceCard_SpaceFragment } from "./space-card";
import GridPlaceholder from "./placeholder";

type Props = {
  data: FragmentType<typeof DiscoverSpaceCard_SpaceFragment>[];
};

export default function DiscoverGrid({ data }: Props) {
  return (
    <MaybePlaceholder data={data} placeholder={<GridPlaceholder />}>
      <GridView columns={4}>
        {data.map((space, i) => (
          <SpaceCard key={i} data={space} />
        ))}
      </GridView>
    </MaybePlaceholder>
  );
}
