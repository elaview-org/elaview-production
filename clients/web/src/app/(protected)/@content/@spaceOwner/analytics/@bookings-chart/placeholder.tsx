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
        <EmptyTitle>No booking data</EmptyTitle>
        <EmptyDescription>
          Booking trends will appear here once you receive bookings.
        </EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
}
