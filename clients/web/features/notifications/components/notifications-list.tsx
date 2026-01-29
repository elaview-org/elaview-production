import { NotificationItem } from "./notification-item";
import { Separator } from "@/components/primitives/separator";
import { type TNotification } from "./mock-notification";

interface NotificationsListProps {
  notifications: TNotification[];
  onMarkAsRead?: (id: string) => void;
  onDelete?: (id: string) => void;
}

function groupNotificationsByDate(notifications: TNotification[]) {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const thisWeek = new Date(today);
  thisWeek.setDate(thisWeek.getDate() - 7);

  const groups: {
    label: string;
    notifications: TNotification[];
  }[] = [
    { label: "Today", notifications: [] },
    { label: "Yesterday", notifications: [] },
    { label: "This Week", notifications: [] },
    { label: "Older", notifications: [] },
  ];

  notifications.forEach((notification: TNotification) => {
    const date = new Date(notification.createdAt as string);

    if (date >= today) {
      groups[0].notifications.push(notification);
    } else if (date >= yesterday) {
      groups[1].notifications.push(notification);
    } else if (date >= thisWeek) {
      groups[2].notifications.push(notification);
    } else {
      groups[3].notifications.push(notification);
    }
  });

  return groups.filter((group) => group.notifications.length > 0);
}

export function NotificationsList({
  notifications,
  onMarkAsRead,
  onDelete,
}: NotificationsListProps) {
  if (notifications.length === 0) {
    return null;
  }

  const grouped = groupNotificationsByDate(notifications);

  return (
    <div className="space-y-6">
      {grouped.map((group, groupIndex) => (
        <div key={group.label} className="space-y-3">
          <div className="flex items-center gap-2">
            <h3 className="text-muted-foreground text-sm font-semibold">
              {group.label}
            </h3>
            <Separator className="flex-1" />
            <span className="text-muted-foreground text-xs">
              {group.notifications.length}
            </span>
          </div>
          <div className="space-y-2">
            {group.notifications.map((notification) => (
              <NotificationItem
                key={notification.id as string}
                notification={notification}
                onMarkAsRead={onMarkAsRead}
                onDelete={onDelete}
              />
            ))}
          </div>
          {groupIndex < grouped.length - 1 && <Separator className="my-6" />}
        </div>
      ))}
    </div>
  );
}
