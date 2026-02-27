import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/primitives/empty";
import { IconChecks } from "@tabler/icons-react";

export default function Placeholder() {
  return (
    <Empty className="py-8">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <IconChecks />
        </EmptyMedia>
        <EmptyTitle>No pending approvals</EmptyTitle>
        <EmptyDescription>
          Installations awaiting your review will appear here
        </EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
}
