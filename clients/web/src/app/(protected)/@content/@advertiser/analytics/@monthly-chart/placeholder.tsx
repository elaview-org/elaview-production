import { IconChartBar } from "@tabler/icons-react";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/primitives/empty";

export default function Placeholder() {
  return (
    <Empty className="h-[300px]">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <IconChartBar />
        </EmptyMedia>
        <EmptyTitle>No monthly data</EmptyTitle>
        <EmptyDescription>
          Monthly performance will appear here once you have campaign history.
        </EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
}
