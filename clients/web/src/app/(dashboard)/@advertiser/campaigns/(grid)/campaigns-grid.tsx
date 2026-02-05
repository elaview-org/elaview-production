import { FragmentType } from "@/types/gql";
import { GridView } from "@/components/composed/grid-view";
import MaybePlaceholder from "@/components/status/maybe-placeholder";
import CampaignCard, { CampaignCard_CampaignFragment } from "./campaign-card";
import Placeholder from "./placeholder";
import { type FilterTabKey } from "../constants";

type Props = {
  data: FragmentType<typeof CampaignCard_CampaignFragment>[];
  tabKey: FilterTabKey;
};

export default function CampaignsGrid({ data, tabKey }: Props) {
  return (
    <MaybePlaceholder data={data} placeholder={<Placeholder tabKey={tabKey} />}>
      <GridView columns={4}>
        {data.map((campaign, i) => (
          <CampaignCard key={i} data={campaign} />
        ))}
      </GridView>
    </MaybePlaceholder>
  );
}
