import Image from "next/image";
import { IconAlertTriangle, IconCheck } from "@tabler/icons-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/primitives/card";
import { Badge } from "@/components/primitives/badge";
import { formatDate } from "@/lib/utils";
import type { DisputeIssueType } from "@/types/gql/graphql";

type Props = {
  dispute: {
    id: unknown;
    issueType: DisputeIssueType;
    reason: string;
    photos: unknown;
    disputedAt: string;
    resolutionAction?: string | null;
    resolutionNotes?: string | null;
    resolvedAt?: string | null;
  };
};

const ISSUE_TYPE_LABELS: Record<DisputeIssueType, string> = {
  DAMAGE_TO_CREATIVE: "Damage to Creative",
  MISLEADING_LISTING: "Misleading Listing",
  NOT_VISIBLE: "Not Visible",
  POOR_QUALITY: "Poor Quality",
  SAFETY_ISSUE: "Safety Issue",
  WRONG_LOCATION: "Wrong Location",
};

export default function DisputeSection({ dispute }: Props) {
  const photos = dispute.photos as string[];
  const isResolved = !!dispute.resolvedAt;

  return (
    <Card className="border-destructive/50">
      <CardHeader className="flex-row items-center justify-between space-y-0">
        <div className="flex items-center gap-2">
          <IconAlertTriangle className="text-destructive size-5" />
          <CardTitle>Dispute</CardTitle>
        </div>
        <Badge variant={isResolved ? "default" : "destructive"}>
          {isResolved ? (
            <>
              <IconCheck className="mr-1 size-3" />
              Resolved
            </>
          ) : (
            "Open"
          )}
        </Badge>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex flex-col gap-3">
          <div>
            <p className="text-muted-foreground text-xs uppercase">
              Issue Type
            </p>
            <p className="font-medium">
              {ISSUE_TYPE_LABELS[dispute.issueType]}
            </p>
          </div>

          <div>
            <p className="text-muted-foreground text-xs uppercase">Reason</p>
            <p className="text-sm">{dispute.reason}</p>
          </div>

          <div>
            <p className="text-muted-foreground text-xs uppercase">
              Reported On
            </p>
            <p className="text-sm">{formatDate(dispute.disputedAt)}</p>
          </div>
        </div>

        {photos.length > 0 && (
          <div>
            <p className="text-muted-foreground mb-2 text-xs uppercase">
              Evidence Photos
            </p>
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
              {photos.map((photo, index) => (
                <div
                  key={index}
                  className="relative aspect-square overflow-hidden rounded-lg"
                >
                  <Image
                    src={photo}
                    alt={`Dispute evidence ${index + 1}`}
                    fill
                    className="object-cover"
                    sizes="25vw"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {isResolved && (
          <div className="bg-muted/50 rounded-lg p-3">
            <p className="text-muted-foreground mb-1 text-xs uppercase">
              Resolution
            </p>
            {dispute.resolutionAction && (
              <p className="text-sm font-medium">{dispute.resolutionAction}</p>
            )}
            {dispute.resolutionNotes && (
              <p className="text-muted-foreground mt-1 text-sm">
                {dispute.resolutionNotes}
              </p>
            )}
            <p className="text-muted-foreground mt-2 text-xs">
              Resolved on {formatDate(dispute.resolvedAt!)}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
