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

type Props = {
  tabKey: string;
};

export default function Placeholder({ tabKey }: Props) {
  return (
    <Empty className="border py-16">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <IconCalendar />
        </EmptyMedia>
        <EmptyTitle>No bookings yet</EmptyTitle>
        <EmptyDescription>
          {tabKey === "incoming"
            ? "No pending booking requests at the moment"
            : tabKey === "active"
              ? "No active bookings right now"
              : tabKey === "completed"
                ? "No completed bookings yet"
                : "Bookings will appear here once advertisers book your spaces"}
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button variant="outline" asChild>
          <Link href="/listings">View Your Listings</Link>
        </Button>
      </EmptyContent>
    </Empty>
  );
}