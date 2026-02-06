import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/primitives/card";
import { Badge } from "@/components/primitives/badge";
import { Separator } from "@/components/primitives/separator";
import { formatCurrency } from "@/lib/utils";
import { PAYOUT_STAGE, PAYOUT_STATUS } from "@/lib/constants";
import type { PayoutStage, PayoutStatus } from "@/types/gql/graphql";

type Props = {
  booking: {
    totalDays: number;
    pricePerDay: unknown;
    subtotalAmount: unknown;
    installationFee: unknown;
    platformFeeAmount: unknown;
    ownerPayoutAmount: unknown;
    payouts: Array<{
      id: unknown;
      amount: unknown;
      stage: PayoutStage;
      status: PayoutStatus;
      processedAt?: unknown;
    }>;
  };
};

export default function FinancialSummary({ booking }: Props) {
  const pricePerDay = Number(booking.pricePerDay);
  const subtotal = Number(booking.subtotalAmount);
  const installationFee = Number(booking.installationFee);
  const platformFee = Number(booking.platformFeeAmount);
  const ownerPayout = Number(booking.ownerPayoutAmount);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Financial Summary</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex flex-col gap-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">
              {formatCurrency(pricePerDay)} × {booking.totalDays} days
            </span>
            <span>{formatCurrency(subtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Installation fee</span>
            <span>{formatCurrency(installationFee)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Platform fee</span>
            <span className="text-muted-foreground">
              -{formatCurrency(platformFee)}
            </span>
          </div>
        </div>

        <Separator />

        <div className="flex justify-between font-medium">
          <span>Your Payout</span>
          <span className="text-lg">{formatCurrency(ownerPayout)}</span>
        </div>

        {booking.payouts.length > 0 && (
          <>
            <Separator />
            <div className="flex flex-col gap-3">
              <h4 className="text-sm font-medium">Payout Schedule</h4>
              {booking.payouts.map((payout) => (
                <div
                  key={payout.id as string}
                  className="bg-muted/50 flex items-center justify-between rounded-lg p-3"
                >
                  <div className="flex flex-col gap-0.5">
                    <span className="text-sm font-medium">
                      {PAYOUT_STAGE.labels[payout.stage]}
                    </span>
                    <span className="text-muted-foreground text-xs">
                      {PAYOUT_STAGE.descriptions[payout.stage]}
                    </span>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className="text-sm font-medium">
                      {formatCurrency(Number(payout.amount))}
                    </span>
                    <Badge
                      variant={PAYOUT_STATUS.variants[payout.status]}
                      className="text-xs"
                    >
                      {PAYOUT_STATUS.labels[payout.status]}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
