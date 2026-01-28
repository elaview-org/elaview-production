import { NotificationType } from "@/types/gql/graphql";

export const INDUSTRY_OPTIONS = [
  "Restaurant & Food Service",
  "Fitness & Gym",
  "Beauty & Salon",
  "Real Estate",
  "Retail",
  "Healthcare",
  "Education",
  "Automotive",
  "Home Services",
  "Professional Services",
  "Other",
] as const;

export const NOTIFICATION_LABELS: Partial<Record<NotificationType, string>> = {
  [NotificationType.BookingApproved]: "Booking approved",
  [NotificationType.BookingRejected]: "Booking rejected",
  [NotificationType.BookingCancelled]: "Booking cancelled",
  [NotificationType.PaymentReceived]: "Payment processed",
  [NotificationType.ProofUploaded]: "Verification uploaded",
  [NotificationType.ProofApproved]: "Verification approved",
  [NotificationType.DisputeFiled]: "Dispute filed",
  [NotificationType.DisputeResolved]: "Dispute resolved",
  [NotificationType.MessageReceived]: "New message",
};

export const ADVERTISER_NOTIFICATIONS = [
  NotificationType.BookingApproved,
  NotificationType.BookingRejected,
  NotificationType.BookingCancelled,
  NotificationType.PaymentReceived,
  NotificationType.ProofUploaded,
  NotificationType.ProofApproved,
  NotificationType.DisputeFiled,
  NotificationType.DisputeResolved,
  NotificationType.MessageReceived,
] as const;
