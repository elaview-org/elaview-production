import { IconChartLine } from "@tabler/icons-react";
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
          <IconChartLine />
        </EmptyMedia>
        <EmptyTitle>No spending data</EmptyTitle>
        <EmptyDescription>
          Spending trends will appear here once you start campaigns.
        </EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
}
