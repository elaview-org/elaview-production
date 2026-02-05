import Link from "next/link";
import { Badge } from "@/components/primitives/badge";
import { Progress } from "@/components/primitives/progress";
import { formatCurrency, formatDateRange } from "@/lib/utils";
import { CAMPAIGN_STATUS_CONFIG } from "../constants";
import { graphql, type FragmentType, getFragmentData } from "@/types/gql";

export const AdvertiserOverviewActiveCampaignsCampaignCard_CampaignFragment =
  graphql(`
    fragment AdvertiserOverviewActiveCampaignsCampaignCard_CampaignFragment on Campaign {
      id
      name
      status
      spacesCount
      totalBudget
      totalSpend
      startDate
      endDate
    }
  `);

type Props = {
  data: FragmentType<
    typeof AdvertiserOverviewActiveCampaignsCampaignCard_CampaignFragment
  >;
};

export default function CampaignCard({ data }: Props) {
  const campaign = getFragmentData(
    AdvertiserOverviewActiveCampaignsCampaignCard_CampaignFragment,
    data
  );

  const statusConfig =
    CAMPAIGN_STATUS_CONFIG[
      campaign.status as keyof typeof CAMPAIGN_STATUS_CONFIG
    ] ?? CAMPAIGN_STATUS_CONFIG.ACTIVE;

  const budget = campaign.totalBudget ?? 0;
  const spent = campaign.totalSpend ?? 0;
  const spentPercent = budget > 0 ? Math.min(100, (spent / budget) * 100) : 0;

  return (
    <Link
      href={`/campaigns/${campaign.id}`}
      className="hover:bg-muted/50 flex flex-col gap-3 rounded-lg border p-4 transition-colors"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex flex-col gap-0.5">
          <span className="font-medium">{campaign.name}</span>
          <span className="text-muted-foreground text-sm">
            {campaign.spacesCount}{" "}
            {campaign.spacesCount === 1 ? "space" : "spaces"}
          </span>
        </div>
        <Badge variant={statusConfig.variant}>{statusConfig.label}</Badge>
      </div>

      {budget > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Budget</span>
            <span className="font-medium">
              {formatCurrency(spent)} / {formatCurrency(budget)}
            </span>
          </div>
          <Progress value={spentPercent} className="h-2" />
        </div>
      )}

      {campaign.startDate && campaign.endDate && (
        <span className="text-muted-foreground text-xs">
          {formatDateRange(campaign.startDate, campaign.endDate)}
        </span>
      )}
    </Link>
  );
}
