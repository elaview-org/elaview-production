import { IconStar } from "@tabler/icons-react";
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
          <IconStar />
        </EmptyMedia>
        <EmptyTitle>No rating data</EmptyTitle>
        <EmptyDescription>
          Rating trends will appear here once you receive reviews.
        </EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
}
