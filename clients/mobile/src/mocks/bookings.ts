// Mock bookings data for development
// DEPRECATED: No longer imported. Screens now use real GraphQL data.
// Kept for reference only.

import { BookingStatus } from "@/types/graphql";

export interface Booking {
  id: string;
  spaceId: string;
  spaceTitle: string;
  spaceType: string;
  spacePhoto: string;
  advertiserId: string;
  advertiserName: string;
  ownerId: string;
  ownerName: string;
  status: BookingStatus;
  startDate: Date;
  endDate: Date;
  totalPrice: number;
  dailyRate: number;
  message?: string;
  createdAt: Date;
  updatedAt: Date;
  // For verification flow
  installationPhoto?: string;
  verifiedAt?: Date;
}

// Advertiser's bookings (from advertiser perspective)
export const mockAdvertiserBookings: Booking[] = [
  {
    id: "booking-1",
    spaceId: "space-1",
    spaceTitle: "Downtown Coffee Shop Window",
    spaceType: "window",
    spacePhoto: "https://picsum.photos/seed/space1/400/300",
    advertiserId: "user-1",
    advertiserName: "Alex Johnson",
    ownerId: "owner-1",
    ownerName: "Sarah Chen",
    status: BookingStatus.Installed,
    startDate: new Date("2026-01-01"),
    endDate: new Date("2026-01-31"),
    totalPrice: 500,
    dailyRate: 25,
    createdAt: new Date("2025-12-20"),
    updatedAt: new Date("2025-12-25"),
    installationPhoto: "https://picsum.photos/seed/install1/400/300",
    verifiedAt: new Date("2026-01-02"),
  },
  {
    id: "booking-2",
    spaceId: "space-3",
    spaceTitle: "Restaurant Digital Screen",
    spaceType: "digital_screen",
    spacePhoto: "https://picsum.photos/seed/space3/400/300",
    advertiserId: "user-1",
    advertiserName: "Alex Johnson",
    ownerId: "owner-3",
    ownerName: "Emma Williams",
    status: BookingStatus.Verified,
    startDate: new Date("2026-01-05"),
    endDate: new Date("2026-02-05"),
    totalPrice: 900,
    dailyRate: 40,
    createdAt: new Date("2025-12-28"),
    updatedAt: new Date("2026-01-05"),
    installationPhoto: "https://picsum.photos/seed/install2/400/300",
  },
  {
    id: "booking-3",
    spaceId: "space-2",
    spaceTitle: "Gym Entrance Poster Board",
    spaceType: "poster",
    spacePhoto: "https://picsum.photos/seed/space2/400/300",
    advertiserId: "user-1",
    advertiserName: "Alex Johnson",
    ownerId: "owner-2",
    ownerName: "Mike Rodriguez",
    status: BookingStatus.PendingApproval,
    startDate: new Date("2026-01-15"),
    endDate: new Date("2026-02-15"),
    totalPrice: 300,
    dailyRate: 15,
    message:
      "Looking to promote our new fitness app. Great fit for your gym audience!",
    createdAt: new Date("2026-01-06"),
    updatedAt: new Date("2026-01-06"),
  },
  {
    id: "booking-4",
    spaceId: "space-4",
    spaceTitle: "Bookstore Front Window",
    spaceType: "window",
    spacePhoto: "https://picsum.photos/seed/space4/400/300",
    advertiserId: "user-1",
    advertiserName: "Alex Johnson",
    ownerId: "owner-4",
    ownerName: "David Park",
    status: BookingStatus.Completed,
    startDate: new Date("2025-11-01"),
    endDate: new Date("2025-11-30"),
    totalPrice: 400,
    dailyRate: 20,
    createdAt: new Date("2025-10-20"),
    updatedAt: new Date("2025-12-01"),
    installationPhoto: "https://picsum.photos/seed/install3/400/300",
    verifiedAt: new Date("2025-11-02"),
  },
];

// Owner's incoming booking requests (from owner perspective)
export const mockOwnerBookings: Booking[] = [
  {
    id: "booking-10",
    spaceId: "space-1",
    spaceTitle: "Downtown Coffee Shop Window",
    spaceType: "window",
    spacePhoto: "https://picsum.photos/seed/space1/400/300",
    advertiserId: "adv-1",
    advertiserName: "TechStartup Inc.",
    ownerId: "user-1",
    ownerName: "Alex Johnson",
    status: BookingStatus.PendingApproval,
    startDate: new Date("2026-02-01"),
    endDate: new Date("2026-02-28"),
    totalPrice: 500,
    dailyRate: 25,
    message: "We'd love to showcase our new app launch in your window!",
    createdAt: new Date("2026-01-05"),
    updatedAt: new Date("2026-01-05"),
  },
  {
    id: "booking-11",
    spaceId: "space-1",
    spaceTitle: "Downtown Coffee Shop Window",
    spaceType: "window",
    spacePhoto: "https://picsum.photos/seed/space1/400/300",
    advertiserId: "adv-2",
    advertiserName: "Local Bakery Co.",
    ownerId: "user-1",
    ownerName: "Alex Johnson",
    status: BookingStatus.PendingApproval,
    startDate: new Date("2026-02-15"),
    endDate: new Date("2026-03-15"),
    totalPrice: 500,
    dailyRate: 25,
    message:
      "Our Valentine's Day promotion would be perfect for your coffee shop customers!",
    createdAt: new Date("2026-01-04"),
    updatedAt: new Date("2026-01-04"),
  },
  {
    id: "booking-12",
    spaceId: "space-1",
    spaceTitle: "Downtown Coffee Shop Window",
    spaceType: "window",
    spacePhoto: "https://picsum.photos/seed/space1/400/300",
    advertiserId: "adv-3",
    advertiserName: "Fitness Brand",
    ownerId: "user-1",
    ownerName: "Alex Johnson",
    status: BookingStatus.Installed,
    startDate: new Date("2026-01-01"),
    endDate: new Date("2026-01-31"),
    totalPrice: 500,
    dailyRate: 25,
    createdAt: new Date("2025-12-15"),
    updatedAt: new Date("2025-12-20"),
    installationPhoto: "https://picsum.photos/seed/install4/400/300",
    verifiedAt: new Date("2026-01-02"),
  },
];

// Helper to filter bookings by status
export function filterBookingsByStatus(
  bookings: Booking[],
  statuses: BookingStatus[]
): Booking[] {
  return bookings.filter((b) => statuses.includes(b.status));
}

// Helper to format date range
export function formatDateRange(startDate: Date, endDate: Date): string {
  const options: Intl.DateTimeFormatOptions = {
    month: "short",
    day: "numeric",
  };
  const start = startDate.toLocaleDateString("en-US", options);
  const end = endDate.toLocaleDateString("en-US", options);
  return `${start} - ${end}`;
}

// Helper to calculate days remaining
export function getDaysRemaining(endDate: Date): number {
  const now = new Date();
  const diff = endDate.getTime() - now.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}
