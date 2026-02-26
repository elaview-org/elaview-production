import { FragmentType } from "@/types/gql";
import { GridView } from "@/components/composed/grid-view";
import MaybePlaceholder from "@/components/status/maybe-placeholder";
import SpaceCard, { SpaceCard_SpaceFragment } from "./space-card";
import GridPlaceholder from "./placeholder";

type Props = {
  data: FragmentType<typeof SpaceCard_SpaceFragment>[];
};

export default function ListingsGrid({ data }: Props) {
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
