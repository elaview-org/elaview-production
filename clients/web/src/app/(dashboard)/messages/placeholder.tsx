import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/primitives/empty";
import { MessageCircle } from "lucide-react";

export default function Placeholder() {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <MessageCircle />
        </EmptyMedia>
        <EmptyTitle>No conversations</EmptyTitle>
        <EmptyDescription>
          Start a booking to begin messaging with space owners
        </EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
}
