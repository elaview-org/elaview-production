import { BookingStatus } from "@/types/gql/graphql";

export const TIMELINE_STEPS = [
  {
    status: BookingStatus.PendingApproval,
    label: "Pending",
    description: "Waiting for your approval",
  },
  {
    status: BookingStatus.Approved,
    label: "Approved",
    description: "Waiting for payment",
  },
  {
    status: BookingStatus.Paid,
    label: "Paid",
    description: "Download the creative file",
  },
  {
    status: BookingStatus.FileDownloaded,
    label: "Downloaded",
    description: "Print and install the ad",
  },
  {
    status: BookingStatus.Installed,
    label: "Installed",
    description: "Upload verification photos",
  },
  {
    status: BookingStatus.Verified,
    label: "Verified",
    description: "Awaiting advertiser approval",
  },
  {
    status: BookingStatus.Completed,
    label: "Completed",
    description: "Booking completed successfully",
  },
] as const;

export const TERMINAL_STATUSES = [
  BookingStatus.Rejected,
  BookingStatus.Cancelled,
  BookingStatus.Disputed,
] as const;

export function getTimelineProgress(status: BookingStatus): number {
  if (
    TERMINAL_STATUSES.includes(status as (typeof TERMINAL_STATUSES)[number])
  ) {
    return -1;
  }
  const index = TIMELINE_STEPS.findIndex((step) => step.status === status);
  return index === -1 ? 0 : index;
}

export function isStepComplete(
  stepStatus: BookingStatus,
  currentStatus: BookingStatus
): boolean {
  const stepIndex = TIMELINE_STEPS.findIndex((s) => s.status === stepStatus);
  const currentIndex = TIMELINE_STEPS.findIndex(
    (s) => s.status === currentStatus
  );
  return currentIndex > stepIndex;
}

export function isStepCurrent(
  stepStatus: BookingStatus,
  currentStatus: BookingStatus
): boolean {
  return stepStatus === currentStatus;
}

type ActionConfig = {
  label: string;
  variant: "default" | "destructive" | "outline" | "secondary";
  action: "approve" | "reject" | "download" | "markInstalled" | "message";
};

export const STATUS_ACTIONS: Partial<Record<BookingStatus, ActionConfig[]>> = {
  [BookingStatus.PendingApproval]: [
    { label: "Accept Booking", variant: "default", action: "approve" },
    { label: "Reject", variant: "destructive", action: "reject" },
  ],
  [BookingStatus.Paid]: [
    { label: "Download File", variant: "default", action: "download" },
  ],
  [BookingStatus.FileDownloaded]: [
    { label: "Mark as Installed", variant: "default", action: "markInstalled" },
  ],
};
