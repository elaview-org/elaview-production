import Link from "next/link";
import { Button } from "@/components/primitives/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/primitives/card";
import { Calendar, DollarSign } from "lucide-react";

interface CampaignInfoCardProps {
  campaign?: {
    id: string;
    name: string;
    startDate: string;
    endDate: string;
    budget?: number;
    spent?: number;
  };
}

export function CampaignInfoCard({ campaign }: CampaignInfoCardProps) {
  if (!campaign) {
    return null;
  }

  const calculateWeeks = (start: string, end: string): number => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.ceil(diffDays / 7);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Campaign Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <p className="font-medium">{campaign.name}</p>
          </div>
          <div className="ml-6 space-y-1 text-sm text-muted-foreground">
            <p>Start: {formatDate(campaign.startDate)}</p>
            <p>End: {formatDate(campaign.endDate)}</p>
            <p>Duration: {calculateWeeks(campaign.startDate, campaign.endDate)} weeks</p>
          </div>
        </div>

        {campaign.budget !== undefined && (
          <div className="border-t pt-3 space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <DollarSign className="h-4 w-4 text-muted-foreground" />
              <div className="flex-1">
                <p>
                  Budget: <span className="font-medium">${campaign.budget.toLocaleString()}</span>
                </p>
                {campaign.spent !== undefined && (
                  <p>
                    Spent: <span className="font-medium">${campaign.spent.toLocaleString()}</span>
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        <Button variant="outline" size="sm" asChild>
          <Link href={`/campaigns/${campaign.id}`}>View Campaign</Link>
        </Button>
      </CardContent>
    </Card>
  );
}
