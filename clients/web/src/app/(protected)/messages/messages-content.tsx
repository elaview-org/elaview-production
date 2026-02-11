"use client";

import { useState } from "react";
import MessagesHeader, { type SortOption } from "./messages-header";
import ConversationList from "./conversation-list";
import Placeholder from "./placeholder";
import MaybePlaceholder from "@/components/status/maybe-placeholder";
import { type FragmentType } from "@/types/gql";
import { ConversationItem_ConversationFragment } from "./conversation-item";

type Props = {
  conversations: FragmentType<typeof ConversationItem_ConversationFragment>[];
  currentUserId: string;
  unreadCount: number;
  selectedConversationId?: string;
};

export default function MessagesContent({
  conversations,
  currentUserId,
  unreadCount,
  selectedConversationId,
}: Props) {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("recent");

  return (
    <>
      <MessagesHeader
        conversationCount={conversations.length}
        unreadCount={unreadCount}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        sortBy={sortBy}
        onSortChange={setSortBy}
      />
      <MaybePlaceholder data={conversations} placeholder={<Placeholder />}>
        <ConversationList
          conversations={conversations}
          selectedConversationId={selectedConversationId}
          currentUserId={currentUserId}
          searchQuery={searchQuery}
          sortBy={sortBy}
        />
      </MaybePlaceholder>
    </>
  );
}
