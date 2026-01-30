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
import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";
import { formatCurrency, formatDate } from "@/lib/utils";
import mockData from "./mock.json";

type Props = {
  userName: string;
};

const STATUS_VARIANTS: Record<string, "default" | "secondary" | "outline"> = {
  ACTIVE: "default",
  COMPLETED: "secondary",
  PENDING: "outline",
};

export default function CampaignsSection({ userName }: Props) {
  const [page, setPage] = useState(0);

  const CAMPAIGNS_PER_PAGE = 3;
  const campaigns = mockData.campaigns;
  const totalPages = Math.ceil(campaigns.length / CAMPAIGNS_PER_PAGE);
  const startIndex = page * CAMPAIGNS_PER_PAGE;

  if (campaigns.length === 0) {
    return null;
  }

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
                    {campaign.spaces}{" "}
                    {campaign.spaces === 1 ? "space" : "spaces"}
                  </span>
                </div>
                <h3 className="font-medium">{campaign.name}</h3>
                <div className="text-muted-foreground space-y-1 text-sm">
                  <p>
                    {formatDate(campaign.startDate)} -{" "}
                    {formatDate(campaign.endDate)}
                  </p>
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
    </div>
  );
}
