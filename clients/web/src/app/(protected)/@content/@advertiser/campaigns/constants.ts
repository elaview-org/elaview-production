import {
  IconFileDescription,
  IconCalendar,
  IconPhoto,
  IconEye,
} from "@tabler/icons-react";
import { CampaignStatus, SortEnumType } from "@/types/gql/graphql";
import type { CampaignSortInput } from "@/types/gql/graphql";
import { ViewOptions } from "@/types/constants";

export const CAMPAIGN_STEPS = [
  { id: 1, label: "Details", icon: IconFileDescription },
  { id: 2, label: "Schedule", icon: IconCalendar },
  { id: 3, label: "Media", icon: IconPhoto },
  { id: 4, label: "Review", icon: IconEye },
] as const;

export const FILTER_TABS = [
  {
    key: "draft",
    label: "Drafts",
    statuses: [CampaignStatus.Draft],
  },
  {
    key: "active",
    label: "Active",
    statuses: [CampaignStatus.Active, CampaignStatus.Submitted],
  },
  {
    key: "completed",
    label: "Completed",
    statuses: [CampaignStatus.Completed],
  },
  {
    key: "all",
    label: "All",
    statuses: null,
  },
] as const;

export type FilterTabKey = (typeof FILTER_TABS)[number]["key"];

export function getStatusFilter(tabKey: FilterTabKey) {
  const tab = FILTER_TABS.find((t) => t.key === tabKey);
  if (!tab || tab.statuses === null) return undefined;
  return { status: { in: [...tab.statuses] } };
}

export function getSortInput(
  sortField?: string,
  sortOrder?: string
): CampaignSortInput[] | undefined {
  if (!sortField) return [{ createdAt: SortEnumType.Desc }];

  const order = sortOrder === "asc" ? SortEnumType.Asc : SortEnumType.Desc;

  switch (sortField) {
    case "createdAt":
      return [{ createdAt: order }];
    case "startDate":
      return [{ startDate: order }];
    case "totalBudget":
      return [{ totalBudget: order }];
    case "name":
      return [{ name: order }];
    default:
      return [{ createdAt: SortEnumType.Desc }];
  }
}

export const TOOLBAR_PROPS = {
  searchTarget: "campaigns",
  filters: [
    {
      key: "status",
      placeholder: "Status",
      fields: [
        { value: CampaignStatus.Draft, label: "Draft" },
        { value: CampaignStatus.Submitted, label: "Submitted" },
        { value: CampaignStatus.Active, label: "Active" },
        { value: CampaignStatus.Completed, label: "Completed" },
        { value: CampaignStatus.Cancelled, label: "Cancelled" },
      ],
    },
  ],
  sort: {
    fields: [
      { value: "createdAt", label: "Created Date" },
      { value: "startDate", label: "Start Date" },
      { value: "totalBudget", label: "Budget" },
    ],
  },
  views: new Set([ViewOptions.Grid, ViewOptions.Table]),
};
