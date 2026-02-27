import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/primitives/empty";
import { Bell } from "lucide-react";

export default function Placeholder() {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <Bell />
        </EmptyMedia>
        <EmptyTitle>No notifications</EmptyTitle>
        <EmptyDescription>
          You&apos;re all caught up! Check back later for updates on bookings,
          payments, and messages.
        </EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
}
