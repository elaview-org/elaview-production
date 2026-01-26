import { Button } from "@/components/primitives/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/primitives/empty";
import { IconCalendar } from "@tabler/icons-react";
import Link from "next/link";

export default function Placeholder() {
  return (
    <Empty className="border py-16">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <IconCalendar />
        </EmptyMedia>
        <EmptyTitle>No bookings scheduled</EmptyTitle>
        <EmptyDescription>
          Your calendar will show bookings once advertisers start booking your
          spaces
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button variant="outline" asChild>
          <Link href="/listings">Manage Your Listings</Link>
        </Button>
      </EmptyContent>
    </Empty>
  );
}