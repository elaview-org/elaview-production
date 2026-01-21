"use client";

import { useState, useMemo } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/select";
import { BookingCard, BookingStatus } from "./booking-card";
import { BookingStatus as GraphQLBookingStatus } from "@/types/graphql.generated";
import type { Booking } from "@/types/graphql.generated";

interface BookingsPageProps {
  bookings: Booking[];
}

// Map GraphQL BookingStatus to BookingCard status
function mapBookingStatus(status: GraphQLBookingStatus): BookingStatus {
  switch (status) {
    case GraphQLBookingStatus.Approved:
    case GraphQLBookingStatus.Paid:
    case GraphQLBookingStatus.Installed:
    case GraphQLBookingStatus.Verified:
    case GraphQLBookingStatus.FileDownloaded:
      return "active";
    case GraphQLBookingStatus.PendingApproval:
      return "pending";
    case GraphQLBookingStatus.Completed:
      return "completed";
    case GraphQLBookingStatus.Cancelled:
    case GraphQLBookingStatus.Rejected:
      return "cancelled";
    default:
      return "pending";
  }
}

// Format date to "MMM DD" format
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

export default function BookingsPage({ bookings }: BookingsPageProps) {
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const filteredBookings = useMemo(() => {
    if (statusFilter === "all") {
      return bookings;
    }

    return bookings.filter((booking) => {
      const cardStatus = mapBookingStatus(booking.status);
      return cardStatus === statusFilter;
    });
  }, [bookings, statusFilter]);

  const transformedBookings = useMemo(() => {
    return filteredBookings.map((booking) => {
      const space = booking.space;
      const location = space
        ? `${space.city}, ${space.state}`
        : "Unknown Location";
      const spaceName = space?.title ?? "Unknown Space";
      // Use default image since we're not fetching images to reduce query cost
      const thumbnailUrl =
        "https://www.eclosio.ong/wp-content/uploads/2018/08/default.png";

      return {
        id: booking.id,
        status: mapBookingStatus(booking.status),
        spaceName,
        location,
        startDate: formatDate(booking.startDate as string),
        endDate: formatDate(booking.endDate as string),
        campaignName: booking.campaign?.name,
        thumbnailUrl,
      } as {
        id: string;
        status: BookingStatus;
        spaceName: string;
        location: string;
        startDate: string;
        endDate:string;
        campaignName:string;
        thumbnailUrl:string;
      };
    });
  }, [filteredBookings]);

  return (
    <div className="px-6">
      <header className="flex flex-col gap-6 border-b-2 py-8 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Bookings</h1>
          <p className="text-muted-foreground">
            View and track all your campaign bookings.
          </p>
        </div>
        <div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </header>
      {transformedBookings.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <p className="">
            {statusFilter === "all"
              ? "No bookings found."
              : `No ${statusFilter} bookings found.`}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {transformedBookings.map((booking) => (
            <BookingCard {...booking} key={booking.id} />
          ))}
        </div>
      )}
    </div>
  );
}
