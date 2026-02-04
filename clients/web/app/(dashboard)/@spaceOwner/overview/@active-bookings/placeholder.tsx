import { Button } from "@/components/primitives/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/primitives/empty";
import { IconCalendarEvent } from "@tabler/icons-react";
import Link from "next/link";

export default function Placeholder() {
  return (
    <Empty className="py-16">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <IconCalendarEvent />
        </EmptyMedia>
        <EmptyTitle>No active bookings</EmptyTitle>
        <EmptyDescription>
          Bookings in progress will appear here once advertisers book your
          spaces
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button variant="outline" asChild>
          <Link href="/bookings?tab=active">View Bookings</Link>
        </Button>
      </EmptyContent>
    </Empty>
  );
}
