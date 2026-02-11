"use client";

import { Badge } from "@/components/primitives/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/primitives/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/primitives/select";
import { NotificationType } from "@/types/gql";
import {
  ADVERTISER_NOTIFICATION_LABELS,
  ADVERTISER_NOTIFICATIONS,
} from "@/app/(protected)/settings/constants";

type Props = {
  filter: "all" | "unread" | NotificationType;
  onFilterChange: (filter: "all" | "unread" | NotificationType) => void;
  unreadCount?: number;
};

export default function NotificationsFilters({
  filter,
  onFilterChange,
  unreadCount = 0,
}: Props) {
  const tabValue = filter === "all" || filter === "unread" ? filter : "custom";

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <Tabs
        value={tabValue}
        onValueChange={(value) => {
          if (value === "all" || value === "unread") {
            onFilterChange(value);
          }
        }}
      >
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="unread">
            Unread
            {unreadCount > 0 && (
              <Badge variant="secondary" className="ml-2">
                {unreadCount}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="flex items-center gap-2">
        <Select
          value={filter !== "all" && filter !== "unread" ? filter : "all"}
          onValueChange={(value) => {
            if (value === "all") {
              onFilterChange("all");
            } else {
              onFilterChange(value as NotificationType);
            }
          }}
        >
          <SelectTrigger className="w-45">
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            {ADVERTISER_NOTIFICATIONS.map((type) => (
              <SelectItem key={type} value={type}>
                {ADVERTISER_NOTIFICATION_LABELS[type] || type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
