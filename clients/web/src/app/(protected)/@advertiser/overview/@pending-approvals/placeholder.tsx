import { Button } from "@/components/primitives/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/primitives/empty";
import { IconChecks } from "@tabler/icons-react";
import Link from "next/link";

export default function Placeholder() {
  return (
    <Empty className="py-16">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <IconChecks />
        </EmptyMedia>
        <EmptyTitle>No pending approvals</EmptyTitle>
        <EmptyDescription>
          Installation verifications awaiting your review will appear here
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button variant="outline" asChild>
          <Link href="/bookings">View Bookings</Link>
        </Button>
      </EmptyContent>
    </Empty>
  );
}
