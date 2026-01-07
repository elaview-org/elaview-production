import { Notification } from '@/types/notifications';

// Mock notifications for development
// These will be replaced with real API data later
export const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'BOOKING_ACCEPTED',
    title: 'Booking accepted!',
    body: 'Coffee Shop Window accepted your request. Complete payment to confirm.',
    data: {
      bookingId: 'booking-123',
      route: '/(advertiser)/bookings/booking-123',
    },
    read: false,
    readAt: null,
    createdAt: new Date('2026-01-06T10:30:00Z'),
  },
  {
    id: '2',
    type: 'VERIFICATION_SUBMITTED',
    title: 'Review installation',
    body: 'Downtown Billboard installation ready for review',
    data: {
      bookingId: 'booking-456',
      route: '/(advertiser)/bookings/booking-456/verify',
    },
    read: false,
    readAt: null,
    createdAt: new Date('2026-01-05T14:20:00Z'),
  },
  {
    id: '3',
    type: 'AUTO_APPROVAL_WARNING',
    title: 'Review needed',
    body: 'Review installation for Gym Poster — auto-approves in 24 hours',
    data: {
      bookingId: 'booking-789',
      route: '/(advertiser)/bookings/booking-789/verify',
    },
    read: true,
    readAt: new Date('2026-01-04T09:15:00Z'),
    createdAt: new Date('2026-01-04T08:00:00Z'),
  },
  {
    id: '4',
    type: 'BOOKING_APPROVED',
    title: 'Installation approved!',
    body: 'Your approval was received. The final payout is being processed.',
    data: {
      bookingId: 'booking-101',
      route: '/(advertiser)/bookings/booking-101',
    },
    read: true,
    readAt: new Date('2026-01-03T16:45:00Z'),
    createdAt: new Date('2026-01-03T16:30:00Z'),
  },
  {
    id: '5',
    type: 'PAYMENT_FAILED',
    title: 'Payment failed',
    body: 'Payment for Window Display failed. Please try again with a different payment method.',
    data: {
      bookingId: 'booking-202',
      route: '/(advertiser)/bookings/booking-202',
    },
    read: true,
    readAt: new Date('2026-01-02T11:20:00Z'),
    createdAt: new Date('2026-01-02T11:15:00Z'),
  },
  {
    id: '6',
    type: 'BOOKING_COMPLETED',
    title: 'Campaign completed!',
    body: 'Your Storefront Poster campaign has ended. Thanks for using Elaview!',
    data: {
      bookingId: 'booking-303',
      route: '/(advertiser)/bookings/booking-303',
    },
    read: true,
    readAt: new Date('2026-01-01T10:00:00Z'),
    createdAt: new Date('2026-01-01T09:00:00Z'),
  },
];

// Helper function to get unread count
export function getUnreadCount(notifications: Notification[]): number {
  return notifications.filter((n) => !n.read).length;
}

// Helper function to mark notification as read
export function markAsRead(
  notifications: Notification[],
  notificationId: string
): Notification[] {
  return notifications.map((n) =>
    n.id === notificationId
      ? { ...n, read: true, readAt: new Date() }
      : n
  );
}
