"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useIsMobile } from "@/lib/hooks/use-mobile";
import { MessageThread } from "./message-thread";
import type {
  Conversation,
  Message,
  MessageAttachment,
  ThreadContext,
} from "@/types/messages";
import { mockMessages } from "@/app/(dashboard)/messages/mock-data";
import ConditionalRender from "@/components/composed/conditionally-render";
import MessagesHeader from "../messages-header";
import InboxPanel from "@/app/(dashboard)/messages/inbox-panel";

type ViewState = "list" | "thread";

interface MessagesClientProps {
  conversations: Conversation[];
  initialMessages: Message[];
  initialThreadContext: ThreadContext | null;
  bookingId: string;
}

export default function DisplayMessages({
  conversations,
  initialMessages,
  initialThreadContext,
  bookingId,
}: MessagesClientProps) {
  const router = useRouter();
  const isMobile = useIsMobile();

  const [viewState, setViewState] = useState<ViewState>("thread");
  const [
    selectedBookingId,
    // setSelectedBookingId
  ] = useState<string | undefined>(bookingId);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [threadContext, setThreadContext] = useState<ThreadContext | null>(
    initialThreadContext
  );

  // Sync selectedBookingId with URL params when they change
  // useEffect(() => {
  //   if (bookingId && bookingId !== selectedBookingId) {
  //     setSelectedBookingId(bookingId);
  //   }
  // }, [bookingId, selectedBookingId]);

  // Load messages when booking is selected
  useEffect(() => {
    // if (!selectedBookingId) {
    //   setMessages([]);
    //   setThreadContext(null);
    //   setIsLoading(false);
    //   return;
    // }

    // setIsLoading(true);
    // setError(null);

    // Simulate API call - in real app, this would fetch from API
    setTimeout(() => {
      try {
        // In real app, fetch messages for this booking
        const bookingMessages = mockMessages.filter(
          (msg: Message) => msg.bookingId === selectedBookingId
        );

        // Find conversation context
        const conversation = conversations.find(
          (conv) => conv.bookingId === selectedBookingId
        );

        if (conversation) {
          setThreadContext({
            bookingId: conversation.bookingId,
            spaceName: conversation.spaceName,
            bookingStatus: conversation.bookingStatus,
            spaceId: "space-456", // In real app, fetch from booking
          });
        }

        setMessages(bookingMessages);
        setIsLoading(false);
      } catch (err) {
        setError(
          err instanceof Error ? err : new Error("Failed to load messages")
        );
        setIsLoading(false);
      }
    }, 500);
  }, [selectedBookingId, conversations]);

  // Handle back navigation on mobile
  const handleBack = () => {
    if (isMobile) {
      setViewState("list");
      router.push("/messages");
    }
  };

  // Handle sending message
  const handleSendMessage = async (
    content: string,
    attachments?: MessageAttachment[]
  ) => {
    if (!selectedBookingId || !threadContext) return;

    // In real app, this would call an API mutation
    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      bookingId: selectedBookingId,
      sender: "ADVERTISER", // In real app, get from auth context
      type: attachments && attachments.length > 0 ? "FILE" : "TEXT",
      content,
      attachments,
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, newMessage]);
  };

  // Determine if we should show list or thread
  const showList = isMobile ? viewState === "list" : true;
  const showThread = isMobile
    ? viewState === "thread" && selectedBookingId
    : selectedBookingId;

  if (error && !selectedBookingId) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <p className="text-destructive text-sm font-medium">
            Error loading conversations
          </p>
          <button
            onClick={() => {
              setError(null);
              window.location.reload();
            }}
            className="text-primary mt-2 text-sm hover:underline"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full overflow-hidden">
      <ConditionalRender
        condition={showList}
        show={
          <InboxPanel
            conversations={conversations}
            initialSelectedBookingId={selectedBookingId}
          >
            <MessagesHeader conversationCount={conversations.length} />
          </InboxPanel>
        }
      />
      <ConditionalRender
        condition={(showThread && threadContext) as boolean}
        show={
          <div className="flex flex-1 flex-col">
            <MessageThread
              context={threadContext as ThreadContext}
              messages={messages}
              currentUserId="advertiser-1"
              isLoading={isLoading}
              onSendMessage={handleSendMessage}
              onBack={handleBack}
              showBackButton={isMobile}
              disabled={false}
            />
          </div>
        }
      />
    </div>
  );
}
