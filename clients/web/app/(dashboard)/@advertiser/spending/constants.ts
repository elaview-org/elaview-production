import { PaymentStatus } from "@/types/gql/graphql";

export const PAYMENT_STATUS_INDICATORS: Record<PaymentStatus, string> = {
  [PaymentStatus.Pending]: "bg-amber-500",
  [PaymentStatus.Succeeded]: "bg-emerald-500",
  [PaymentStatus.Failed]: "bg-destructive",
  [PaymentStatus.Refunded]: "bg-blue-500",
  [PaymentStatus.PartiallyRefunded]: "bg-blue-500",
};
