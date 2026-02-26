import { CampaignStatus } from "@/types/gql/graphql";

type ActionConfig = {
  label: string;
  variant: "default" | "destructive" | "outline" | "secondary";
  action: "submit" | "cancel" | "delete";
};

export const STATUS_ACTIONS: Partial<Record<CampaignStatus, ActionConfig[]>> = {
  [CampaignStatus.Draft]: [
    { label: "Submit for Review", variant: "default", action: "submit" },
    { label: "Delete Campaign", variant: "destructive", action: "delete" },
  ],
  [CampaignStatus.Submitted]: [
    { label: "Cancel Campaign", variant: "destructive", action: "cancel" },
  ],
  [CampaignStatus.Active]: [
    { label: "Cancel Campaign", variant: "destructive", action: "cancel" },
  ],
};
