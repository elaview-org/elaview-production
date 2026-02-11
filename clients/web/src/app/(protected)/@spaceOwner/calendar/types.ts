import type { BookingStatus } from "@/types/gql/graphql";

export type CalendarSpace = {
  id: string;
  title: string;
  colorIndex: number;
};

export type CalendarBooking = {
  id: string;
  spaceId: string;
  status: BookingStatus;
  startDate: string;
  endDate: string;
  advertiserName: string;
  campaignName: string;
  totalAmount: number;
};

export type CalendarBlockedDate = {
  spaceId: string;
  date: string;
  reason?: string | null;
};
