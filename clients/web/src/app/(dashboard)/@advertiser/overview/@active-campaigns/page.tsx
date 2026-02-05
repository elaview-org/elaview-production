import SectionCard from "@/components/composed/section-card";
import MaybePlaceholder from "@/components/status/maybe-placeholder";
import CampaignCard from "./campaign-card";
import Placeholder from "./placeholder";
import { graphql } from "@/types/gql";
import api from "../api";

const AdvertiserOverviewActiveCampaigns_QueryFragment = graphql(`
  fragment AdvertiserOverviewActiveCampaigns_QueryFragment on Query {
    myCampaigns(
      first: 4
      where: { status: { in: [ACTIVE, SUBMITTED] } }
      order: [{ createdAt: DESC }]
    ) {
      nodes {
        status
        ...AdvertiserOverviewActiveCampaignsCampaignCard_CampaignFragment
      }
    }
  }
`);

export default async function Page() {
  const campaigns = await api
    .getAdvertiserOverview(AdvertiserOverviewActiveCampaigns_QueryFragment)
    .then((res) => res.myCampaigns?.nodes ?? []);

  const activeCampaignsCount = campaigns.filter(
    (c) => c.status === "ACTIVE"
  ).length;

  return (
    <SectionCard
      title="Active Campaigns"
      description="Campaigns in progress"
      count={activeCampaignsCount}
      viewAllHref="/campaigns"
    >
      <MaybePlaceholder data={campaigns} placeholder={<Placeholder />}>
        <div className="flex flex-col gap-3">
          {campaigns.map((campaign, index) => (
            <CampaignCard key={index} data={campaign} />
          ))}
        </div>
      </MaybePlaceholder>
    </SectionCard>
  );
}
