import { notFound } from "next/navigation";
import { getFragmentData } from "@/types/gql";
import api from "../api";
import { ConversationItem_ConversationFragment } from "../conversation-item";
import MessagesContent from "../messages-content";
import ThreadHeader from "./thread-header";
import MessageThread from "./message-thread";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function Page({ params }: Props) {
  const { id: conversationId } = await params;
  const { conversations, currentUserId, unreadCount, messages, pageInfo } =
    await api.getThread(conversationId);

  const currentConversation = conversations.find((c) => {
    const unmasked = getFragmentData(ConversationItem_ConversationFragment, c);
    return unmasked.id === conversationId;
  });

  if (!currentConversation) {
    notFound();
  }

  return (
    <div className="flex h-full overflow-hidden">
      <div className="bg-background hidden w-full flex-col border-r md:flex md:max-w-sm">
        <MessagesContent
          conversations={conversations}
          currentUserId={currentUserId}
          unreadCount={unreadCount}
          selectedConversationId={conversationId}
        />
      </div>
      <div className="flex flex-1 flex-col">
        <ThreadHeader data={currentConversation} showBackButton />
        <MessageThread
          conversation={currentConversation}
          messages={messages}
          currentUserId={currentUserId}
          conversationId={conversationId}
          pageInfo={pageInfo}
        />
      </div>
    </div>
  );
}
