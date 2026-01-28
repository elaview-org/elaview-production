"use client";

import Link from "next/link";
import { Badge } from "@/components/primitives/badge";
import { Progress } from "@/components/primitives/progress";
import SectionCard, { SectionCardSkeleton } from "@/components/composed/section-card";
import { Skeleton } from "@/components/primitives/skeleton";
import { formatCurrency, formatDateRange } from "@/lib/utils";
import { CAMPAIGN_STATUS_CONFIG, type CampaignStatus } from "./constants";
import mock from "./mock.json";

type ActiveCampaign = {
  id: string;
  name: string;
  status: CampaignStatus;
  spaces: number;
  budget: number;
  spent: number;
  startDate: string;
  endDate: string;
};

function CampaignCard({ campaign }: { campaign: ActiveCampaign }) {
  const statusConfig = CAMPAIGN_STATUS_CONFIG[campaign.status];
  const spentPercent = Math.min(100, (campaign.spent / campaign.budget) * 100);

  return (
    <Link
      href={`/campaigns/${campaign.id}`}
      className="hover:bg-muted/50 flex flex-col gap-3 rounded-lg border p-4 transition-colors"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex flex-col gap-0.5">
          <span className="font-medium">{campaign.name}</span>
          <span className="text-muted-foreground text-sm">
            {campaign.spaces} {campaign.spaces === 1 ? "space" : "spaces"}
          </span>
        </div>
        <Badge variant={statusConfig.variant}>{statusConfig.label}</Badge>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Budget</span>
          <span className="font-medium">
            {formatCurrency(campaign.spent)} / {formatCurrency(campaign.budget)}
          </span>
        </div>
        <Progress value={spentPercent} className="h-2" />
      </div>

      <span className="text-muted-foreground text-xs">
        {formatDateRange(campaign.startDate, campaign.endDate)}
      </span>
    </Link>
  );
}

export default function ActiveCampaigns() {
  const campaigns = mock.activeCampaigns as ActiveCampaign[];

  if (campaigns.length === 0) {
    return null;
  }

  return (
    <SectionCard
      title="Active Campaigns"
      description="Campaigns in progress"
      count={campaigns.filter((c) => c.status === "ACTIVE").length}
      viewAllHref="/campaigns"
    >
      <div className="flex flex-col gap-3">
        {campaigns.slice(0, 4).map((campaign) => (
          <CampaignCard key={campaign.id} campaign={campaign} />
        ))}
      </div>
    </SectionCard>
  );
}

export function ActiveCampaignsSkeleton() {
  return (
    <SectionCardSkeleton>
      <div className="flex flex-col gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex flex-col gap-3 rounded-lg border p-4">
            <div className="flex items-start justify-between">
              <div className="flex flex-col gap-1">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-20" />
              </div>
              <Skeleton className="h-5 w-16 rounded-full" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Skeleton className="h-3 w-12" />
                <Skeleton className="h-3 w-24" />
              </div>
              <Skeleton className="h-2 w-full" />
            </div>
            <Skeleton className="h-3 w-28" />
          </div>
        ))}
      </div>
    </SectionCardSkeleton>
  );
}
