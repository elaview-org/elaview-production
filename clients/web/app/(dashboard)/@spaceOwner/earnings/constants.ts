import { PayoutStage, PayoutStatus } from "@/types/gql/graphql";
import { ViewOptions } from "@/types/constants";

export const PAYOUT_STATUS_LABELS: Record<PayoutStatus, string> = {
  [PayoutStatus.Pending]: "Pending",
  [PayoutStatus.Processing]: "Processing",
  [PayoutStatus.Completed]: "Completed",
  [PayoutStatus.Failed]: "Failed",
  [PayoutStatus.PartiallyPaid]: "Partial",
};

export const PAYOUT_STATUS_VARIANTS: Record<
  PayoutStatus,
  "default" | "secondary" | "destructive" | "outline"
> = {
  [PayoutStatus.Pending]: "outline",
  [PayoutStatus.Processing]: "secondary",
  [PayoutStatus.Completed]: "default",
  [PayoutStatus.Failed]: "destructive",
  [PayoutStatus.PartiallyPaid]: "secondary",
};

export const PAYOUT_STAGE_LABELS: Record<PayoutStage, string> = {
  [PayoutStage.Stage1]: "Stage 1",
  [PayoutStage.Stage2]: "Stage 2",
};

export const PAYOUT_STAGE_DESCRIPTIONS: Record<PayoutStage, string> = {
  [PayoutStage.Stage1]: "Print & Install",
  [PayoutStage.Stage2]: "Rental Fee",
};

export const FILTER_TABS = [
  {
    key: "all",
    label: "All",
    statuses: null,
  },
  {
    key: "pending",
    label: "Pending",
    statuses: [PayoutStatus.Pending, PayoutStatus.Processing],
  },
  {
    key: "completed",
    label: "Completed",
    statuses: [PayoutStatus.Completed],
  },
  {
    key: "failed",
    label: "Failed",
    statuses: [PayoutStatus.Failed, PayoutStatus.PartiallyPaid],
  },
] as const;

export type FilterTabKey = (typeof FILTER_TABS)[number]["key"];

export function getStatusFilter(tabKey: FilterTabKey) {
  const tab = FILTER_TABS.find((t) => t.key === tabKey);
  if (!tab || tab.statuses === null) return undefined;
  return { status: { in: [...tab.statuses] } };
}

export const TOOLBAR_PROPS = {
  searchTarget: "payouts",
  filters: [
    {
      placeholder: "Status",
      fields: [
        { value: "pending", label: "Pending" },
        { value: "processing", label: "Processing" },
        { value: "completed", label: "Completed" },
        { value: "failed", label: "Failed" },
      ],
    },
    {
      placeholder: "Stage",
      fields: [
        { value: "stage1", label: "Stage 1 (Print & Install)" },
        { value: "stage2", label: "Stage 2 (Rental Fee)" },
      ],
    },
  ],
  sort: {
    fields: [
      { value: "processedAt", label: "Date" },
      { value: "amount", label: "Amount" },
    ],
  },
  views: new Set([ViewOptions.Table]),
};