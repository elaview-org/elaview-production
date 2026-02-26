import { Button } from "@/components/primitives/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/primitives/empty";
import { IconSpeakerphone } from "@tabler/icons-react";
import Link from "next/link";

export default function Placeholder() {
  return (
    <Empty className="py-16">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <IconSpeakerphone />
        </EmptyMedia>
        <EmptyTitle>No active campaigns</EmptyTitle>
        <EmptyDescription>
          Create a campaign to start advertising on available spaces
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button asChild>
          <Link href="/campaigns/new">Create Campaign</Link>
        </Button>
      </EmptyContent>
    </Empty>
  );
}
