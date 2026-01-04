"use client";

// import { api } from "@/path/to/trpc/react";

interface Booking {
  id: string;
  nextVerificationDue: Date | null;
  verificationSchedule: {
    checkpoints?: Array<{
      completed: boolean;
      [key: string]: unknown;
    }>;
    [key: string]: unknown;
  } | null;
  startDate: Date;
  endDate: Date;
  space: {
    title: string;
    [key: string]: unknown;
  };
  campaign: {
    name: string;
    imageUrl?: string | null;
    [key: string]: unknown;
  };
  [key: string]: unknown;
}

export default function useOwnerActiveBookings() {
  // Fetch active bookings for the current space owner
  // const { data: bookings, isLoading } = api.bookings.getOwnerActiveBookings.useQuery();

  // Temporary mock data structure - replace with actual API call
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const threeDaysFromNow = new Date(now);
  threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 3);

  const fiveDaysFromNow = new Date(now);
  fiveDaysFromNow.setDate(fiveDaysFromNow.getDate() + 5);

  const tenDaysAgo = new Date(now);
  tenDaysAgo.setDate(tenDaysAgo.getDate() - 10);

  const startDate1 = new Date(now);
  startDate1.setDate(startDate1.getDate() - 5);
  const endDate1 = new Date(now);
  endDate1.setDate(endDate1.getDate() + 25);

  const startDate2 = new Date(now);
  startDate2.setDate(startDate2.getDate() - 10);
  const endDate2 = new Date(now);
  endDate2.setDate(endDate2.getDate() + 20);

  const startDate3 = new Date(now);
  startDate3.setDate(startDate3.getDate() - 2);
  const endDate3 = new Date(now);
  endDate3.setDate(endDate3.getDate() + 28);

  const startDate4 = new Date(now);
  startDate4.setDate(startDate4.getDate() - 15);
  const endDate4 = new Date(now);
  endDate4.setDate(endDate4.getDate() + 15);

  const bookings: Booking[] = [
    // Overdue verification
    {
      id: "booking-1",
      nextVerificationDue: tenDaysAgo, // Overdue by 10 days
      verificationSchedule: {
        checkpoints: [
          { completed: true, id: "cp-1", dueDate: new Date(tenDaysAgo) },
          { completed: false, id: "cp-2", dueDate: new Date(tenDaysAgo) },
          { completed: false, id: "cp-3", dueDate: fiveDaysFromNow },
        ],
      },
      startDate: startDate1,
      endDate: endDate1,
      space: {
        title: "Downtown Billboard - Main Street",
      },
      campaign: {
        name: "Summer Sale 2024",
        imageUrl:
          "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400",
      },
    },
    // Due soon (within 3 days)
    {
      id: "booking-2",
      nextVerificationDue: tomorrow, // Due tomorrow
      verificationSchedule: {
        checkpoints: [
          { completed: true, id: "cp-1", dueDate: new Date(tenDaysAgo) },
          { completed: false, id: "cp-2", dueDate: tomorrow },
          { completed: false, id: "cp-3", dueDate: fiveDaysFromNow },
        ],
      },
      startDate: startDate2,
      endDate: endDate2,
      space: {
        title: "Highway 101 Digital Sign",
      },
      campaign: {
        name: "Tech Startup Launch",
        imageUrl:
          "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400",
      },
    },
    // Upcoming verification
    {
      id: "booking-3",
      nextVerificationDue: fiveDaysFromNow, // Due in 5 days
      verificationSchedule: {
        checkpoints: [
          { completed: true, id: "cp-1", dueDate: new Date(tenDaysAgo) },
          { completed: true, id: "cp-2", dueDate: new Date(now) },
          { completed: false, id: "cp-3", dueDate: fiveDaysFromNow },
        ],
      },
      startDate: startDate3,
      endDate: endDate3,
      space: {
        title: "Shopping Mall Entrance",
      },
      campaign: {
        name: "Black Friday Promotion",
        imageUrl: null,
      },
    },
    // No verification needed (≤30 days)
    {
      id: "booking-4",
      nextVerificationDue: null,
      verificationSchedule: null,
      startDate: startDate4,
      endDate: endDate4,
      space: {
        title: "Subway Station Platform",
      },
      campaign: {
        name: "Local Restaurant Week",
        imageUrl:
          "https://images.unsplash.com/photo-1556912172-45b7abe8b7e4?w=400",
      },
    },
    // Another no verification needed
    {
      id: "booking-5",
      nextVerificationDue: null,
      verificationSchedule: null,
      startDate: new Date(now),
      endDate: new Date(now.getTime() + 20 * 24 * 60 * 60 * 1000), // 20 days from now
      space: {
        title: "Airport Terminal Display",
      },
      campaign: {
        name: "Travel Agency Special",
        imageUrl: null,
      },
    },
  ];

  const isLoading = false;

  return {
    bookings,
    isLoading,
  };
}
