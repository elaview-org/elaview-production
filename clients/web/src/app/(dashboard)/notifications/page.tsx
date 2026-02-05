import getNotificationsQuery from "@/app/(dashboard)/notifications/notifications-queries";
import NotificationsContent from "@/app/(dashboard)/notifications/notifications-content";

export default async function NotificationsPage() {
  const { notifications } = await getNotificationsQuery();

  return <NotificationsContent initialNotifications={notifications} />;
}
