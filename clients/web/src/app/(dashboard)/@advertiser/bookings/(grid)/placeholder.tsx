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
import { type FilterTabKey } from "../constants";

type Props = {
  tabKey: FilterTabKey;
};

const TAB_MESSAGES: Record<FilterTabKey, string> = {
  pending: "No pending booking requests at the moment",
  approved: "No approved bookings awaiting payment",
  active: "No active bookings right now",
  verification: "No bookings pending your verification",
  completed: "No completed bookings yet",
  all: "Start by discovering ad spaces to book",
};

export default function Placeholder({ tabKey }: Props) {
  return (
    <Empty className="border py-16">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <IconCalendar />
        </EmptyMedia>
        <EmptyTitle>No bookings yet</EmptyTitle>
        <EmptyDescription>{TAB_MESSAGES[tabKey]}</EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button variant="outline" asChild>
          <Link href="/discover">Discover Spaces</Link>
        </Button>
      </EmptyContent>
    </Empty>
  );
}
