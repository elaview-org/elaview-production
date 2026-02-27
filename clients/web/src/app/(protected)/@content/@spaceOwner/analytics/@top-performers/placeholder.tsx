import { IconTrophy } from "@tabler/icons-react";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/primitives/empty";

export default function Placeholder() {
  return (
    <Empty className="py-16">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <IconTrophy />
        </EmptyMedia>
        <EmptyTitle>No performers yet</EmptyTitle>
        <EmptyDescription>
          Top performing spaces will appear here once you have booking activity.
        </EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
}
