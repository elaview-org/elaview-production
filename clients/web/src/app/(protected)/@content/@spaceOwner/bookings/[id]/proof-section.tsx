import Image from "next/image";
import {
  IconAlertCircle,
  IconClock,
  IconCheck,
  IconEye,
  IconMessageCircle,
  IconX,
} from "@tabler/icons-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/primitives/card";
import { Badge } from "@/components/primitives/badge";
import { formatDate } from "@/lib/core/utils";
import type { ProofStatus } from "@/types/gql/graphql";

type Props = {
  proof: {
    id: unknown;
    status: ProofStatus;
    photos: unknown;
    submittedAt?: string | null;
    autoApproveAt?: string | null;
    rejectionReason?: string | null;
  };
};

const STATUS_CONFIG: Record<
  ProofStatus,
  {
    label: string;
    variant: "default" | "secondary" | "destructive" | "outline";
    icon: typeof IconClock;
  }
> = {
  PENDING: { label: "Pending Review", variant: "outline", icon: IconClock },
  APPROVED: { label: "Approved", variant: "default", icon: IconCheck },
  REJECTED: { label: "Rejected", variant: "destructive", icon: IconX },
  CORRECTION_REQUESTED: {
    label: "Correction Requested",
    variant: "secondary",
    icon: IconMessageCircle,
  },
  DISPUTED: {
    label: "Disputed",
    variant: "destructive",
    icon: IconAlertCircle,
  },
  UNDER_REVIEW: { label: "Under Review", variant: "outline", icon: IconEye },
};

export default function ProofSection({ proof }: Props) {
  const photos = proof.photos as string[];
  const config = STATUS_CONFIG[proof.status];
  const StatusIcon = config.icon;

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between space-y-0">
        <CardTitle>Verification Photos</CardTitle>
        <Badge variant={config.variant}>
          <StatusIcon className="mr-1 size-3" />
          {config.label}
        </Badge>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {photos.length > 0 ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {photos.map((photo, index) => (
              <div
                key={index}
                className="relative aspect-square overflow-hidden rounded-lg"
              >
                <Image
                  src={photo}
                  alt={`Verification photo ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground text-sm">
            No verification photos uploaded yet.
          </p>
        )}

        {proof.submittedAt && (
          <p className="text-muted-foreground text-xs">
            Submitted {formatDate(proof.submittedAt as string)}
          </p>
        )}

        {proof.status === "PENDING" && proof.autoApproveAt && (
          <p className="text-muted-foreground text-xs">
            Auto-approves {formatDate(proof.autoApproveAt as string)}
          </p>
        )}

        {proof.status === "REJECTED" && proof.rejectionReason && (
          <div className="bg-destructive/10 rounded-lg p-3">
            <p className="text-destructive text-sm font-medium">
              Rejection Reason
            </p>
            <p className="text-muted-foreground text-sm">
              {proof.rejectionReason}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
