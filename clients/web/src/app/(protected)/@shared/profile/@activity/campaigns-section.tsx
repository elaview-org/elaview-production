"use client";

import { useState } from "react";
import { Button } from "@/components/primitives/button";
import { Card, CardContent } from "@/components/primitives/card";
import { Badge } from "@/components/primitives/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/primitives/tooltip";
import {
  IconChevronLeft,
  IconChevronRight,
  IconSpeakerphone,
} from "@tabler/icons-react";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/primitives/empty";
import { formatCurrency, formatDate } from "@/lib/core/utils";
import { CampaignStatus } from "@/types/gql";

type Campaign = {
  id: string;
  name: string;
  status: CampaignStatus;
  startDate: string | null;
  endDate: string | null;
  totalSpend: number;
  spacesCount: number;
};

type Props = {
  userName: string;
  campaigns: Campaign[];
};

const STATUS_VARIANTS: Record<string, "default" | "secondary" | "outline"> = {
  [CampaignStatus.Active]: "default",
  [CampaignStatus.Completed]: "secondary",
  [CampaignStatus.Draft]: "outline",
  [CampaignStatus.Submitted]: "outline",
  [CampaignStatus.Cancelled]: "outline",
};

const CAMPAIGNS_PER_PAGE = 3;

export default function CampaignsSection({ userName, campaigns }: Props) {
  const [page, setPage] = useState(0);

  const totalPages = Math.ceil(campaigns.length / CAMPAIGNS_PER_PAGE);
  const startIndex = page * CAMPAIGNS_PER_PAGE;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">
          Recent campaigns by {userName.split(" ")[0]}
        </h2>
        {totalPages > 1 && (
          <div className="flex gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  disabled={page === 0}
                  onClick={() => setPage((p) => p - 1)}
                >
                  <IconChevronLeft className="size-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Previous</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  disabled={page >= totalPages - 1}
                  onClick={() => setPage((p) => p + 1)}
                >
                  <IconChevronRight className="size-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Next</TooltipContent>
            </Tooltip>
          </div>
        )}
      </div>

      {campaigns.length === 0 ? (
        <Empty className="py-16">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <IconSpeakerphone />
            </EmptyMedia>
            <EmptyTitle>No campaigns yet</EmptyTitle>
            <EmptyDescription>
              Your advertising campaigns will appear here once you create one
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {campaigns
            .slice(startIndex, startIndex + CAMPAIGNS_PER_PAGE)
            .map((campaign) => (
              <Card key={campaign.id}>
                <CardContent className="flex flex-col gap-3 pt-5">
                  <div className="flex items-center justify-between">
                    <Badge
                      variant={STATUS_VARIANTS[campaign.status] ?? "outline"}
                    >
                      {campaign.status}
                    </Badge>
                    <span className="text-muted-foreground text-xs">
                      {campaign.spacesCount}{" "}
                      {campaign.spacesCount === 1 ? "space" : "spaces"}
                    </span>
                  </div>
                  <h3 className="font-medium">{campaign.name}</h3>
                  <div className="text-muted-foreground space-y-1 text-sm">
                    {campaign.startDate && campaign.endDate && (
                      <p>
                        {formatDate(campaign.startDate)} -{" "}
                        {formatDate(campaign.endDate)}
                      </p>
                    )}
                    {campaign.totalSpend > 0 && (
                      <p className="text-foreground font-medium">
                        {formatCurrency(campaign.totalSpend)}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
        </div>
      )}
    </div>
  );
}
