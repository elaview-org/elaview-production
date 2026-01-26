"use client";

import { IconCheck, IconX, IconClock } from "@tabler/icons-react";
import Link from "next/link";
import { Button } from "@/components/primitives/button";
import { Avatar, AvatarFallback } from "@/components/primitives/avatar";
import { Badge } from "@/components/primitives/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/primitives/card";
import { Skeleton } from "@/components/primitives/skeleton";
import mock from "./mock.json";

type PendingRequest = {
  id: string;
  advertiserName: string;
  advertiserAvatar: string | null;
  spaceName: string;
  spaceId: string;
  startDate: string;
  endDate: string;
  totalAmount: number;
  createdAt: string;
};

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
  }).format(amount);
}

function formatDateRange(start: string, end: string) {
  const startDate = new Date(start);
  const endDate = new Date(end);
  return `${startDate.toLocaleDateString("en-US", { month: "short", day: "numeric" })} - ${endDate.toLocaleDateString("en-US", { month: "short", day: "numeric" })}`;
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function getTimeAgo(dateString: string) {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffHours / 24);

  if (diffDays > 0) return `${diffDays}d ago`;
  if (diffHours > 0) return `${diffHours}h ago`;
  return "Just now";
}

function RequestCard({ request }: { request: PendingRequest }) {
  return (
    <div className="flex flex-col gap-3 rounded-lg border p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <Avatar className="size-10">
            <AvatarFallback className="bg-primary/10 text-primary text-sm">
              {getInitials(request.advertiserName)}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="font-medium">{request.advertiserName}</span>
            <span className="text-muted-foreground text-sm">
              {request.spaceName}
            </span>
          </div>
        </div>
        <Badge variant="outline" className="text-muted-foreground gap-1">
          <IconClock className="size-3" />
          {getTimeAgo(request.createdAt)}
        </Badge>
      </div>

      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">
          {formatDateRange(request.startDate, request.endDate)}
        </span>
        <span className="font-semibold tabular-nums">
          {formatCurrency(request.totalAmount)}
        </span>
      </div>

      <div className="flex gap-2">
        <Button size="sm" className="flex-1 gap-1">
          <IconCheck className="size-4" />
          Accept
        </Button>
        <Button size="sm" variant="outline" className="flex-1 gap-1">
          <IconX className="size-4" />
          Decline
        </Button>
      </div>
    </div>
  );
}

export default function PendingRequests() {
  const requests = mock.pendingRequests as PendingRequest[];

  if (requests.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between">
        <div>
          <CardTitle className="flex items-center gap-2">
            Pending Requests
            <Badge variant="secondary" className="tabular-nums">
              {requests.length}
            </Badge>
          </CardTitle>
          <CardDescription>Booking requests awaiting your approval</CardDescription>
        </div>
        <Button variant="outline" size="sm" asChild>
          <Link href="/bookings?tab=incoming">View All</Link>
        </Button>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-4 @lg/main:grid-cols-2 @3xl/main:grid-cols-3">
          {requests.slice(0, 3).map((request) => (
            <RequestCard key={request.id} request={request} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export function PendingRequestsSkeleton() {
  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between">
        <div className="flex flex-col gap-1">
          <Skeleton className="h-5 w-36" />
          <Skeleton className="h-4 w-56" />
        </div>
        <Skeleton className="h-9 w-20" />
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-4 @lg/main:grid-cols-2 @3xl/main:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex flex-col gap-3 rounded-lg border p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <Skeleton className="size-10 rounded-full" />
                  <div className="flex flex-col gap-1">
                    <Skeleton className="h-4 w-28" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                </div>
                <Skeleton className="h-5 w-16 rounded-full" />
              </div>
              <div className="flex items-center justify-between">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-16" />
              </div>
              <div className="flex gap-2">
                <Skeleton className="h-9 flex-1" />
                <Skeleton className="h-9 flex-1" />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}