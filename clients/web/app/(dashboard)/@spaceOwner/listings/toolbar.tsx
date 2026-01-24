"use client";

import { useState } from "react";
import { Button } from "@/components/primitives/button";
import { Input } from "@/components/primitives/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/primitives/select";
import {
  IconChevronDown,
  IconChevronUp,
  IconFilter,
  IconSearch,
} from "@tabler/icons-react";
import CreateSpace from "./create-space";

export default function Toolbar() {
  const [filtersOpen, setFiltersOpen] = useState(false);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <div className="relative w-80">
          <IconSearch className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
          <Input placeholder="Search spaces..." className="pl-9" />
        </div>

        <div className="flex-1" />

        <Button
          variant="outline"
          onClick={() => setFiltersOpen(!filtersOpen)}
          className="gap-2"
        >
          <IconFilter className="size-4" />
          Filters
          {filtersOpen ? (
            <IconChevronUp className="size-4" />
          ) : (
            <IconChevronDown className="size-4" />
          )}
        </Button>

        <CreateSpace />
      </div>

      {filtersOpen && (
        <div className="flex flex-wrap items-center gap-3">
          <Select>
            <SelectTrigger className="flex-1">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
              <SelectItem value="pending">Pending Approval</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
              <SelectItem value="suspended">Suspended</SelectItem>
            </SelectContent>
          </Select>

          <Select>
            <SelectTrigger className="flex-1">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="storefront">Storefront</SelectItem>
              <SelectItem value="window">Window Display</SelectItem>
              <SelectItem value="billboard">Billboard</SelectItem>
              <SelectItem value="digital">Digital Display</SelectItem>
              <SelectItem value="transit">Transit</SelectItem>
              <SelectItem value="vehicle">Vehicle Wrap</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>

          <Select>
            <SelectTrigger className="flex-1">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="oldest">Oldest First</SelectItem>
              <SelectItem value="price-high">Price: High to Low</SelectItem>
              <SelectItem value="price-low">Price: Low to High</SelectItem>
              <SelectItem value="bookings">Most Bookings</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="ghost" size="sm">
            Clear filters
          </Button>
        </div>
      )}
    </div>
  );
}
