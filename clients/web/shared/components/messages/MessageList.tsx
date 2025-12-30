// src/components/messages/MessageList.tsx
"use client";

import { useEffect, useRef } from "react";
import { format } from "date-fns";
import { CheckCircle } from "lucide-react";
import { ProofCard } from "./ProofCard";

interface MessageSender {
  id: string;
  name: string | null;
  email: string;
  avatar: string | null;
}

interface MessageBooking {
  id: string;
  totalAmount: number;
  spaceOwnerAmount: number;
  pricePerDay: number;
  totalDays: number;
  proofUploadedAt: Date | null;
  campaign: {
    advertiserId: string;
  };
  space: {
    title: string;
    installationFee: number | null;
  };
}

interface MessageWithSender {
  id: string;
  campaignId: string;
  senderId: string;
  content: string;
  isRead: boolean;
  attachments: string[];
  createdAt: Date;
  messageType: string;
  bookingId: string | null;
  proofStatus: string | null;
  proofApprovedAt: Date | null;
  proofApprovedBy: string | null;
  autoApprovedAt: Date | null;
  proofDisputedAt: Date | null;
  disputeReason: string | null;
  sender: MessageSender;
  booking: MessageBooking | null;
}

interface MessageListProps {
  messages: MessageWithSender[];
  currentUserId: string;
  userRole: "ADVERTISER" | "SPACE_OWNER";
}

export function MessageList({ messages, currentUserId, userRole }: MessageListProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // DEBUG: Log message data to help diagnose display issues
  useEffect(() => {
    console.log('🔍 [MessageList Debug]', {
      messagesReceived: messages,
      messageCount: messages?.length || 0,
      firstMessage: messages?.[0],
      lastMessage: messages?.[messages.length - 1],
      messageTypes: messages?.map(m => m.messageType) || [],
      currentUserId,
      userRole,
    });
  }, [messages, currentUserId, userRole]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (messages.length === 0) {
    return (
      <div className="flex h-full items-center justify-center p-8">
        <div className="text-center">
          <p className="text-slate-500">No messages yet</p>
          <p className="mt-2 text-sm text-slate-400">
            Start the conversation by sending a message
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 p-4">
      {messages.map((message) => {
        const isOwnMessage = message.senderId === currentUserId;
        const isSystemMessage = message.messageType === "SYSTEM" || 
                                message.messageType === "PROOF_APPROVED" || 
                                message.messageType === "PROOF_DISPUTED";
        const isProofSubmission = message.messageType === "PROOF_SUBMISSION";

        if (isSystemMessage) {
          return (
            <div key={message.id} className="flex justify-center">
              <div className="max-w-md rounded-lg bg-slate-800 border border-slate-700 px-4 py-2 text-center">
                <p className="text-sm text-slate-300">{message.content}</p>
                <p className="mt-1 text-xs text-slate-500">
                  {format(new Date(message.createdAt), "MMM d, h:mm a")}
                </p>
              </div>
            </div>
          );
        }

        if (isProofSubmission && message.booking) {
          // FIX: Check campaign ownership, not user role
          // A space owner could also buy ads, so role doesn't matter
          const isBuyer = message.booking.campaign.advertiserId === currentUserId;

          return (
            <div
              key={message.id}
              className={`flex ${isOwnMessage ? "justify-end" : "justify-start"}`}
            >
              <ProofCard
                message={message as any}
                booking={{
                  id: message.booking.id,
                  totalAmount: message.booking.totalAmount,
                  spaceOwnerAmount: message.booking.spaceOwnerAmount,
                  pricePerDay: message.booking.pricePerDay,
                  totalDays: message.booking.totalDays,
                  proofUploadedAt: message.booking.proofUploadedAt,
                  space: message.booking.space,
                }}
                isAdvertiser={isBuyer}
                isOwnMessage={isOwnMessage}
              />
            </div>
          );
        }

        return (
          <div
            key={message.id}
            className={`flex ${isOwnMessage ? "justify-end" : "justify-start"}`}
          >
            <div className={`max-w-md ${isOwnMessage ? "items-end" : "items-start"} flex flex-col gap-1`}>
              {!isOwnMessage && (
                <span className="text-xs font-medium text-slate-400">
                  {message.sender.name || message.sender.email}
                </span>
              )}

              <div
                className={`rounded-lg px-4 py-2 ${
                  isOwnMessage
                    ? "bg-blue-600 text-white"
                    : "bg-slate-800 border border-slate-700 text-slate-100"
                }`}
              >
                <p className="text-sm">{message.content}</p>
                
                {message.attachments && message.attachments.length > 0 && !isProofSubmission && (
                <div className="mt-2 grid grid-cols-2 gap-2">
                {message.attachments.map((url, index) => (
                <a key={index} href={url} target="_blank" rel="noopener noreferrer" className="overflow-hidden rounded">
                <img src={url} alt={`Attachment ${index + 1}`} className="h-32 w-full object-cover hover:opacity-90 transition-opacity" />
                </a>
        ))}
  </div>
)}
              </div>

              <div className="flex items-center gap-2">
                <span className={`text-xs ${isOwnMessage ? "text-blue-400" : "text-slate-500"}`}>
                  {format(new Date(message.createdAt), "h:mm a")}
                </span>
                {isOwnMessage && message.isRead && (
                  <CheckCircle className="h-3 w-3 text-blue-400" />
                )}
              </div>
            </div>
          </div>
        );
      })}
      <div ref={messagesEndRef} />
    </div>
  );
}