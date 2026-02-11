"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/primitives/card";
import PaymentSettingsForm from "@/app/(protected)/settings/@payment/payment-settings-form";

type PaymentMethod = {
  id: string;
  brand: string;
  last4: string;
  expMonth: number;
  expYear: number;
  isDefault: boolean;
};

type Props = {
  paymentMethods: PaymentMethod[];
};

export default function PaymentMethods({ paymentMethods }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment Methods</CardTitle>
        <CardDescription>
          Manage your saved cards for booking payments
        </CardDescription>
      </CardHeader>
      <CardContent>
        <PaymentSettingsForm paymentMethods={paymentMethods} />
      </CardContent>
    </Card>
  );
}
