"use client";

import { useState, useMemo, useTransition, useOptimistic } from "react";
import { Loader2 } from "lucide-react";
import {
  NotificationType,
  graphql,
  type NotificationsPageQuery,
  type PageInfo,
} from "@/types/gql";
import api from "@/api/client";
import NotificationsHeader from "./notifications-header";
import NotificationsFilters from "./notifications-filters";
import NotificationsList from "./notifications-list";
import Placeholder from "./placeholder";
import {
  markAllNotificationsReadAction,
  loadMoreNotificationsAction,
} from "./notifications.actions";
import { toast } from "sonner";
import { Button } from "@/components/primitives/button";

type Notification = NonNullable<
  NonNullable<NotificationsPageQuery["myNotifications"]>["nodes"]
>[number];

type Props = {
  userId: string;
  initialNotifications: Notification[];
  initialUnreadCount: number;
  initialPageInfo?: Pick<PageInfo, "hasNextPage" | "endCursor"> | null;
};

const OnNotificationSubscription = graphql(`
  subscription OnNotification($userId: ID!) {
    onNotification(userId: $userId) {
      id
      title
      body
      type
      isRead
      createdAt
      entityId
      entityType
    }
  }
`);

export default function NotificationsContent({
  userId,
  initialNotifications,
  initialUnreadCount,
  initialPageInfo,
}: Props) {
  const [filter, setFilter] = useState<"all" | "unread" | NotificationType>(
    "all"
  );
  const [isPending, startTransition] = useTransition();
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [pageInfo, setPageInfo] = useState(initialPageInfo);
  const [additionalNotifications, setAdditionalNotifications] = useState<
    Notification[]
  >([]);
  const [liveNotifications, setLiveNotifications] = useState<Notification[]>(
    []
  );
  const [liveUnreadDelta, setLiveUnreadDelta] = useState(0);

  api.useSubscription(OnNotificationSubscription, {
    variables: { userId },
    onData: ({ data }) => {
      const newNotification = data.data?.onNotification;
      if (newNotification) {
        setLiveNotifications((prev) => {
          if (prev.some((n) => n.id === newNotification.id)) return prev;
          return [newNotification as Notification, ...prev];
        });
        if (!newNotification.isRead) {
          setLiveUnreadDelta((prev) => prev + 1);
        }
      }
    },
  });

  const allNotifications = useMemo(() => {
    const combined = [
      ...liveNotifications,
      ...initialNotifications,
      ...additionalNotifications,
    ];
    const seen = new Set<string>();
    return combined.filter((n) => {
      if (seen.has(n.id)) return false;
      seen.add(n.id);
      return true;
    });
  }, [liveNotifications, initialNotifications, additionalNotifications]);

  const [optimisticNotifications, updateOptimisticNotifications] =
    useOptimistic(
      allNotifications,
      (
        state: Notification[],
        action: { type: "markRead" | "delete"; id: string }
      ) => {
        if (action.type === "markRead") {
          return state.map((n) =>
            n.id === action.id
              ? { ...n, isRead: true, readAt: new Date().toISOString() }
              : n
          );
        }
        if (action.type === "delete") {
          return state.filter((n) => n.id !== action.id);
        }
        return state;
      }
    );

  const adjustedUnreadCount = initialUnreadCount + liveUnreadDelta;

  const [optimisticUnreadCount, updateOptimisticUnreadCount] = useOptimistic(
    adjustedUnreadCount,
    (state: number, action: { type: "markRead" | "markAllRead" }) => {
      if (action.type === "markRead") {
        return Math.max(0, state - 1);
      }
      if (action.type === "markAllRead") {
        return 0;
      }
      return state;
    }
  );

  const filteredNotifications = useMemo(() => {
    if (filter === "all") {
      return optimisticNotifications;
    }
    if (filter === "unread") {
      return optimisticNotifications.filter((n) => !n.isRead);
    }
    return optimisticNotifications.filter((n) => n.type === filter);
  }, [optimisticNotifications, filter]);

  const hasUnread = optimisticUnreadCount > 0;

  const handleOptimisticMarkRead = (id: string) => {
    startTransition(() => {
      updateOptimisticNotifications({ type: "markRead", id });
      updateOptimisticUnreadCount({ type: "markRead" });
    });
  };

  const handleOptimisticDelete = (id: string) => {
    const notification = optimisticNotifications.find((n) => n.id === id);
    startTransition(() => {
      updateOptimisticNotifications({ type: "delete", id });
      if (notification && !notification.isRead) {
        updateOptimisticUnreadCount({ type: "markRead" });
      }
    });
  };

  const handleMarkAllRead = () => {
    startTransition(async () => {
      updateOptimisticUnreadCount({ type: "markAllRead" });
      setLiveUnreadDelta(0);
      const result = await markAllNotificationsReadAction();
      if (!result.success) {
        toast.error(result.error ?? "Failed to mark all as read");
      }
    });
  };

  const handleLoadMore = async () => {
    if (!pageInfo?.hasNextPage || !pageInfo?.endCursor) return;

    setIsLoadingMore(true);

    const isReadFilter = filter === "unread" ? false : undefined;
    const typeFilter =
      filter !== "all" && filter !== "unread" ? filter : undefined;

    const result = await loadMoreNotificationsAction(
      pageInfo.endCursor,
      isReadFilter,
      typeFilter
    );

    setIsLoadingMore(false);

    if (result.success && result.data) {
      setAdditionalNotifications((prev) => [
        ...prev,
        ...(result.data?.notifications ?? []),
      ]);
      setPageInfo(result.data.pageInfo);
    } else {
      toast.error(result.error ?? "Failed to load more notifications");
    }
  };

  return (
    <div className="space-y-4">
      <NotificationsHeader
        unreadCount={optimisticUnreadCount}
        totalCount={optimisticNotifications.length}
        onMarkAllRead={handleMarkAllRead}
        hasUnread={hasUnread}
        isPending={isPending}
      />

      <NotificationsFilters
        filter={filter}
        onFilterChange={setFilter}
        unreadCount={optimisticUnreadCount}
      />

      {filteredNotifications.length === 0 ? (
        <Placeholder />
      ) : (
        <>
          <NotificationsList
            notifications={filteredNotifications}
            onOptimisticMarkRead={handleOptimisticMarkRead}
            onOptimisticDelete={handleOptimisticDelete}
          />

          {pageInfo?.hasNextPage && (
            <div className="flex justify-center pt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={handleLoadMore}
                disabled={isLoadingMore}
              >
                {isLoadingMore ? (
                  <>
                    <Loader2 className="mr-2 size-4 animate-spin" />
                    Loading...
                  </>
                ) : (
                  "Load More"
                )}
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
