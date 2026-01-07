// Notification types for Elaview mobile app

export type NotificationType =
  | 'BOOKING_REQUEST'
  | 'BOOKING_ACCEPTED'
  | 'BOOKING_DECLINED'
  | 'BOOKING_CANCELLED'
  | 'PAYMENT_RECEIVED'
  | 'PAYMENT_FAILED'
  | 'FILE_DOWNLOADED'
  | 'INSTALL_REMINDER'
  | 'VERIFICATION_SUBMITTED'
  | 'BOOKING_APPROVED'
  | 'BOOKING_AUTO_APPROVED'
  | 'AUTO_APPROVAL_WARNING'
  | 'DISPUTE_OPENED'
  | 'DISPUTE_RESOLVED'
  | 'PAYOUT_SENT'
  | 'PAYOUT_FAILED'
  | 'BOOKING_COMPLETED';

export interface NotificationData {
  bookingId?: string;
  spaceId?: string;
  payoutId?: string;
  amount?: number;
  route?: string;
  [key: string]: unknown;
}

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  body: string;
  data: NotificationData;
  read: boolean;
  readAt: Date | null;
  createdAt: Date;
}

export interface NotificationIconConfig {
  name: string;
  color: string;
  backgroundColor: string;
}
