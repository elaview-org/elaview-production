import ConversationItem from "./conversation-item";
import type { MessagesDataQuery } from "@/types/gql";

type Conversation = NonNullable<
  NonNullable<MessagesDataQuery["myConversations"]>["nodes"]
>[number];

type Props = {
  conversations: Conversation[];
  selectedConversationId?: string;
  currentUserId: string;
};

export default function ConversationList({
  conversations,
  selectedConversationId,
  currentUserId,
}: Props) {
  return (
    <div className="h-full overflow-y-auto">
      <div className="divide-y">
        {conversations.map((conversation) => (
          <ConversationItem
            key={conversation.id}
            conversation={conversation}
            isSelected={conversation.id === selectedConversationId}
            currentUserId={currentUserId}
          />
        ))}
      </div>
    </div>
  );
}
