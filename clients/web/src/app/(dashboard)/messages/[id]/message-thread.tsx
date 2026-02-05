"use client";

import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import MessageBubble from "./message-bubble";
import { MessageComposer } from "./message-composer";
import { markConversationRead, sendMessage } from "./actions";
import { toast } from "sonner";
import { BookingStatus, graphql, type ThreadDataQuery } from "@/types/gql";
import api from "@/lib/gql/client";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/primitives/empty";
import { MessageCircle } from "lucide-react";

type Conversation = NonNullable<
  NonNullable<ThreadDataQuery["myConversations"]>["nodes"]
>[number];

type Message = NonNullable<
  NonNullable<ThreadDataQuery["messagesByConversation"]>["nodes"]
>[number];

type Props = {
  conversation: Conversation;
  messages: Message[];
  currentUserId: string;
  conversationId: string;
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
  conversation,
  messages: initialMessages,
  currentUserId,
  conversationId,
}: Props) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const [isPending, startTransition] = useTransition();
  const [liveMessages, setLiveMessages] = useState<{
    conversationId: string;
    messages: Message[];
  }>({ conversationId, messages: [] });

  const bookingStatus = conversation.booking?.status;
  const isArchived =
    bookingStatus === BookingStatus.Completed ||
    bookingStatus === BookingStatus.Cancelled;

  api.useSubscription(OnMessageSubscription, {
    variables: { conversationId },
    skip: isArchived,
    onData: ({ data }) => {
      const newMessage = data.data?.onMessage;
      if (newMessage) {
        setLiveMessages((prev) => {
          if (prev.conversationId !== conversationId) {
            return { conversationId, messages: [newMessage as Message] };
          }
          if (prev.messages.some((m) => m.id === newMessage.id)) return prev;
          return {
            conversationId,
            messages: [...prev.messages, newMessage as Message],
          };
        });
      }
    },
  });

  const messages = useMemo(() => {
    const currentLiveMessages =
      liveMessages.conversationId === conversationId
        ? liveMessages.messages
        : [];
    const allMessages = [...initialMessages, ...currentLiveMessages];
    const seen = new Set<string>();
    return allMessages.filter((m) => {
      if (seen.has(m.id)) return false;
      seen.add(m.id);
      return true;
    });
  }, [initialMessages, liveMessages, conversationId]);

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

  const groupedMessages = useMemo(() => {
    const groups: { date: string; messages: Message[] }[] = [];
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
    message: Message,
    prevMessage: Message | null
  ): boolean => {
    if (!prevMessage) return true;

    if (prevMessage.senderUser?.id !== message.senderUser?.id) return true;

    const timeDiff =
      new Date(message.createdAt).getTime() -
      new Date(prevMessage.createdAt).getTime();
    return timeDiff > 5 * 60 * 1000;
  };

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

                  return (
                    <MessageBubble
                      key={message.id}
                      message={message}
                      isCurrentUser={isCurrentUser}
                      showAvatar={showAvatar}
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
