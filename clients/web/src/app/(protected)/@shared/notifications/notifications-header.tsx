"use client";

import { Button } from "@/components/primitives/button";
import { Card, CardHeader, CardTitle } from "@/components/primitives/card";
import { CheckCircle2, Loader2 } from "lucide-react";

type Props = {
  unreadCount?: number;
  totalCount?: number;
  onMarkAllRead?: () => void;
  hasUnread?: boolean;
  isPending?: boolean;
};

export default function NotificationsHeader({
  unreadCount = 0,
  totalCount = 0,
  onMarkAllRead,
  hasUnread = false,
  isPending = false,
}: Props) {
  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between pb-4">
        <div>
          <CardTitle className="text-xl">Notifications</CardTitle>
          <p className="text-muted-foreground mt-1 text-sm">
            {totalCount} notification{totalCount !== 1 ? "s" : ""}
            {unreadCount > 0 && ` • ${unreadCount} unread`}
          </p>
        </div>
        <div className="flex gap-2">
          {hasUnread && onMarkAllRead && (
            <Button
              variant="outline"
              size="sm"
              onClick={onMarkAllRead}
              disabled={isPending}
            >
              {isPending ? (
                <Loader2 className="mr-2 size-4 animate-spin" />
              ) : (
                <CheckCircle2 className="mr-2 size-4" />
              )}
              Mark all read
            </Button>
          )}
        </div>
      </CardHeader>
    </Card>
  );
}
