"use client";

import Link from "next/link";
import { useTransition } from "react";
import { Button } from "@/components/primitives/button";
import { Badge } from "@/components/primitives/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/primitives/dropdown-menu";
import { NotificationType, type NotificationsPageQuery } from "@/types/gql";
import {
  CheckCircle2,
  XCircle,
  X,
  DollarSign,
  Camera,
  AlertTriangle,
  MessageSquare,
  MoreVertical,
  Check,
  Trash2,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/core/utils";
import {
  markNotificationReadAction,
  deleteNotificationAction,
} from "./notifications.actions";
import { toast } from "sonner";

type Notification = NonNullable<
  NonNullable<NotificationsPageQuery["myNotifications"]>["nodes"]
>[number];

type Props = {
  notification: Notification;
  onOptimisticMarkRead?: (id: string) => void;
  onOptimisticDelete?: (id: string) => void;
};

export default function NotificationItem({
  notification,
  onOptimisticMarkRead,
  onOptimisticDelete,
}: Props) {
  const [isPending, startTransition] = useTransition();

  const handleMarkAsRead = () => {
    onOptimisticMarkRead?.(notification.id);
    startTransition(async () => {
      const result = await markNotificationReadAction(notification.id);
      if (!result.success) {
        toast.error(result.error ?? "Failed to mark as read");
      }
    });
  };

  const handleDelete = () => {
    onOptimisticDelete?.(notification.id);
    startTransition(async () => {
      const result = await deleteNotificationAction(notification.id);
      if (!result.success) {
        toast.error(result.error ?? "Failed to delete notification");
      }
    });
  };

  const link = getNotificationLink(notification);
  const isUnread = !notification.isRead;

  const content = (
    <div
      className={cn(
        "group hover:bg-muted/50 flex items-start gap-3 rounded-lg border p-4 transition-colors",
        isUnread &&
          "border-blue-200 bg-blue-50/50 dark:border-blue-900 dark:bg-blue-950/20",
        isPending && "opacity-50"
      )}
    >
      <div className="mt-0.5 flex-shrink-0">
        {getNotificationIcon(notification.type)}
      </div>

      <div className="min-w-0 flex-1 space-y-1">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <p
              className={cn("text-sm font-medium", isUnread && "font-semibold")}
            >
              {notification.title}
            </p>
            <p className="text-muted-foreground line-clamp-2 text-sm">
              {notification.body}
            </p>
          </div>
          {isUnread && (
            <div className="flex-shrink-0">
              <div className="h-2 w-2 rounded-full bg-blue-600" />
            </div>
          )}
        </div>
        <div className="text-muted-foreground flex items-center gap-2 text-xs">
          <span>{formatTime(notification.createdAt)}</span>
          {notification.entityType && (
            <>
              <span>•</span>
              <Badge variant="outline" className="text-xs">
                {notification.entityType}
              </Badge>
            </>
          )}
        </div>
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="opacity-0 transition-opacity group-hover:opacity-100"
            onClick={(e) => e.stopPropagation()}
            disabled={isPending}
          >
            {isPending ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <MoreVertical className="size-4" />
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {isUnread && (
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation();
                handleMarkAsRead();
              }}
            >
              <Check className="mr-2 size-4" />
              Mark as read
            </DropdownMenuItem>
          )}
          <DropdownMenuItem
            onClick={(e) => {
              e.stopPropagation();
              handleDelete();
            }}
            className="text-destructive"
          >
            <Trash2 className="mr-2 size-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );

  if (link) {
    return (
      <Link href={link} className="block">
        {content}
      </Link>
    );
  }

  return content;
}

function getNotificationIcon(type: NotificationType) {
  switch (type) {
    case NotificationType.BookingApproved:
      return <CheckCircle2 className="size-5 text-green-600" />;
    case NotificationType.BookingRejected:
      return <XCircle className="size-5 text-red-600" />;
    case NotificationType.BookingCancelled:
      return <X className="size-5 text-gray-600" />;
    case NotificationType.PaymentReceived:
    case NotificationType.RefundProcessed:
    case NotificationType.PayoutProcessed:
      return <DollarSign className="size-5 text-green-600" />;
    case NotificationType.ProofUploaded:
    case NotificationType.ProofApproved:
      return <Camera className="size-5 text-blue-600" />;
    case NotificationType.DisputeFiled:
    case NotificationType.DisputeResolved:
      return <AlertTriangle className="size-5 text-orange-600" />;
    case NotificationType.MessageReceived:
      return <MessageSquare className="size-5 text-blue-600" />;
    default:
      return <CheckCircle2 className="size-5 text-gray-600" />;
  }
}

function getNotificationLink(notification: Notification): string | null {
  if (!notification.entityId || !notification.entityType) {
    return null;
  }

  switch (notification.entityType) {
    case "Booking":
      return `/bookings/${notification.entityId}`;
    case "Conversation":
    case "Message":
      return `/messages/${notification.entityId}`;
    default:
      return null;
  }
}

function formatTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}
