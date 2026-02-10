import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/primitives/card";
import { Badge } from "@/components/primitives/badge";
import { Separator } from "@/components/primitives/separator";
import { formatCurrency } from "@/lib/utils";
import { PAYMENT_STATUS } from "@/lib/constants";
import type { PaymentStatus } from "@/types/gql/graphql";

type Props = {
  booking: {
    totalDays: number;
    pricePerDay: unknown;
    subtotalAmount: unknown;
    installationFee: unknown;
    platformFeeAmount: unknown;
    totalAmount: unknown;
    payments: Array<{
      id: unknown;
      amount: unknown;
      status: PaymentStatus;
      createdAt?: unknown;
    }>;
  };
};

export default function FinancialSummary({ booking }: Props) {
  const pricePerDay = Number(booking.pricePerDay);
  const subtotal = Number(booking.subtotalAmount);
  const installationFee = Number(booking.installationFee);
  const platformFee = Number(booking.platformFeeAmount);
  const total = Number(booking.totalAmount);

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
              {formatCurrency(platformFee)}
            </span>
          </div>
        </div>

        <Separator />

        <div className="flex justify-between font-medium">
          <span>Total</span>
          <span className="text-lg">{formatCurrency(total)}</span>
        </div>

        {booking.payments.length > 0 && (
          <>
            <Separator />
            <div className="flex flex-col gap-3">
              <h4 className="text-sm font-medium">Payment History</h4>
              {booking.payments.map((payment) => (
                <div
                  key={payment.id as string}
                  className="bg-muted/50 flex items-center justify-between rounded-lg p-3"
                >
                  <span className="text-sm font-medium">
                    {formatCurrency(Number(payment.amount))}
                  </span>
                  <Badge
                    variant={PAYMENT_STATUS.variants[payment.status]}
                    className="text-xs"
                  >
                    {PAYMENT_STATUS.labels[payment.status]}
                  </Badge>
                </div>
              ))}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
