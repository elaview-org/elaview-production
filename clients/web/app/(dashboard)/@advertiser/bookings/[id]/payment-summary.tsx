import { Button } from "@/components/primitives/button";
import { Separator } from "@/components/primitives/separator";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/primitives/card";
import { Download } from "lucide-react";

interface PaymentSummaryProps {
  booking?: {
    pricePerWeek?: number;
    totalWeeks?: number;
    platformFee?: number;
    printInstallFee?: number;
    total?: number;
    paidAt?: string | null;
  };
  payment?: {
    cardBrand?: string;
    cardLast4?: string;
  };
}

export default function PaymentSummary({
  booking,
  payment,
}: PaymentSummaryProps) {
  const formatCurrency = (amount?: number): string => {
    if (amount === undefined) return "$0.00";
    return `$${amount.toLocaleString("en-US", { minimumFractionDigits: 2 })}`;
  };

  const formatDate = (dateString?: string | null): string => {
    if (!dateString) return "Not paid yet";
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const basePrice =
    booking?.pricePerWeek && booking?.totalWeeks
      ? booking.pricePerWeek * booking.totalWeeks
      : 0;

  const breakdown = [
    { label: "Base Price", value: basePrice },
    { label: "Platform Fee", value: booking?.platformFee || 0 },
    { label: "Print/Install Fee", value: booking?.printInstallFee || 0 },
  ].filter((item) => item.value > 0);

  const total =
    booking?.total || breakdown.reduce((acc, item) => acc + item.value, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Payment Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="space-y-2">
          {breakdown.map((item) => (
            <div
              key={item.label}
              className="flex items-center justify-between text-sm"
            >
              <span className="text-muted-foreground">{item.label}</span>
              <span>{formatCurrency(item.value)}</span>
            </div>
          ))}
        </div>

        <Separator />

        <div className="flex items-center justify-between font-semibold">
          <span>Total Paid</span>
          <span>{formatCurrency(total)}</span>
        </div>

        {(payment?.cardBrand || payment?.cardLast4 || booking?.paidAt) && (
          <div className="space-y-2 border-t pt-3 text-sm">
            {payment?.cardBrand && payment?.cardLast4 && (
              <p className="text-muted-foreground">
                Payment Method: {payment.cardBrand} •••• {payment.cardLast4}
              </p>
            )}
            {booking?.paidAt && (
              <p className="text-muted-foreground">
                Paid: {formatDate(booking.paidAt)}
              </p>
            )}
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button variant="outline" size="sm" className="w-full">
          <Download className="mr-2 h-4 w-4" />
          Download Receipt
        </Button>
      </CardFooter>
    </Card>
  );
}
