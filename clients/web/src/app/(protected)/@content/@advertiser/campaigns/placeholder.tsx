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
import { type FilterTabKey } from "./constants";

type Props = {
  tabKey: FilterTabKey;
};

const TAB_MESSAGES: Record<FilterTabKey, string> = {
  draft: "No draft campaigns. Create one to get started",
  active: "No active campaigns running right now",
  completed: "No completed campaigns yet",
  all: "Create your first campaign to start advertising",
};

export default function Placeholder({ tabKey }: Props) {
  return (
    <Empty className="border py-16">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <IconSpeakerphone />
        </EmptyMedia>
        <EmptyTitle>No campaigns yet</EmptyTitle>
        <EmptyDescription>{TAB_MESSAGES[tabKey]}</EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button>Create Campaign</Button>
      </EmptyContent>
    </Empty>
  );
}
