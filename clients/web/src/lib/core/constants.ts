import {
  BookingStatus,
  CampaignStatus,
  PaymentStatus,
  PayoutStage,
  PayoutStatus,
  SpaceStatus,
  SpaceType,
} from "@/types/gql/graphql";

export type BadgeVariant = "default" | "secondary" | "destructive" | "outline";

export const BOOKING_STATUS = {
  labels: {
    [BookingStatus.PendingApproval]: "Pending",
    [BookingStatus.Approved]: "Approved",
    [BookingStatus.Paid]: "Paid",
    [BookingStatus.FileDownloaded]: "Downloaded",
    [BookingStatus.Installed]: "Installed",
    [BookingStatus.Verified]: "Verified",
    [BookingStatus.Completed]: "Completed",
    [BookingStatus.Disputed]: "Disputed",
    [BookingStatus.Rejected]: "Rejected",
    [BookingStatus.Cancelled]: "Cancelled",
  } as Record<BookingStatus, string>,

  variants: {
    [BookingStatus.PendingApproval]: "outline",
    [BookingStatus.Approved]: "secondary",
    [BookingStatus.Paid]: "default",
    [BookingStatus.FileDownloaded]: "default",
    [BookingStatus.Installed]: "default",
    [BookingStatus.Verified]: "default",
    [BookingStatus.Completed]: "default",
    [BookingStatus.Disputed]: "destructive",
    [BookingStatus.Rejected]: "destructive",
    [BookingStatus.Cancelled]: "secondary",
  } as Record<BookingStatus, BadgeVariant>,

  indicators: {
    [BookingStatus.PendingApproval]: "bg-amber-500",
    [BookingStatus.Approved]: "bg-blue-500",
    [BookingStatus.Paid]: "bg-blue-500",
    [BookingStatus.FileDownloaded]: "bg-blue-500",
    [BookingStatus.Installed]: "bg-blue-500",
    [BookingStatus.Verified]: "bg-emerald-500",
    [BookingStatus.Completed]: "bg-emerald-500",
    [BookingStatus.Disputed]: "bg-destructive",
    [BookingStatus.Rejected]: "bg-destructive",
    [BookingStatus.Cancelled]: "bg-muted-foreground",
  } as Record<BookingStatus, string>,
} as const;

export const SPACE_STATUS = {
  labels: {
    [SpaceStatus.Active]: "Active",
    [SpaceStatus.Inactive]: "Inactive",
    [SpaceStatus.PendingApproval]: "Pending",
    [SpaceStatus.Rejected]: "Rejected",
    [SpaceStatus.Suspended]: "Suspended",
  } as Record<SpaceStatus, string>,

  variants: {
    [SpaceStatus.Active]: "default",
    [SpaceStatus.Inactive]: "secondary",
    [SpaceStatus.PendingApproval]: "outline",
    [SpaceStatus.Rejected]: "destructive",
    [SpaceStatus.Suspended]: "destructive",
  } as Record<SpaceStatus, BadgeVariant>,

  indicators: {
    [SpaceStatus.Active]: "bg-emerald-500",
    [SpaceStatus.Inactive]: "bg-muted-foreground",
    [SpaceStatus.PendingApproval]: "bg-amber-500",
    [SpaceStatus.Rejected]: "bg-destructive",
    [SpaceStatus.Suspended]: "bg-destructive",
  } as Record<SpaceStatus, string>,
} as const;

export const SPACE_TYPE = {
  labels: {
    [SpaceType.Billboard]: "Billboard",
    [SpaceType.DigitalDisplay]: "Digital Display",
    [SpaceType.Storefront]: "Storefront",
    [SpaceType.Transit]: "Transit",
    [SpaceType.VehicleWrap]: "Vehicle Wrap",
    [SpaceType.WindowDisplay]: "Window Display",
    [SpaceType.Other]: "Other",
  } as Record<SpaceType, string>,
} as const;

export const PAYOUT_STATUS = {
  labels: {
    [PayoutStatus.Pending]: "Pending",
    [PayoutStatus.Processing]: "Processing",
    [PayoutStatus.Completed]: "Completed",
    [PayoutStatus.Failed]: "Failed",
    [PayoutStatus.PartiallyPaid]: "Partial",
  } as Record<PayoutStatus, string>,

  variants: {
    [PayoutStatus.Pending]: "outline",
    [PayoutStatus.Processing]: "secondary",
    [PayoutStatus.Completed]: "default",
    [PayoutStatus.Failed]: "destructive",
    [PayoutStatus.PartiallyPaid]: "secondary",
  } as Record<PayoutStatus, BadgeVariant>,

  indicators: {
    [PayoutStatus.Pending]: "bg-amber-500",
    [PayoutStatus.Processing]: "bg-blue-500",
    [PayoutStatus.Completed]: "bg-emerald-500",
    [PayoutStatus.Failed]: "bg-destructive",
    [PayoutStatus.PartiallyPaid]: "bg-amber-500",
  } as Record<PayoutStatus, string>,
} as const;

export const PAYOUT_STAGE = {
  labels: {
    [PayoutStage.Stage1]: "Stage 1",
    [PayoutStage.Stage2]: "Stage 2",
  } as Record<PayoutStage, string>,

  descriptions: {
    [PayoutStage.Stage1]: "Print & Install",
    [PayoutStage.Stage2]: "Rental Fee",
  } as Record<PayoutStage, string>,
} as const;

export const CAMPAIGN_STATUS = {
  labels: {
    [CampaignStatus.Draft]: "Draft",
    [CampaignStatus.Submitted]: "Submitted",
    [CampaignStatus.Active]: "Active",
    [CampaignStatus.Completed]: "Completed",
    [CampaignStatus.Cancelled]: "Cancelled",
  } as Record<CampaignStatus, string>,

  variants: {
    [CampaignStatus.Draft]: "outline",
    [CampaignStatus.Submitted]: "secondary",
    [CampaignStatus.Active]: "default",
    [CampaignStatus.Completed]: "default",
    [CampaignStatus.Cancelled]: "secondary",
  } as Record<CampaignStatus, BadgeVariant>,

  indicators: {
    [CampaignStatus.Draft]: "bg-muted-foreground",
    [CampaignStatus.Submitted]: "bg-amber-500",
    [CampaignStatus.Active]: "bg-emerald-500",
    [CampaignStatus.Completed]: "bg-blue-500",
    [CampaignStatus.Cancelled]: "bg-muted-foreground",
  } as Record<CampaignStatus, string>,
} as const;

export const PAYMENT_STATUS = {
  labels: {
    [PaymentStatus.Pending]: "Pending",
    [PaymentStatus.Succeeded]: "Succeeded",
    [PaymentStatus.Failed]: "Failed",
    [PaymentStatus.Refunded]: "Refunded",
    [PaymentStatus.PartiallyRefunded]: "Partial Refund",
  } as Record<PaymentStatus, string>,

  variants: {
    [PaymentStatus.Pending]: "outline",
    [PaymentStatus.Succeeded]: "default",
    [PaymentStatus.Failed]: "destructive",
    [PaymentStatus.Refunded]: "secondary",
    [PaymentStatus.PartiallyRefunded]: "secondary",
  } as Record<PaymentStatus, BadgeVariant>,

  indicators: {
    [PaymentStatus.Pending]: "bg-amber-500",
    [PaymentStatus.Succeeded]: "bg-emerald-500",
    [PaymentStatus.Failed]: "bg-destructive",
    [PaymentStatus.Refunded]: "bg-blue-500",
    [PaymentStatus.PartiallyRefunded]: "bg-blue-500",
  } as Record<PaymentStatus, string>,
} as const;

export const TIME_RANGES = [
  { value: "90d", label: "Last 3 months", days: 90 },
  { value: "30d", label: "Last 30 days", days: 30 },
  { value: "7d", label: "Last 7 days", days: 7 },
] as const;

export type TimeRange = (typeof TIME_RANGES)[number]["value"];
