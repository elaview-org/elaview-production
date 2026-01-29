import {
  NotificationType,
  type Notification,
  type User,
} from "@/types/gql/graphql";

export type TNotification = Omit<Notification, "user"> & {
  user: Pick<User, "__typename" | "id" | "email" | "name">;
};

export const mockNotifications: TNotification[] = [
  {
    __typename: "Notification",
    id: "notif-1",
    title: "Booking Approved",
    body: "Your booking request for Coffee Shop Window Display has been approved by the owner.",
    type: NotificationType.BookingApproved,
    isRead: false,
    createdAt: new Date().toISOString(),
    readAt: null,
    entityId: "booking-123",
    entityType: "Booking",
    userId: "user-1",
    user: {
      __typename: "User",
      id: "user-1",
      email: "user@example.com",
      name: "John Doe",
    },
  },
  {
    __typename: "Notification",
    id: "notif-2",
    title: "Verification Photos Uploaded",
    body: "The owner has uploaded verification photos for your booking. Please review and approve.",
    type: NotificationType.ProofUploaded,
    isRead: false,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    readAt: null,
    entityId: "booking-456",
    entityType: "Booking",
    userId: "user-1",
    user: {
      __typename: "User",
      id: "user-1",
      email: "user@example.com",
      name: "John",
    },
  },
  {
    __typename: "Notification",
    id: "notif-3",
    title: "Payment Received",
    body: "Your payment of $250.00 has been processed successfully.",
    type: NotificationType.PaymentReceived,
    isRead: true,
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // Yesterday
    readAt: new Date(Date.now() - 23 * 60 * 60 * 1000).toISOString(),
    entityId: "booking-789",
    entityType: "Booking",
    userId: "user-1",
    user: {
      __typename: "User",
      id: "user-1",
      email: "user@example.com",
      name: "John",
    },
  },
  {
    __typename: "Notification",
    id: "notif-4",
    title: "New Message",
    body: "You have a new message from the space owner regarding your booking.",
    type: NotificationType.MessageReceived,
    isRead: false,
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
    readAt: null,
    entityId: "conversation-123",
    entityType: "Conversation",
    userId: "user-1",
    user: {
      __typename: "User",
      id: "user-1",
      email: "user@example.com",
      name: "John",
    },
  },
  {
    __typename: "Notification",
    id: "notif-5",
    title: "Dispute Resolved",
    body: "Your dispute for booking #789 has been resolved in your favor.",
    type: NotificationType.DisputeResolved,
    isRead: true,
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 1 week ago
    readAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
    entityId: "booking-789",
    entityType: "Booking",
    userId: "user-1",
    user: {
      __typename: "User",
      id: "user-1",
      email: "user@example.com",
      name: "John",
    },
  },
];
