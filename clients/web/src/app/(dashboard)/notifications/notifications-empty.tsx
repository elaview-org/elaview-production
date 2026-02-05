import { Bell } from "lucide-react";
import { Card, CardContent } from "@/components/primitives/card";

export function NotificationsEmpty() {
  return (
    <Card>
      <CardContent className="flex flex-col items-center justify-center py-12">
        <div className="bg-muted mb-4 flex h-16 w-16 items-center justify-center rounded-full">
          <Bell className="text-muted-foreground h-8 w-8" />
        </div>
        <h3 className="mb-2 text-lg font-semibold">No notifications</h3>
        <p className="text-muted-foreground max-w-sm text-center text-sm">
          You&apos;re all caught up! When you receive notifications about
          bookings, payments, or messages, they&apos;ll appear here.
        </p>
      </CardContent>
    </Card>
  );
}
