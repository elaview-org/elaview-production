import { Button } from "@/components/primitives/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/primitives/empty";
import { IconInbox } from "@tabler/icons-react";
import Link from "next/link";

export default function Placeholder() {
  return (
    <Empty className="py-16">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <IconInbox />
        </EmptyMedia>
        <EmptyTitle>No pending requests</EmptyTitle>
        <EmptyDescription>
          Booking requests awaiting your approval will appear here
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button variant="outline" asChild>
          <Link href="/bookings?tab=incoming">View Bookings</Link>
        </Button>
      </EmptyContent>
    </Empty>
  );
}
