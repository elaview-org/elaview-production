import { NotificationType, PayoutSchedule } from "@/types/gql/graphql";

export const BUSINESS_TYPES = [
  "Retail Store",
  "Restaurant / Cafe",
  "Salon / Spa",
  "Gym / Fitness",
  "Office Building",
  "Medical / Dental",
  "Auto Service",
  "Other",
] as const;

export const PAYOUT_SCHEDULE_LABELS: Record<PayoutSchedule, string> = {
  [PayoutSchedule.Weekly]: "Weekly",
  [PayoutSchedule.Biweekly]: "Every Two Weeks",
  [PayoutSchedule.Monthly]: "Monthly",
};

export const NOTIFICATION_LABELS: Partial<Record<NotificationType, string>> = {
  [NotificationType.BookingRequested]: "New booking request",
  [NotificationType.BookingApproved]: "Booking approved",
  [NotificationType.BookingRejected]: "Booking rejected",
  [NotificationType.BookingCancelled]: "Booking cancelled",
  [NotificationType.PaymentReceived]: "Payment received",
  [NotificationType.PayoutProcessed]: "Payout processed",
  [NotificationType.ProofApproved]: "Verification approved",
  [NotificationType.ProofDisputed]: "Verification disputed",
  [NotificationType.ProofRejected]: "Verification rejected",
  [NotificationType.DisputeFiled]: "Dispute filed",
  [NotificationType.DisputeResolved]: "Dispute resolved",
  [NotificationType.MessageReceived]: "New message",
  [NotificationType.SpaceApproved]: "Space listing approved",
};

export const SPACE_OWNER_NOTIFICATIONS = [
  NotificationType.BookingRequested,
  NotificationType.BookingCancelled,
  NotificationType.PaymentReceived,
  NotificationType.PayoutProcessed,
  NotificationType.ProofApproved,
  NotificationType.ProofDisputed,
  NotificationType.DisputeFiled,
  NotificationType.DisputeResolved,
  NotificationType.MessageReceived,
  NotificationType.SpaceApproved,
] as const;