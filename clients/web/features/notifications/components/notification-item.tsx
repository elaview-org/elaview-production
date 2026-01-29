import Link from "next/link";
import { Button } from "@/components/primitives/button";
import { Badge } from "@/components/primitives/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/primitives/dropdown-menu";
import {
  NotificationType,
} from "@/types/gql/graphql";
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
} from "lucide-react";
import { cn } from "@/lib/utils";
import { type TNotification } from "./mock-notification";


interface NotificationItemProps {
  notification: TNotification;
  onMarkAsRead?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export function NotificationItem({
  notification,
  onMarkAsRead,
  onDelete,
}: NotificationItemProps) {
  const getNotificationIcon = (type: NotificationType) => {
    switch (type) {
      case NotificationType.BookingApproved:
        return <CheckCircle2 className="h-5 w-5 text-green-600" />;
      case NotificationType.BookingRejected:
        return <XCircle className="h-5 w-5 text-red-600" />;
      case NotificationType.BookingCancelled:
        return <X className="h-5 w-5 text-gray-600" />;
      case NotificationType.PaymentReceived:
      case NotificationType.RefundProcessed:
        return <DollarSign className="h-5 w-5 text-green-600" />;
      case NotificationType.ProofUploaded:
      case NotificationType.ProofApproved:
        return <Camera className="h-5 w-5 text-blue-600" />;
      case NotificationType.DisputeFiled:
      case NotificationType.DisputeResolved:
        return <AlertTriangle className="h-5 w-5 text-orange-600" />;
      case NotificationType.MessageReceived:
        return <MessageSquare className="h-5 w-5 text-blue-600" />;
      default:
        return <CheckCircle2 className="h-5 w-5 text-gray-600" />;
    }
  };

  const getNotificationLink = (notification: TNotification): string | null => {
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
  };

  const formatTime = (dateString: string): string => {
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
  };

  const link = getNotificationLink(notification);
  const isUnread = !notification.isRead;

  const content = (
    <div
      className={cn(
        "group flex items-start gap-3 rounded-lg border p-4 transition-colors hover:bg-muted/50",
        isUnread && "bg-blue-50/50 border-blue-200 dark:bg-blue-950/20 dark:border-blue-900"
      )}
    >
      {/* Icon */}
      <div className="flex-shrink-0 mt-0.5">
        {getNotificationIcon(notification.type)}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 space-y-1">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <p
              className={cn(
                "text-sm font-medium",
                isUnread && "font-semibold"
              )}
            >
              {notification.title}
            </p>
            <p className="text-sm text-muted-foreground line-clamp-2">
              {notification.body}
            </p>
          </div>
          {isUnread && (
            <div className="flex-shrink-0">
              <div className="h-2 w-2 rounded-full bg-blue-600" />
            </div>
          )}
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>{formatTime(notification.createdAt as string)}</span>
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

      {/* Actions */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="opacity-0 transition-opacity group-hover:opacity-100"
            onClick={(e) => e.stopPropagation()}
          >
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {isUnread && onMarkAsRead && (
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation();
                onMarkAsRead(notification.id as string);
              }}
            >
              <Check className="mr-2 h-4 w-4" />
              Mark as read
            </DropdownMenuItem>
          )}
          {onDelete && (
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation();
                onDelete(notification.id as string);
              }}
              className="text-destructive"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          )}
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
