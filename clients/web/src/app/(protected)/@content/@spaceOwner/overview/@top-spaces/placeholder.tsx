import { Button } from "@/components/primitives/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/primitives/empty";
import { IconBuildingStore } from "@tabler/icons-react";
import Link from "next/link";

export default function Placeholder() {
  return (
    <Empty className="py-16">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <IconBuildingStore />
        </EmptyMedia>
        <EmptyTitle>No spaces yet</EmptyTitle>
        <EmptyDescription>
          Your best performing spaces will appear here once you create listings
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button variant="outline" asChild>
          <Link href="/listings">View listings</Link>
        </Button>
      </EmptyContent>
    </Empty>
  );
}
