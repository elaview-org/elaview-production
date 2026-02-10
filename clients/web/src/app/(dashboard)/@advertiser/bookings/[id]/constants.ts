import { BookingStatus } from "@/types/gql/graphql";

export const TIMELINE_STEPS = [
  {
    status: BookingStatus.PendingApproval,
    label: "Pending",
    description: "Waiting for owner approval",
  },
  {
    status: BookingStatus.Approved,
    label: "Approved",
    description: "Ready to pay",
  },
  {
    status: BookingStatus.Paid,
    label: "Paid",
    description: "Owner downloading file",
  },
  {
    status: BookingStatus.FileDownloaded,
    label: "Downloaded",
    description: "Owner printing & installing",
  },
  {
    status: BookingStatus.Installed,
    label: "Installed",
    description: "Owner uploading proof",
  },
  {
    status: BookingStatus.Verified,
    label: "Verified",
    description: "Review installation",
  },
  {
    status: BookingStatus.Completed,
    label: "Completed",
    description: "Booking completed",
  },
] as const;

export const TERMINAL_STATUSES = [
  BookingStatus.Rejected,
  BookingStatus.Cancelled,
  BookingStatus.Disputed,
] as const;

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
  action: "approveProof" | "dispute" | "cancel" | "message";
};

export const STATUS_ACTIONS: Partial<Record<BookingStatus, ActionConfig[]>> = {
  [BookingStatus.Verified]: [
    {
      label: "Approve Installation",
      variant: "default",
      action: "approveProof",
    },
    { label: "Open Dispute", variant: "destructive", action: "dispute" },
  ],
  [BookingStatus.PendingApproval]: [
    { label: "Cancel Request", variant: "destructive", action: "cancel" },
  ],
  [BookingStatus.Approved]: [
    { label: "Cancel Booking", variant: "destructive", action: "cancel" },
  ],
};
