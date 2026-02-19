import { NotificationType } from "@/types/graphql";
import { NotificationNode } from "@/types/notifications";

// DEPRECATED: No longer imported. Screens now use real GraphQL data.
// Kept for reference only.
export const mockNotifications: NotificationNode[] = [
  {
    id: "1",
    type: NotificationType.BookingApproved,
    title: "Booking accepted!",
    body: "Coffee Shop Window accepted your request. Complete payment to confirm.",
    entityType: "Booking",
    entityId: "booking-123",
    isRead: false,
    readAt: null,
    createdAt: "2026-01-06T10:30:00Z",
  },
  {
    id: "2",
    type: NotificationType.ProofUploaded,
    title: "Review installation",
    body: "Downtown Billboard installation ready for review",
    entityType: "Booking",
    entityId: "booking-456",
    isRead: false,
    readAt: null,
    createdAt: "2026-01-05T14:20:00Z",
  },
  {
    id: "3",
    type: NotificationType.BookingApproved,
    title: "Review needed",
    body: "Review installation for Gym Poster — auto-approves in 24 hours",
    entityType: "Booking",
    entityId: "booking-789",
    isRead: true,
    readAt: "2026-01-04T09:15:00Z",
    createdAt: "2026-01-04T08:00:00Z",
  },
  {
    id: "4",
    type: NotificationType.ProofApproved,
    title: "Installation approved!",
    body: "Your approval was received. The final payout is being processed.",
    entityType: "Booking",
    entityId: "booking-101",
    isRead: true,
    readAt: "2026-01-03T16:45:00Z",
    createdAt: "2026-01-03T16:30:00Z",
  },
  {
    id: "5",
    type: NotificationType.PaymentFailed,
    title: "Payment failed",
    body: "Payment for Window Display failed. Please try again with a different payment method.",
    entityType: "Booking",
    entityId: "booking-202",
    isRead: true,
    readAt: "2026-01-02T11:20:00Z",
    createdAt: "2026-01-02T11:15:00Z",
  },
];

export function getUnreadCount(notifications: NotificationNode[]): number {
  return notifications.filter((n) => !n.isRead).length;
}

export function markAsRead(
  notifications: NotificationNode[],
  notificationId: string,
): NotificationNode[] {
  return notifications.map((n) =>
    n.id === notificationId ? { ...n, isRead: true, readAt: new Date().toISOString() } : n,
  );
}
