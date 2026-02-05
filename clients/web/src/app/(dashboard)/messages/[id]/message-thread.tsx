"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  useTransition,
} from "react";
import { Loader2 } from "lucide-react";
import MessageBubble, { MessageBubble_MessageFragment } from "./message-bubble";
import { MessageComposer } from "./message-composer";
import {
  markConversationRead,
  sendMessage,
  loadEarlierMessages,
  notifyTypingAction,
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

const OnTypingSubscription = graphql(`
  subscription OnTyping($conversationId: ID!) {
    onTyping(conversationId: $conversationId) {
      conversationId
      userId
      userName
      userAvatar
      isTyping
      timestamp
    }
  }
`);

type TypingUser = {
  id: string;
  name: string;
  avatar: string | null;
  timestamp: number;
};

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

function TypingIndicator({ users }: { users: TypingUser[] }) {
  const text = useMemo(() => {
    if (users.length === 1) {
      return `${users[0].name} is typing`;
    }
    if (users.length === 2) {
      return `${users[0].name} and ${users[1].name} are typing`;
    }
    return `${users.length} people are typing`;
  }, [users]);

  return (
    <div className="bg-muted/30 border-t px-4 py-2">
      <div className="text-muted-foreground flex items-center gap-2 text-sm">
        <span>{text}</span>
        <span className="flex gap-0.5">
          <span className="bg-muted-foreground size-1 animate-bounce rounded-full [animation-delay:0ms]" />
          <span className="bg-muted-foreground size-1 animate-bounce rounded-full [animation-delay:150ms]" />
          <span className="bg-muted-foreground size-1 animate-bounce rounded-full [animation-delay:300ms]" />
        </span>
      </div>
    </div>
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
  const [typingUsers, setTypingUsers] = useState<Map<string, TypingUser>>(
    new Map()
  );
  const typingTimeoutsRef = useRef<Map<string, ReturnType<typeof setTimeout>>>(
    new Map()
  );

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

  api.useSubscription(OnTypingSubscription, {
    variables: { conversationId },
    skip: isArchived,
    onData: ({ data }) => {
      const typing = data.data?.onTyping;
      if (!typing || typing.userId === currentUserId) return;

      const userId = typing.userId;

      if (typingTimeoutsRef.current.has(userId)) {
        clearTimeout(typingTimeoutsRef.current.get(userId)!);
        typingTimeoutsRef.current.delete(userId);
      }

      if (typing.isTyping) {
        setTypingUsers((prev) => {
          const next = new Map(prev);
          next.set(userId, {
            id: userId,
            name: typing.userName,
            avatar: typing.userAvatar ?? null,
            timestamp: Date.now(),
          });
          return next;
        });

        const timeout = setTimeout(() => {
          setTypingUsers((prev) => {
            const next = new Map(prev);
            next.delete(userId);
            return next;
          });
          typingTimeoutsRef.current.delete(userId);
        }, 5000);
        typingTimeoutsRef.current.set(userId, timeout);
      } else {
        setTypingUsers((prev) => {
          const next = new Map(prev);
          next.delete(userId);
          return next;
        });
      }
    },
  });

  useEffect(() => {
    const timeouts = typingTimeoutsRef.current;
    return () => {
      timeouts.forEach((timeout) => clearTimeout(timeout));
      timeouts.clear();
    };
  }, []);

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

  const handleTypingChange = useCallback(
    (isTyping: boolean) => {
      notifyTypingAction(conversationId, isTyping);
    },
    [conversationId]
  );

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

  const typingUsersList = Array.from(typingUsers.values());

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

      {typingUsersList.length > 0 && (
        <TypingIndicator users={typingUsersList} />
      )}

      <MessageComposer
        onSend={handleSendMessage}
        onTypingChange={handleTypingChange}
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
