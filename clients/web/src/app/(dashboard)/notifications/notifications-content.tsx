"use client";

import { useState, useMemo } from "react";
import { NotificationType } from "@/types/gql/graphql";
import { NotificationsHeader } from "./notifications-header";
import { NotificationsFilters } from "./notifications-filters";
import { NotificationsList } from "./notifications-list";
import { NotificationsEmpty } from "./notifications-empty";
import { NotificationsSkeleton } from "./notifications-skeleton";
import type { TNotification } from "./mock-notification";
import ConditionalRender from "@/components/composed/conditionally-render";

interface NotificationsContentProps {
  initialNotifications: TNotification[];
}

export default function NotificationsContent({
  initialNotifications,
}: NotificationsContentProps) {
  const [notifications, setNotifications] =
    useState<TNotification[]>(initialNotifications);
  const [filter, setFilter] = useState<"all" | "unread" | NotificationType>(
    "all"
  );
  const [isLoading] = useState(false);

  // Filter notifications based on selected filter
  const filteredNotifications = useMemo(() => {
    if (filter === "all") {
      return notifications;
    }
    if (filter === "unread") {
      return notifications.filter((n) => !n.isRead);
    }
    return notifications.filter((n) => n.type === filter);
  }, [notifications, filter]);

  // Calculate counts
  const unreadCount = notifications.filter((n) => !n.isRead).length;
  const hasUnread = unreadCount > 0;

  // Handlers
  const handleMarkAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) =>
        n.id === id
          ? { ...n, isRead: true, readAt: new Date().toISOString() }
          : n
      )
    );
    // TODO: Call GraphQL mutation `markNotificationRead`
  };

  const handleMarkAllRead = () => {
    setNotifications((prev) =>
      prev.map((n) =>
        !n.isRead ? { ...n, isRead: true, readAt: new Date().toISOString() } : n
      )
    );
    // TODO: Call GraphQL mutation `markAllNotificationsRead`
  };

  const handleDelete = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    // TODO: Call GraphQL mutation `deleteNotification`
  };

  const handleDeleteAll = () => {
    if (confirm("Are you sure you want to delete all notifications?")) {
      setNotifications([]);
      // TODO: Call GraphQL mutation to delete all
    }
  };

  return (
    <div className="space-y-4 p-4 md:p-6">
      <ConditionalRender
        condition={isLoading}
        show={
          <>
            <NotificationsHeader />
            <NotificationsSkeleton />
          </>
        }
        elseShow={
          <>
            <NotificationsHeader
              unreadCount={unreadCount}
              totalCount={notifications.length}
              onMarkAllRead={handleMarkAllRead}
              onDeleteAll={handleDeleteAll}
              hasUnread={hasUnread}
            />

            <NotificationsFilters
              filter={filter}
              onFilterChange={setFilter}
              unreadCount={unreadCount}
            />

            <ConditionalRender
              condition={filteredNotifications.length === 0}
              show={<NotificationsEmpty />}
              elseShow={
                <NotificationsList
                  notifications={filteredNotifications}
                  onMarkAsRead={handleMarkAsRead}
                  onDelete={handleDelete}
                />
              }
            />
          </>
        }
      />
    </div>
  );
}
