"use client";

import { Button } from "@/components/primitives/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/primitives/card";
import { CheckCircle2, Trash2 } from "lucide-react";

interface NotificationsHeaderProps {
  unreadCount?: number;
  totalCount?: number;
  onMarkAllRead?: () => void;
  onDeleteAll?: () => void;
  hasUnread?: boolean;
}

export function NotificationsHeader({
  unreadCount = 0,
  totalCount = 0,
  onMarkAllRead,
  onDeleteAll,
  hasUnread = false,
}: NotificationsHeaderProps) {
  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between pb-4">
        <div>
          <CardTitle className="text-xl">Notifications</CardTitle>
          <p className="text-sm text-muted-foreground mt-1">
            {totalCount} notification{totalCount !== 1 ? "s" : ""}
            {unreadCount > 0 && ` • ${unreadCount} unread`}
          </p>
        </div>
        <div className="flex gap-2">
          {hasUnread && onMarkAllRead && (
            <Button variant="outline" size="sm" onClick={onMarkAllRead}>
              <CheckCircle2 className="mr-2 h-4 w-4" />
              Mark all read
            </Button>
          )}
          {onDeleteAll && (
            <Button variant="outline" size="sm" onClick={onDeleteAll}>
              <Trash2 className="mr-2 h-4 w-4" />
              Clear all
            </Button>
          )}
        </div>
      </CardHeader>
    </Card>
  );
}
