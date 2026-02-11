import { IconUsers } from "@tabler/icons-react";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/primitives/empty";

export default function Placeholder() {
  return (
    <Empty className="h-[250px]">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <IconUsers />
        </EmptyMedia>
        <EmptyTitle>No reach data</EmptyTitle>
        <EmptyDescription>
          Audience reach will appear here once you have campaign activity.
        </EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
}
