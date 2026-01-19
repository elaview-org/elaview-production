"use client";

import { useState } from "react";
import { BookingCard, BookingStatus } from "./booking-card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/dropdown-menu";
import { Button } from "@/components/button";
import { IconChevronDown, IconSearch } from "@tabler/icons-react";
import { Input } from "@/components/input";

const books = [
  {
    id: 1,
    status: "active" as BookingStatus,
    location: "Los Angeles, CA",
    spaceName: "Downtown Billboard",
    startDate: "Jan 12",
    endDate: "Jan 18",
    campaignName: "Brand Awareness",
    thumbnailUrl: "/mock/spaces/billboard-1.jpg",
  },
  {
    id: 2,
    status: "pending" as BookingStatus,
    location: "San Francisco, CA",
    spaceName: "Market Street LED",
    startDate: "Feb 02",
    endDate: "Feb 10",
    campaignName: "Product Launch",
    thumbnailUrl: "/mock/spaces/led-1.jpg",
  },
  {
    id: 3,
    status: "completed" as BookingStatus,
    location: "New York, NY",
    spaceName: "Times Square Screen",
    startDate: "Dec 01",
    endDate: "Dec 07",
    campaignName: "Holiday Promo",
    thumbnailUrl: "/mock/spaces/screen-1.jpg",
  },
  {
    id: 4,
    status: "cancelled" as BookingStatus,
    location: "Chicago, IL",
    spaceName: "Loop Transit Display",
    startDate: "Nov 10",
    endDate: "Nov 15",
    campaignName: "Transit Ads",
    thumbnailUrl: "/mock/spaces/transit-1.jpg",
  },
  {
    id: 5,
    status: "active" as BookingStatus,
    location: "Austin, TX",
    spaceName: "Congress Ave Banner",
    startDate: "Jan 20",
    endDate: "Jan 30",
    campaignName: "Startup Growth",
    thumbnailUrl: "/mock/spaces/banner-1.jpg",
  },
  {
    id: 6,
    status: "pending" as BookingStatus,
    location: "Seattle, WA",
    spaceName: "Pike Place Display",
    startDate: "Feb 15",
    endDate: "Feb 22",
    campaignName: "Event Promotion",
    thumbnailUrl: "/mock/spaces/display-1.jpg",
  },
  {
    id: 7,
    status: "completed" as BookingStatus,
    location: "Miami, FL",
    spaceName: "Ocean Drive Billboard",
    startDate: "Oct 05",
    endDate: "Oct 12",
    campaignName: "Summer Sale",
    thumbnailUrl: "/mock/spaces/billboard-2.jpg",
  },
  {
    id: 8,
    status: "active" as BookingStatus,
    location: "Las Vegas, NV",
    spaceName: "Strip LED Wall",
    startDate: "Jan 05",
    endDate: "Jan 25",
    campaignName: "Casino Promotion",
    thumbnailUrl: "/mock/spaces/led-2.jpg",
  },
  {
    id: 9,
    status: "pending" as BookingStatus,
    location: "Boston, MA",
    spaceName: "Seaport Digital Board",
    startDate: "Mar 01",
    endDate: "Mar 08",
    campaignName: "Tech Conference",
    thumbnailUrl: "/mock/spaces/digital-1.jpg",
  },
  {
    id: 10,
    status: "completed" as BookingStatus,
    location: "Denver, CO",
    spaceName: "Union Station Screen",
    startDate: "Sep 15",
    endDate: "Sep 22",
    campaignName: "Travel Campaign",
    thumbnailUrl: "/mock/spaces/screen-2.jpg",
  },
];

export default function BookingsPage() {
  const [statusFilter, setStatusFilter] = useState("all");
  const [filters, setFilters] = useState({
    searchQuery:''
  })
  return (
    <div className="p-6">
      <header className="mb-8 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Bookings</h1>
          <p className="text-muted-foreground">
            View and manage your current, upcoming, and past bookings here.
          </p>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative w-full sm:w-64">
            <IconSearch className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
            <Input
              placeholder="Search locations..."
              className="pl-10"
              value={filters.searchQuery}
              onChange={()=>{}}
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <span className="hidden lg:inline">Filter by status</span>
                <span className="lg:hidden">Status</span>
                <IconChevronDown />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              {[
                { key: "1", value: "all" },
                { key: "2", value: "pending" },
                { key: "3", value: "active" },
                { key: "4", value: "completed" },
              ].map((item) => (
                <DropdownMenuItem
                  key={item.key}
                  onSelect={() => setStatusFilter(item.value)}
                >
                  {item.value}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-6 p-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {books
          .filter((b) => statusFilter === "all" || b.status === statusFilter)
          .map((b) => (
            <div
              key={b.id}
              className="transition-all duration-200 hover:shadow-lg"
            >
              <BookingCard {...b} />
            </div>
          ))}
      </div>
    </div>
  );
}
