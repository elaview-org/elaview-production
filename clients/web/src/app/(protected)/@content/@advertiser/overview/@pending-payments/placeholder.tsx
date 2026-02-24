import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/primitives/empty";
import { IconReceipt } from "@tabler/icons-react";

export default function Placeholder() {
  return (
    <Empty className="py-8">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <IconReceipt />
        </EmptyMedia>
        <EmptyTitle>No pending payments</EmptyTitle>
        <EmptyDescription>
          Approved bookings awaiting payment will appear here
        </EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
}
