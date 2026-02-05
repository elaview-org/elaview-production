import { Button } from "@/components/primitives/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/primitives/empty";
import { IconChartBar } from "@tabler/icons-react";
import Link from "next/link";

export default function Placeholder() {
  return (
    <Empty className="border py-16">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <IconChartBar />
        </EmptyMedia>
        <EmptyTitle>No analytics data yet</EmptyTitle>
        <EmptyDescription>
          Your analytics will populate once you start running advertising
          campaigns
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button asChild>
          <Link href="/discover">Discover Spaces</Link>
        </Button>
      </EmptyContent>
    </Empty>
  );
}
