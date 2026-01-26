import { Button } from "@/components/primitives/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/primitives/empty";
import { IconCash } from "@tabler/icons-react";
import Link from "next/link";

export default function Placeholder() {
  return (
    <Empty className="border py-16">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <IconCash />
        </EmptyMedia>
        <EmptyTitle>No earnings yet</EmptyTitle>
        <EmptyDescription>
          Earnings will appear here once advertisers complete bookings on your
          spaces
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