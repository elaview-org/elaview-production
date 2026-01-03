"use client";

// import { api } from "@/path/to/trpc/react";

interface EarningsBooking {
  id: string;
  status: "COMPLETED" | "ACTIVE" | "CONFIRMED";
  totalAmount: number;
  platformFee: number;
  spaceOwnerAmount: number;
  firstPayoutAmount: number | null;
  finalPayoutAmount: number | null;
  firstPayoutProcessed: boolean;
  finalPayoutProcessed: boolean;
  firstPayoutDate: Date | null;
  finalPayoutDate: Date | null;
  totalDays: number;
  startDate: Date;
  endDate: Date;
  paidAt: Date | null;
  proofStatus: "PENDING" | "APPROVED" | "REJECTED" | null;
  campaign: {
    name: string;
    advertiser: {
      name: string;
      advertiserProfile?: {
        companyName: string;
      } | null;
    };
  };
  space: {
    title: string;
    type: string;
  };
}

interface EarningsData {
  bookings: EarningsBooking[];
  totalBookings?: number;
}

export default function useEarnings() {
  // const { data: earnings, isLoading } = api.bookings.getEarnings.useQuery();

  // Mock data with various payment scenarios
  const now = new Date();
  const thisMonth = new Date(now.getFullYear(), now.getMonth(), 15);
  const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 20);
  const twoMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 2, 10);
  const thisYear = new Date(now.getFullYear(), 3, 15);
  const lastYear = new Date(now.getFullYear() - 1, 8, 25);

  const earnings: EarningsData = {
    bookings: [
      // Fully paid - completed this month
      {
        id: "booking-1",
        status: "COMPLETED",
        totalAmount: 5000,
        platformFee: 500,
        spaceOwnerAmount: 4500,
        firstPayoutAmount: 2250,
        finalPayoutAmount: 2250,
        firstPayoutProcessed: true,
        finalPayoutProcessed: true,
        firstPayoutDate: thisMonth,
        finalPayoutDate: new Date(
          thisMonth.getTime() + 15 * 24 * 60 * 60 * 1000
        ),
        totalDays: 30,
        startDate: new Date(thisMonth.getTime() - 30 * 24 * 60 * 60 * 1000),
        endDate: thisMonth,
        paidAt: new Date(thisMonth.getTime() + 15 * 24 * 60 * 60 * 1000),
        proofStatus: "APPROVED",
        campaign: {
          name: "Summer Sale 2024",
          advertiser: {
            name: "John Smith",
            advertiserProfile: {
              companyName: "Retail Corp",
            },
          },
        },
        space: {
          title: "Downtown Billboard - Main Street",
          type: "Billboard",
        },
      },
      // Partially paid - first payout only, awaiting final
      {
        id: "booking-2",
        status: "ACTIVE",
        totalAmount: 8400,
        platformFee: 840,
        spaceOwnerAmount: 7560,
        firstPayoutAmount: 3780,
        finalPayoutAmount: null,
        firstPayoutProcessed: true,
        finalPayoutProcessed: false,
        firstPayoutDate: lastMonth,
        finalPayoutDate: null,
        totalDays: 42,
        startDate: new Date(lastMonth.getTime() - 20 * 24 * 60 * 60 * 1000),
        endDate: new Date(now.getTime() + 22 * 24 * 60 * 60 * 1000),
        paidAt: lastMonth,
        proofStatus: "APPROVED",
        campaign: {
          name: "Tech Startup Launch",
          advertiser: {
            name: "Sarah Johnson",
            advertiserProfile: {
              companyName: "Tech Innovations Inc",
            },
          },
        },
        space: {
          title: "Highway 101 Digital Sign",
          type: "Digital Sign",
        },
      },
      // Pending proof approval
      {
        id: "booking-3",
        status: "CONFIRMED",
        totalAmount: 3600,
        platformFee: 360,
        spaceOwnerAmount: 3240,
        firstPayoutAmount: null,
        finalPayoutAmount: null,
        firstPayoutProcessed: false,
        finalPayoutProcessed: false,
        firstPayoutDate: null,
        finalPayoutDate: null,
        totalDays: 21,
        startDate: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000),
        endDate: new Date(now.getTime() + 16 * 24 * 60 * 60 * 1000),
        paidAt: null,
        proofStatus: "PENDING",
        campaign: {
          name: "Black Friday Promotion",
          advertiser: {
            name: "Mike Davis",
            advertiserProfile: {
              companyName: "E-Commerce Solutions",
            },
          },
        },
        space: {
          title: "Shopping Mall Entrance",
          type: "Indoor Display",
        },
      },
      // Fully paid - from last month
      {
        id: "booking-4",
        status: "COMPLETED",
        totalAmount: 2400,
        platformFee: 240,
        spaceOwnerAmount: 2160,
        firstPayoutAmount: 1080,
        finalPayoutAmount: 1080,
        firstPayoutProcessed: true,
        finalPayoutProcessed: true,
        firstPayoutDate: lastMonth,
        finalPayoutDate: new Date(
          lastMonth.getTime() + 14 * 24 * 60 * 60 * 1000
        ),
        totalDays: 14,
        startDate: new Date(lastMonth.getTime() - 14 * 24 * 60 * 60 * 1000),
        endDate: lastMonth,
        paidAt: new Date(lastMonth.getTime() + 14 * 24 * 60 * 60 * 1000),
        proofStatus: "APPROVED",
        campaign: {
          name: "Local Restaurant Week",
          advertiser: {
            name: "Emily Chen",
            advertiserProfile: null,
          },
        },
        space: {
          title: "Subway Station Platform",
          type: "Transit Display",
        },
      },
      // In escrow - confirmed but no proof uploaded
      {
        id: "booking-5",
        status: "CONFIRMED",
        totalAmount: 6000,
        platformFee: 600,
        spaceOwnerAmount: 5400,
        firstPayoutAmount: null,
        finalPayoutAmount: null,
        firstPayoutProcessed: false,
        finalPayoutProcessed: false,
        firstPayoutDate: null,
        finalPayoutDate: null,
        totalDays: 30,
        startDate: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000),
        endDate: new Date(now.getTime() + 28 * 24 * 60 * 60 * 1000),
        paidAt: null,
        proofStatus: null,
        campaign: {
          name: "Travel Agency Special",
          advertiser: {
            name: "Robert Wilson",
            advertiserProfile: {
              companyName: "Global Travel Co",
            },
          },
        },
        space: {
          title: "Airport Terminal Display",
          type: "Airport Display",
        },
      },
      // Fully paid - from this year (earlier)
      {
        id: "booking-6",
        status: "COMPLETED",
        totalAmount: 7200,
        platformFee: 720,
        spaceOwnerAmount: 6480,
        firstPayoutAmount: 3240,
        finalPayoutAmount: 3240,
        firstPayoutProcessed: true,
        finalPayoutProcessed: true,
        firstPayoutDate: thisYear,
        finalPayoutDate: new Date(
          thisYear.getTime() + 20 * 24 * 60 * 60 * 1000
        ),
        totalDays: 35,
        startDate: new Date(thisYear.getTime() - 35 * 24 * 60 * 60 * 1000),
        endDate: thisYear,
        paidAt: new Date(thisYear.getTime() + 20 * 24 * 60 * 60 * 1000),
        proofStatus: "APPROVED",
        campaign: {
          name: "Spring Fashion Collection",
          advertiser: {
            name: "Lisa Anderson",
            advertiserProfile: {
              companyName: "Fashion Forward",
            },
          },
        },
        space: {
          title: "City Center Bus Stop",
          type: "Transit Display",
        },
      },
      // Partially paid - from two months ago
      {
        id: "booking-7",
        status: "COMPLETED",
        totalAmount: 4200,
        platformFee: 420,
        spaceOwnerAmount: 3780,
        firstPayoutAmount: 1890,
        finalPayoutAmount: 1890,
        firstPayoutProcessed: true,
        finalPayoutProcessed: true,
        firstPayoutDate: twoMonthsAgo,
        finalPayoutDate: new Date(
          twoMonthsAgo.getTime() + 18 * 24 * 60 * 60 * 1000
        ),
        totalDays: 21,
        startDate: new Date(twoMonthsAgo.getTime() - 21 * 24 * 60 * 60 * 1000),
        endDate: twoMonthsAgo,
        paidAt: new Date(twoMonthsAgo.getTime() + 18 * 24 * 60 * 60 * 1000),
        proofStatus: "APPROVED",
        campaign: {
          name: "Holiday Shopping Event",
          advertiser: {
            name: "David Martinez",
            advertiserProfile: {
              companyName: "Holiday Markets",
            },
          },
        },
        space: {
          title: "Shopping District Banner",
          type: "Banner",
        },
      },
      // Fully paid - from last year
      {
        id: "booking-8",
        status: "COMPLETED",
        totalAmount: 3000,
        platformFee: 300,
        spaceOwnerAmount: 2700,
        firstPayoutAmount: 1350,
        finalPayoutAmount: 1350,
        firstPayoutProcessed: true,
        finalPayoutProcessed: true,
        firstPayoutDate: lastYear,
        finalPayoutDate: new Date(
          lastYear.getTime() + 15 * 24 * 60 * 60 * 1000
        ),
        totalDays: 15,
        startDate: new Date(lastYear.getTime() - 15 * 24 * 60 * 60 * 1000),
        endDate: lastYear,
        paidAt: new Date(lastYear.getTime() + 15 * 24 * 60 * 60 * 1000),
        proofStatus: "APPROVED",
        campaign: {
          name: "Back to School Campaign",
          advertiser: {
            name: "Jennifer Lee",
            advertiserProfile: {
              companyName: "Education Supplies",
            },
          },
        },
        space: {
          title: "University Campus Board",
          type: "Campus Display",
        },
      },
    ],
    totalBookings: 8,
  };

  const isLoading = false;

  return {
    earnings,
    isLoading,
  };
}
