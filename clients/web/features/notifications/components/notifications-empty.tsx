import { Bell } from "lucide-react";
import { Card, CardContent } from "@/components/primitives/card";

export function NotificationsEmpty() {
  return (
    <Card>
      <CardContent className="flex flex-col items-center justify-center py-12">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted mb-4">
          <Bell className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold mb-2">No notifications</h3>
        <p className="text-sm text-muted-foreground text-center max-w-sm">
          You&apos;re all caught up! When you receive notifications about bookings,
          payments, or messages, they&apos;ll appear here.
        </p>
      </CardContent>
    </Card>
  );
}
