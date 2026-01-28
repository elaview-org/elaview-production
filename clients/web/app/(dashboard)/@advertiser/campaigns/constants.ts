import {
  IconFileDescription,
  IconCalendar,
  IconPhoto,
  IconEye,
} from "@tabler/icons-react";
import { CampaignStatus } from "@/types/gql/graphql";
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

export const TOOLBAR_PROPS = {
  searchTarget: "campaigns",
  filters: [
    {
      placeholder: "Status",
      fields: [
        { value: "draft", label: "Draft" },
        { value: "submitted", label: "Submitted" },
        { value: "active", label: "Active" },
        { value: "completed", label: "Completed" },
        { value: "cancelled", label: "Cancelled" },
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
