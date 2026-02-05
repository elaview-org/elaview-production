"use client";

import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import { Loader2 } from "lucide-react";
import MessageBubble, { MessageBubble_MessageFragment } from "./message-bubble";
import { MessageComposer } from "./message-composer";
import {
  markConversationRead,
  sendMessage,
  loadEarlierMessages,
} from "./actions";
import { toast } from "sonner";
import {
  BookingStatus,
  graphql,
  getFragmentData,
  type FragmentType,
  type PageInfo,
  type MessageBubble_MessageFragmentFragment,
} from "@/types/gql";
import { ConversationItem_ConversationFragment } from "../conversation-item";
import api from "@/lib/gql/client";
import { Button } from "@/components/primitives/button";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/primitives/empty";
import { MessageCircle } from "lucide-react";

type MessageData = FragmentType<typeof MessageBubble_MessageFragment>;
type UnmaskedMessage = MessageBubble_MessageFragmentFragment;

type Props = {
  conversation: FragmentType<typeof ConversationItem_ConversationFragment>;
  messages: MessageData[];
  currentUserId: string;
  conversationId: string;
  pageInfo?: Pick<PageInfo, "hasPreviousPage" | "startCursor"> | null;
};

const OnMessageSubscription = graphql(`
  subscription OnMessage($conversationId: ID!) {
    onMessage(conversationId: $conversationId) {
      id
      content
      type
      attachments
      createdAt
      senderUser {
        id
        name
        avatar
      }
    }
  }
`);

function EmptyState() {
  return (
    <Empty className="border-none">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <MessageCircle />
        </EmptyMedia>
        <EmptyTitle>No messages yet</EmptyTitle>
        <EmptyDescription>
          Start the conversation by sending a message
        </EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
}

export default function MessageThread({
  conversation: conversationData,
  messages: initialMessages,
  currentUserId,
  conversationId,
  pageInfo: initialPageInfo,
}: Props) {
  const conversation = getFragmentData(
    ConversationItem_ConversationFragment,
    conversationData
  );
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const [isPending, startTransition] = useTransition();
  const [isLoadingEarlier, setIsLoadingEarlier] = useState(false);
  const [earlierMessages, setEarlierMessages] = useState<UnmaskedMessage[]>([]);
  const [pageInfo, setPageInfo] = useState(initialPageInfo);
  const [liveMessages, setLiveMessages] = useState<{
    conversationId: string;
    messages: UnmaskedMessage[];
  }>({ conversationId, messages: [] });

  const bookingStatus = conversation.booking?.status;
  const isArchived =
    bookingStatus === BookingStatus.Completed ||
    bookingStatus === BookingStatus.Cancelled;

  const otherParticipant = conversation.participants.find(
    (p) => p.user.id !== currentUserId
  );
  const otherParticipantLastReadAt = otherParticipant?.lastReadAt
    ? new Date(otherParticipant.lastReadAt)
    : null;

  api.useSubscription(OnMessageSubscription, {
    variables: { conversationId },
    skip: isArchived,
    onData: ({ data }) => {
      const newMessage = data.data?.onMessage;
      if (newMessage) {
        setLiveMessages((prev) => {
          if (prev.conversationId !== conversationId) {
            return {
              conversationId,
              messages: [newMessage as unknown as UnmaskedMessage],
            };
          }
          if (prev.messages.some((m) => m.id === newMessage.id)) return prev;
          return {
            conversationId,
            messages: [
              ...prev.messages,
              newMessage as unknown as UnmaskedMessage,
            ],
          };
        });
      }
    },
  });

  const messages = useMemo((): UnmaskedMessage[] => {
    const unmaskedInitial = initialMessages.map((m) =>
      getFragmentData(MessageBubble_MessageFragment, m)
    );
    const currentLiveMessages =
      liveMessages.conversationId === conversationId
        ? liveMessages.messages
        : [];
    const allMessages: UnmaskedMessage[] = [
      ...earlierMessages,
      ...unmaskedInitial,
      ...currentLiveMessages,
    ];
    const seen = new Set<string>();
    return allMessages.filter((m): m is UnmaskedMessage => {
      if (seen.has(m.id)) return false;
      seen.add(m.id);
      return true;
    });
  }, [initialMessages, earlierMessages, liveMessages, conversationId]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages.length]);

  useEffect(() => {
    startTransition(async () => {
      await markConversationRead(conversationId);
    });
  }, [conversationId]);

  const handleLoadEarlier = async () => {
    if (!pageInfo?.hasPreviousPage || !pageInfo?.startCursor) return;

    setIsLoadingEarlier(true);
    const result = await loadEarlierMessages(
      conversationId,
      pageInfo.startCursor
    );
    setIsLoadingEarlier(false);

    if (result.success && result.data) {
      const newMessages = (result.data.messages ??
        []) as unknown as UnmaskedMessage[];
      setEarlierMessages((prev) => [...newMessages, ...prev]);
      setPageInfo(result.data.pageInfo);
    } else {
      toast.error(result.message || "Failed to load earlier messages");
    }
  };

  const groupedMessages = useMemo(() => {
    const groups: { date: string; messages: UnmaskedMessage[] }[] = [];
    let currentDate = "";

    messages.forEach((message) => {
      const messageDate = new Date(message.createdAt).toLocaleDateString(
        "en-US",
        { month: "long", day: "numeric", year: "numeric" }
      );

      if (messageDate !== currentDate) {
        currentDate = messageDate;
        groups.push({ date: currentDate, messages: [] });
      }

      groups[groups.length - 1]?.messages.push(message);
    });

    return groups;
  }, [messages]);

  const handleSendMessage = async (content: string, attachments?: string[]) => {
    startTransition(async () => {
      const result = await sendMessage(conversationId, content, attachments);
      if (!result.success) {
        toast.error(result.message || "Failed to send message");
      }
    });
  };

  const shouldShowAvatar = (
    message: UnmaskedMessage,
    prevMessage: UnmaskedMessage | null
  ): boolean => {
    if (!prevMessage) return true;

    if (prevMessage.senderUser?.id !== message.senderUser?.id) return true;

    const timeDiff =
      new Date(message.createdAt).getTime() -
      new Date(prevMessage.createdAt).getTime();
    return timeDiff > 5 * 60 * 1000;
  };

  const lastOutgoingMessage = [...messages]
    .reverse()
    .find((m) => m.senderUser?.id === currentUserId);

  const isLastMessageRead =
    lastOutgoingMessage && otherParticipantLastReadAt
      ? new Date(lastOutgoingMessage.createdAt) <= otherParticipantLastReadAt
      : false;

  return (
    <>
      <div
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto"
        role="log"
        aria-label="Message thread"
      >
        {messages.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="py-4">
            {pageInfo?.hasPreviousPage && (
              <div className="flex justify-center pb-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLoadEarlier}
                  disabled={isLoadingEarlier}
                >
                  {isLoadingEarlier ? (
                    <>
                      <Loader2 className="mr-2 size-4 animate-spin" />
                      Loading...
                    </>
                  ) : (
                    "Load Earlier Messages"
                  )}
                </Button>
              </div>
            )}

            {groupedMessages.map((group, groupIndex) => (
              <div key={group.date}>
                {groupIndex > 0 && (
                  <div className="flex items-center gap-4 px-4 py-2">
                    <div className="bg-border h-px flex-1" />
                    <span className="text-muted-foreground text-xs font-medium">
                      {group.date}
                    </span>
                    <div className="bg-border h-px flex-1" />
                  </div>
                )}

                {group.messages.map((message, index) => {
                  const prevMessage =
                    index > 0 ? group.messages[index - 1] : null;
                  const showAvatar = shouldShowAvatar(
                    message,
                    prevMessage ?? null
                  );
                  const isCurrentUser =
                    message.senderUser?.id === currentUserId;
                  const isLastOutgoing =
                    isCurrentUser && message.id === lastOutgoingMessage?.id;

                  return (
                    <MessageBubble
                      key={message.id}
                      data={message as unknown as MessageData}
                      isCurrentUser={isCurrentUser}
                      showAvatar={showAvatar}
                      isRead={isLastMessageRead}
                      showReadReceipt={isLastOutgoing}
                    />
                  );
                })}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      <MessageComposer
        onSend={handleSendMessage}
        disabled={isPending || isArchived}
        placeholder={
          isArchived
            ? "This booking is closed. Messaging is disabled."
            : "Type a message..."
        }
      />
    </>
  );
}
