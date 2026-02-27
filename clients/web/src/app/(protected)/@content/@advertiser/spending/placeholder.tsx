import { Button } from "@/components/primitives/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/primitives/empty";
import { IconCreditCard } from "@tabler/icons-react";
import Link from "next/link";

export default function Placeholder() {
  return (
    <Empty className="border py-16">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <IconCreditCard />
        </EmptyMedia>
        <EmptyTitle>No spending yet</EmptyTitle>
        <EmptyDescription>
          Your payment history will appear here once you start booking ad spaces
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button variant="outline" asChild>
          <Link href="/discover">Discover Spaces</Link>
        </Button>
      </EmptyContent>
    </Empty>
  );
}
