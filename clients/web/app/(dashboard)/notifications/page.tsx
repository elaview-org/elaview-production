import getNotificationsQuery from "@/features/notifications/notifications-queries";
import NotificationsContent from "@/features/notifications/components/notifications-content";

export default async function NotificationsPage() {
  const { notifications } = await getNotificationsQuery();

  return <NotificationsContent initialNotifications={notifications} />;
}
