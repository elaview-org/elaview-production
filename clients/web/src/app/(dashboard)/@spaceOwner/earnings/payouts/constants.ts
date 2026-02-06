import { PayoutStage, PayoutStatus } from "@/types/gql/graphql";
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

export function getStageFilter(stage: string | undefined) {
  if (!stage) return undefined;

  switch (stage) {
    case "stage1":
      return { stage: { eq: PayoutStage.Stage1 } };
    case "stage2":
      return { stage: { eq: PayoutStage.Stage2 } };
    default:
      return undefined;
  }
}

export const TOOLBAR_PROPS = {
  searchTarget: "payouts",
  filters: [
    {
      key: "status",
      placeholder: "Status",
      fields: [
        { value: "pending", label: "Pending" },
        { value: "processing", label: "Processing" },
        { value: "completed", label: "Completed" },
        { value: "failed", label: "Failed" },
      ],
    },
    {
      key: "stage",
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
