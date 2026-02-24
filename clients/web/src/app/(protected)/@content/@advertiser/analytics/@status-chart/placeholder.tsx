import { IconChartPie } from "@tabler/icons-react";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/primitives/empty";

export default function Placeholder() {
  return (
    <Empty className="mx-auto aspect-square max-h-[300px]">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <IconChartPie />
        </EmptyMedia>
        <EmptyTitle>No bookings yet</EmptyTitle>
        <EmptyDescription>
          Booking status distribution will appear here once you have bookings.
        </EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
}
