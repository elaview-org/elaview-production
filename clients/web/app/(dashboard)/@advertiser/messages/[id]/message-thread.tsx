"use client";

import { useEffect, useMemo, useRef } from "react";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/primitives/skeleton";
import { Button } from "@/components/primitives/button";
import { MessageBubble } from "./message-bubble";
import { MessageComposer } from "./message-composer";
import { ThreadHeader } from "./thread-header";
import type {
  Message,
  MessageAttachment,
  ThreadContext,
} from "../../../../../types/messages";

interface MessageThreadProps {
  context: ThreadContext;
  messages: Message[];
  currentUserId: string;
  isLoading?: boolean;
  onSendMessage: (content: string, attachments?: MessageAttachment[]) => void;
  onBack?: () => void;
  showBackButton?: boolean;
  disabled?: boolean;
}

// ============================================
// Loading Skeleton
// ============================================

function MessageThreadSkeleton() {
  return (
    <div className="flex h-full flex-col">
      <div className="border-b p-4">
        <Skeleton className="h-6 w-48" />
        <Skeleton className="mt-2 h-4 w-32" />
      </div>
      <div className="flex-1 space-y-4 p-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className={cn(
              "flex gap-2",
              i % 2 === 0 ? "flex-row-reverse" : "flex-row"
            )}
          >
            <Skeleton className="size-8 rounded-full" />
            <Skeleton className="h-16 w-48 rounded-2xl" />
          </div>
        ))}
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex h-full flex-col items-center justify-center p-8">
      <div className="text-center">
        <div className="bg-muted mx-auto mb-4 flex size-16 items-center justify-center rounded-full">
          <svg
            className="text-muted-foreground size-8"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
        </div>
        <h3 className="text-foreground text-sm font-semibold">
          No messages yet
        </h3>
        <p className="text-muted-foreground mt-1 text-xs">
          Start the conversation by sending a message
        </p>
      </div>
    </div>
  );
}

// ============================================
// Error State
// ============================================

export function ErrorState({ onRetry }: { onRetry?: () => void }) {
  return (
    <div className="flex h-full flex-col items-center justify-center p-8">
      <div className="text-center">
        <div className="bg-destructive/10 mx-auto mb-4 flex size-16 items-center justify-center rounded-full">
          <svg
            className="text-destructive size-8"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <h3 className="text-foreground text-sm font-semibold">
          Failed to load messages
        </h3>
        <p className="text-muted-foreground mt-1 text-xs">
          There was an error loading the conversation
        </p>
        {onRetry && (
          <Button
            variant="outline"
            size="sm"
            onClick={onRetry}
            className="mt-4"
          >
            Try again
          </Button>
        )}
      </div>
    </div>
  );
}

export function MessageThread({
  context,
  messages,
  currentUserId,
  isLoading = false,
  onSendMessage,
  onBack,
  showBackButton = false,
  disabled = false,
}: MessageThreadProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages.length]);
  console.log("currentUserId", currentUserId);
  // Determine if booking is archived/closed
  const isArchived = ["COMPLETED", "CANCELLED"].includes(context.bookingStatus);

  // Group messages by date for better organization
  const groupedMessages = useMemo(() => {
    const groups: { date: string; messages: Message[] }[] = [];
    let currentDate = "";

    messages.forEach((message) => {
      const messageDate = new Date(message.createdAt).toLocaleDateString(
        "en-US",
        {
          month: "long",
          day: "numeric",
          year: "numeric",
        }
      );

      if (messageDate !== currentDate) {
        currentDate = messageDate;
        groups.push({ date: currentDate, messages: [] });
      }

      groups[groups.length - 1]?.messages.push(message);
    });

    return groups;
  }, [messages]);

  if (isLoading) {
    return (
      <div className="flex h-full flex-col">
        <MessageThreadSkeleton />
      </div>
    );
  }
  return (
    <div className="flex h-full flex-col">
      <ThreadHeader
        context={context}
        onBack={onBack}
        showBackButton={showBackButton}
      />

      {/* Messages area */}
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
                {/* Date separator */}
                {groupIndex > 0 && (
                  <div className="flex items-center gap-4 px-4 py-2">
                    <div className="bg-border h-px flex-1" />
                    <span className="text-muted-foreground text-xs font-medium">
                      {group.date}
                    </span>
                    <div className="bg-border h-px flex-1" />
                  </div>
                )}

                {/* Messages in this group */}
                {group.messages.map((message, index) => {
                  const prevMessage =
                    index > 0 ? group.messages[index - 1] : null;
                  const showAvatar =
                    prevMessage === null ||
                    prevMessage.sender !== message.sender ||
                    new Date(message.createdAt).getTime() -
                      new Date(prevMessage.createdAt).getTime() >
                      5 * 60 * 1000; // 5 minutes

                  const isCurrentUser = message.sender === "ADVERTISER"; // In real app, check against current user

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
        onSend={onSendMessage}
        disabled={disabled || isArchived}
        placeholder={
          isArchived
            ? "This booking is closed. Messaging is disabled."
            : "Type a message..."
        }
      />
    </div>
  );
}
