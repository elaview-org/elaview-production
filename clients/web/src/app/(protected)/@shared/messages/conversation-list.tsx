"use client";

import { useMemo } from "react";
import ConversationItem, {
  ConversationItem_ConversationFragment,
} from "./conversation-item";
import { getFragmentData, type FragmentType } from "@/types/gql";
import type { SortOption } from "./messages-header";

type Props = {
  conversations: FragmentType<typeof ConversationItem_ConversationFragment>[];
  selectedConversationId?: string;
  currentUserId: string;
  searchQuery?: string;
  sortBy?: SortOption;
};

export default function ConversationList({
  conversations,
  selectedConversationId,
  currentUserId,
  searchQuery = "",
  sortBy = "recent",
}: Props) {
  const filteredAndSortedConversations = useMemo(() => {
    const unmasked = conversations.map((c) =>
      getFragmentData(ConversationItem_ConversationFragment, c)
    );

    let filtered = unmasked;

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = unmasked.filter((conversation) => {
        const spaceName =
          conversation.booking?.space?.title?.toLowerCase() ?? "";
        const otherParticipant = conversation.participants.find(
          (p) => p.user.id !== currentUserId
        );
        const participantName =
          otherParticipant?.user.name?.toLowerCase() ?? "";
        const lastMessage = conversation.messages?.nodes?.[0];
        const lastMessageContent = lastMessage?.content?.toLowerCase() ?? "";

        return (
          spaceName.includes(query) ||
          participantName.includes(query) ||
          lastMessageContent.includes(query)
        );
      });
    }

    if (sortBy === "unread") {
      filtered = [...filtered].sort((a, b) => {
        const aLastMessage = a.messages?.nodes?.[0];
        const bLastMessage = b.messages?.nodes?.[0];
        const aParticipant = a.participants.find(
          (p) => p.user.id === currentUserId
        );
        const bParticipant = b.participants.find(
          (p) => p.user.id === currentUserId
        );

        const aHasUnread =
          aLastMessage &&
          aParticipant?.lastReadAt &&
          new Date(aLastMessage.createdAt) > new Date(aParticipant.lastReadAt);
        const bHasUnread =
          bLastMessage &&
          bParticipant?.lastReadAt &&
          new Date(bLastMessage.createdAt) > new Date(bParticipant.lastReadAt);

        if (aHasUnread && !bHasUnread) return -1;
        if (!aHasUnread && bHasUnread) return 1;
        return (
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        );
      });
    }

    return filtered;
  }, [conversations, searchQuery, sortBy, currentUserId]);

  const conversationIds = useMemo(
    () => new Set(filteredAndSortedConversations.map((c) => c.id)),
    [filteredAndSortedConversations]
  );

  return (
    <div className="h-full overflow-y-auto">
      <div className="divide-y">
        {conversations.map((data) => {
          const conversation = getFragmentData(
            ConversationItem_ConversationFragment,
            data
          );
          if (!conversationIds.has(conversation.id)) return null;
          return (
            <ConversationItem
              key={conversation.id}
              data={data}
              isSelected={conversation.id === selectedConversationId}
              currentUserId={currentUserId}
            />
          );
        })}
      </div>
    </div>
  );
}
