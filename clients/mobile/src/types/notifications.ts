// Notification types aligned with GraphQL schema
// The NotificationType enum comes from @/types/graphql

import { NotificationType } from "@/types/graphql";

export { NotificationType };

/**
 * Shape of a notification node from the myNotifications GraphQL query.
 */
export interface NotificationNode {
  id: string;
  type: NotificationType;
  title: string;
  body: string;
  entityType?: string | null;
  entityId?: string | null;
  isRead: boolean;
  readAt?: string | null;
  createdAt: string;
}
