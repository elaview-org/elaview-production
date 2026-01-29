import { memo } from "react";
import type { Conversation } from "@/types/messages";
import { ConversationItem } from "./conversation-item";
import { ConversationListSkeleton } from "./conversation-list-skeleton";
import { ConversationListEmpty } from "./conversation-list-empty";
import ConditionalRender from "@/components/composed/conditionally-render";

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
  return (
    <div className="h-full overflow-y-auto">
      <ConditionalRender
        condition={isLoading}
        show={<ConversationListSkeleton />}
      />
      <ConditionalRender
        condition={conversations.length === 0}
        show={<ConversationListEmpty />}
        elseShow={
          <div className="divide-y">
            {conversations.map((conversation) => (
              <ConversationItem
                key={conversation.bookingId}
                conversation={conversation}
                isSelected={conversation.bookingId === selectedBookingId}
              />
            ))}
          </div>
        }
      />
    </div>
  );
});
