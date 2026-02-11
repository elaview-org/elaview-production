import { PaymentStatus } from "@/types/gql/graphql";
import { ViewOptions } from "@/types/constants";

export const FILTER_TABS = [
  {
    key: "all",
    label: "All",
    statuses: null,
  },
  {
    key: "pending",
    label: "Pending",
    statuses: [PaymentStatus.Pending],
  },
  {
    key: "succeeded",
    label: "Succeeded",
    statuses: [PaymentStatus.Succeeded],
  },
  {
    key: "failed",
    label: "Failed",
    statuses: [PaymentStatus.Failed],
  },
  {
    key: "refunded",
    label: "Refunded",
    statuses: [PaymentStatus.Refunded, PaymentStatus.PartiallyRefunded],
  },
] as const;

export type FilterTabKey = (typeof FILTER_TABS)[number]["key"];

export function getStatusFilter(tabKey: FilterTabKey) {
  const tab = FILTER_TABS.find((t) => t.key === tabKey);
  if (!tab || tab.statuses === null) return undefined;
  return { status: { in: [...tab.statuses] } };
}

export const TOOLBAR_PROPS = {
  searchTarget: "payments",
  filters: [
    {
      key: "status",
      placeholder: "Status",
      fields: [
        { value: "pending", label: "Pending" },
        { value: "succeeded", label: "Succeeded" },
        { value: "failed", label: "Failed" },
        { value: "refunded", label: "Refunded" },
      ],
    },
  ],
  sort: {
    fields: [
      { value: "createdAt", label: "Date" },
      { value: "amount", label: "Amount" },
    ],
  },
  views: new Set([ViewOptions.Table]),
};

export const PAYMENT_TYPE_LABELS: Record<string, string> = {
  FULL: "Full Payment",
  DEPOSIT: "Deposit",
  BALANCE: "Balance",
};
