import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/primitives/empty";
import { IconCash } from "@tabler/icons-react";

export default function Placeholder() {
  return (
    <Empty className="py-8">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <IconCash />
        </EmptyMedia>
        <EmptyTitle>No upcoming payouts</EmptyTitle>
        <EmptyDescription>
          Pending payouts will appear here when bookings are verified
        </EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
}
