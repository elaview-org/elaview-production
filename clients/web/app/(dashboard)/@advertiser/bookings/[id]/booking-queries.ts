// import api from "@/api/gql/server";
// import { graphql } from "@/types/gql";

interface BookingData {
  id: string;
  status: string;
  dateRange: {
    startDate: string;
    endDate: string;
  };
  space: {
    id: string;
    title: string;
    photos?: string[];
    location?: {
      address: string;
      city: string;
      state: string;
    };
    width?: number;
    height?: number;
    dimensionUnit?: string;
    spaceType?: {
      name: string;
    };
    owner?: {
      id: string;
      firstName: string;
      lastName: string;
      avatarUrl?: string | null;
    };
  };
  campaign?: {
    id: string;
    name: string;
    startDate: string;
    endDate: string;
    budget?: number;
    spent?: number;
  };
  pricePerWeek?: number;
  totalWeeks?: number;
  platformFee?: number;
  printInstallFee?: number;
  total?: number;
  creativeFileUrl?: string | null;
  creativeFileName?: string | null;
  creativeFileSize?: number | null;
  paidAt?: string | null;
  verification?: {
    photos?: Array<{ url: string; id: string }>;
    uploadedAt?: string | null;
    gpsVerified?: boolean;
  };
  payment?: {
    cardBrand?: string;
    cardLast4?: string;
  };
}

interface TimelineEvent {
  id: string;
  type: "payment" | "verification" | "status_change" | "file_download" | "approval";
  title: string;
  description?: string;
  createdAt: string;
  status?: string;
  user?: {
    avatarUrl?: string | null;
    firstName: string;
    lastName: string;
  };
}

export interface BookingDetailsData {
  booking: BookingData;
  timelineEvents: TimelineEvent[];
}

export default async function getBookingDetailsQuery(
  bookingId: string
): Promise<BookingDetailsData> {
  try {
    // TODO: Replace with actual GraphQL query when backend is ready
    // const { data } = await api.query({
    //   query: graphql(`
    //     query GetBookingDetails($id: ID!) {
    //       bookingById(id: $id) {
    //         id
    //         status
    //         startDate
    //         endDate
    //         totalAmount
    //         platformFeeAmount
    //         installationFee
    //         space {
    //           id
    //           title
    //           images
    //           location {
    //             address
    //             city
    //             state
    //           }
    //           width
    //           height
    //           dimensionUnit
    //           spaceType {
    //             name
    //           }
    //           owner {
    //             id
    //             firstName
    //             lastName
    //             avatarUrl
    //           }
    //         }
    //         campaign {
    //           id
    //           name
    //           startDate
    //           endDate
    //           budget
    //         }
    //         proof {
    //           photos {
    //             url
    //           }
    //           uploadedAt
    //           gpsVerified
    //         }
    //         payments {
    //           cardBrand
    //           cardLast4
    //           paidAt
    //         }
    //       }
    //     }
    //   `),
    //   variables: { id: bookingId },
    // });

    // For now, return mock data
    // In production, this would transform GraphQL data to match the interface
    const mockBooking: BookingData = {
      id: bookingId || "booking-123",
      status: "VERIFIED",
      dateRange: {
        startDate: "2025-01-15",
        endDate: "2025-01-29",
      },
      space: {
        id: "space-456",
        title: "Coffee Shop Window Display",
        photos: [
          "/components/assets/images/still-b742de551ffe7ebf2eda37f96ab92d00.webp",
        ],
        location: {
          address: "123 Main St",
          city: "Los Angeles",
          state: "CA",
        },
        width: 24,
        height: 36,
        dimensionUnit: "INCHES",
        spaceType: {
          name: "Window Poster",
        },
        owner: {
          id: "owner-789",
          firstName: "John",
          lastName: "Smith",
          avatarUrl: null,
        },
      },
      campaign: {
        id: "campaign-101",
        name: "Summer Sale 2025",
        startDate: "2025-01-15",
        endDate: "2025-01-29",
        budget: 500,
        spent: 250,
      },
      pricePerWeek: 100,
      totalWeeks: 2,
      platformFee: 30,
      printInstallFee: 20,
      total: 250,
      creativeFileUrl: "https://example.com/creative.pdf",
      creativeFileName: "summer-sale-poster.pdf",
      creativeFileSize: 2516582, // 2.4 MB
      paidAt: "2025-01-12T11:20:00Z",
      verification: {
        photos: [
          { id: "photo-1", url: "/images/verification1.jpg" },
          { id: "photo-2", url: "/images/verification2.jpg" },
          { id: "photo-3", url: "/images/verification3.jpg" },
        ],
        uploadedAt: "2025-01-15T14:30:00Z",
        gpsVerified: true,
      },
      payment: {
        cardBrand: "Visa",
        cardLast4: "4242",
      },
    };

    const mockTimelineEvents: TimelineEvent[] = [
      {
        id: "event-1",
        type: "verification",
        title: "Verification photos uploaded by owner",
        createdAt: "2025-01-15T14:30:00Z",
        status: "VERIFIED",
      },
      {
        id: "event-2",
        type: "status_change",
        title: "Installation marked as completed",
        createdAt: "2025-01-15T10:15:00Z",
      },
      {
        id: "event-3",
        type: "file_download",
        title: "Creative file downloaded by owner",
        createdAt: "2025-01-14T15:45:00Z",
      },
      {
        id: "event-4",
        type: "payment",
        title: "Payment received",
        description: "$250.00",
        createdAt: "2025-01-12T11:20:00Z",
      },
      {
        id: "event-5",
        type: "status_change",
        title: "Booking approved by owner",
        createdAt: "2025-01-11T16:30:00Z",
      },
      {
        id: "event-6",
        type: "status_change",
        title: "Booking request submitted",
        createdAt: "2025-01-10T14:15:00Z",
      },
    ];

    return {
      booking: mockBooking,
      timelineEvents: mockTimelineEvents,
    };
  } catch (error) {
    console.error("Failed to fetch booking details:", error);
    throw error;
  }
}
