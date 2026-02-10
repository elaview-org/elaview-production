import MediaCard from "@/components/composed/media-card";
import { CAMPAIGN_STATUS } from "@/lib/core/constants";
import { formatCurrency } from "@/lib/core/utils";
import { FragmentType, getFragmentData, graphql } from "@/types/gql";

export const CampaignCard_CampaignFragment = graphql(`
  fragment CampaignCard_CampaignFragment on Campaign {
    id
    name
    description
    status
    startDate
    endDate
    totalBudget
    imageUrl
    bookings {
      nodes {
        id
      }
    }
  }
`);

type Props = {
  data: FragmentType<typeof CampaignCard_CampaignFragment>;
};

export default function CampaignCard({ data }: Props) {
  const campaign = getFragmentData(CampaignCard_CampaignFragment, data);
  const startDate = new Date(campaign.startDate as string);
  const endDate = new Date(campaign.endDate as string);
  const dateRange = `${startDate.toLocaleDateString("en-US", { month: "short", day: "numeric" })} - ${endDate.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`;
  const bookingCount = campaign.bookings?.nodes?.length ?? 0;

  return (
    <MediaCard
      href={`/campaigns/${campaign.id}`}
      image={campaign.imageUrl}
      alt={campaign.name}
      title={campaign.name}
      description={campaign.description}
      indicator={{
        className: CAMPAIGN_STATUS.indicators[campaign.status],
        title: CAMPAIGN_STATUS.labels[campaign.status],
      }}
      badges={[
        {
          position: "top-right",
          content: CAMPAIGN_STATUS.labels[campaign.status],
          className:
            "text-muted-foreground bg-background p-1 tracking-wide uppercase",
        },
      ]}
      metaLeft={dateRange}
      metaRight={`${formatCurrency(Number(campaign.totalBudget))} · ${bookingCount} booking${bookingCount !== 1 ? "s" : ""}`}
    />
  );
}
