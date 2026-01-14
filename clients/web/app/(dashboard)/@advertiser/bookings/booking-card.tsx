"use client";

import { ChevronRight } from "lucide-react";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardAction,
  CardContent,
} from "@/components/card";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

export type BookingStatus = "active" | "pending" | "completed" | "cancelled";

interface BookingCardProps {
  id: number;
  status: BookingStatus;
  spaceName: string;
  location: string;
  startDate: string;
  endDate: string;
  campaignName?: string;
  thumbnailUrl: string;
  className?: string;
}

const STATUS_STYLES: Record<BookingStatus, string> = {
  active: "bg-green-100 text-green-700",
  pending: "bg-yellow-100 text-yellow-700",
  completed: "bg-blue-100 text-blue-700",
  cancelled: "bg-red-100 text-red-700",
};

export function BookingCard({
  id,
  status,
  spaceName,
  location,
  startDate,
  endDate,
  campaignName,
  thumbnailUrl,
  className,
}: BookingCardProps) {
  const router = useRouter();
  return (
    <Card
      onClick={() => router.push(`/bookings/${id}`)}
      role="button"
      className={cn(
        "hover:border-foreground/20 cursor-pointer transition hover:shadow-md",
        className
      )}
    >
      {/* Header */}
      <CardHeader>
        <div className="flex items-center gap-2">
          <span
            className={cn(
              "rounded-full px-3 py-1 text-xs font-medium capitalize",
              STATUS_STYLES[status]
            )}
          >
            {status}
          </span>
        </div>

        <CardAction>
          <ChevronRight className="text-muted-foreground h-5 w-5" />
        </CardAction>
      </CardHeader>

      {/* Content */}
      <CardContent>
        <div className="flex flex-col gap-4">
          {/* Thumbnail */}
          <div className="relative h-full min-h-28 shrink-0 overflow-hidden rounded-lg border lg:w-full">
            <img
              src="https://www.eclosio.ong/wp-content/uploads/2018/08/default.png"
              alt={spaceName}
              className="h-full w-full object-cover"
            />
          </div>

          {/* Info */}
          <div className="flex flex-col gap-1">
            <CardTitle className="text-base">{spaceName}</CardTitle>

            <CardDescription>📍 {location}</CardDescription>

            <CardDescription>
              📅 {startDate} – {endDate}
            </CardDescription>

            {campaignName && (
              <CardDescription>Campaign: {campaignName}</CardDescription>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
