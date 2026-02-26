import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/primitives/empty";
import { IconCalendarCheck } from "@tabler/icons-react";

export default function Placeholder() {
  return (
    <Empty className="py-8">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <IconCalendarCheck />
        </EmptyMedia>
        <EmptyTitle>No upcoming deadlines</EmptyTitle>
        <EmptyDescription>
          Bookings approaching their deadlines will appear here
        </EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
}
