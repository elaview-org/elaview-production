import { IconCurrencyDollar } from "@tabler/icons-react";
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
          <IconCurrencyDollar />
        </EmptyMedia>
        <EmptyTitle>No revenue data</EmptyTitle>
        <EmptyDescription>
          Revenue breakdown will appear here once your spaces generate income.
        </EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
}
