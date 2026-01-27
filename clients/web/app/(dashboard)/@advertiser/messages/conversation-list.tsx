import { memo } from "react";
import type { Conversation } from "../../../../types/messages";
import { ConversationItem } from "./conversation-item";
import { ConversationListSkeleton } from "./conversation-list-skeleton";
import { ConversationListEmpty } from "./conversation-list-empty";

interface ConversationListProps {
  conversations: Conversation[];
  selectedBookingId?: string;
  isLoading?: boolean;
}

export const ConversationList = memo(function ConversationList({
  conversations,
  selectedBookingId,
  isLoading = false,
}: ConversationListProps) {
  if (isLoading) {
    return <ConversationListSkeleton />;
  }

  if (conversations.length === 0) {
    return <ConversationListEmpty />;
  }

  return (
    <div className="h-full overflow-y-auto">
      <div className="divide-y">
        {conversations.map((conversation) => (
          <ConversationItem
            key={conversation.bookingId}
            conversation={conversation}
            isSelected={conversation.bookingId === selectedBookingId}
          />
        ))}
      </div>
    </div>
  );
});
