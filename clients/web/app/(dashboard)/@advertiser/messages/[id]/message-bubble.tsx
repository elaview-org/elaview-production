"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/primitives/avatar";
import { Button } from "@/components/primitives/button";
import type { Message, MessageAttachment } from "../../../../../types/messages";
import { DownloadIcon, FileIcon } from "lucide-react";
import Image from "next/image";
// ============================================
// Types
// ============================================

interface MessageBubbleProps {
  message: Message;
  isCurrentUser: boolean;
  showAvatar?: boolean;
}

// ============================================
// Helpers
// ============================================

function formatTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;

  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

// ============================================
// Attachment Component
// ============================================

function AttachmentPreview({ attachment }: { attachment: MessageAttachment }) {
  // const FileIcon = getFileIcon(attachment.mimeType);
  const isImage = attachment.mimeType.startsWith("image/");

  return (
    <div className="group bg-muted/50 relative mt-2 overflow-hidden rounded-lg border">
      {isImage && attachment.thumbnailUrl ? (
        <div className="relative aspect-video w-full">
          <Image
            src={attachment.thumbnailUrl}
            alt={attachment.fileName}
            fill
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/10" />
        </div>
      ) : (
        <div className="flex items-center gap-3 p-3">
          <div className="bg-background flex size-10 items-center justify-center rounded">
            <FileIcon className="text-muted-foreground size-5" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">
              {attachment.fileName}
            </p>
            <p className="text-muted-foreground text-xs">
              {formatFileSize(attachment.fileSize)}
            </p>
          </div>
        </div>
      )}
      <div className="absolute right-2 bottom-2 opacity-0 transition-opacity group-hover:opacity-100">
        <Button
          size="icon-sm"
          variant="secondary"
          className="h-7 w-7"
          onClick={() => {
            // In real implementation, this would download the file
            window.open(attachment.fileUrl, "_blank");
          }}
          aria-label={`Download ${attachment.fileName}`}
        >
          <DownloadIcon className="size-3.5" />
        </Button>
      </div>
    </div>
  );
}

// ============================================
// Component
// ============================================

export function MessageBubble({
  message,
  isCurrentUser,
  showAvatar = true,
}: MessageBubbleProps) {
  const isSystem = message.sender === "SYSTEM";
  const senderInitials =
    message.sender === "ADVERTISER"
      ? "AD"
      : message.sender === "SPACE_OWNER"
        ? "SO"
        : "";

  if (isSystem) {
    return (
      <div className="flex justify-center py-2">
        <div className="bg-muted rounded-full px-3 py-1.5">
          <p className="text-muted-foreground text-xs">{message.content}</p>
          <time className="sr-only">{formatTime(message.createdAt)}</time>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex gap-2 px-4 py-2",
        isCurrentUser ? "flex-row-reverse" : "flex-row"
      )}
    >
      {showAvatar && (
        <Avatar className="size-8 shrink-0">
          <AvatarFallback className="text-xs">{senderInitials}</AvatarFallback>
        </Avatar>
      )}
      {!showAvatar && <div className="w-8 shrink-0" />}

      <div
        className={cn(
          "flex max-w-[75%] flex-col gap-1",
          isCurrentUser ? "items-end" : "items-start"
        )}
      >
        <div
          className={cn(
            "rounded-2xl px-4 py-2",
            isCurrentUser
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-foreground"
          )}
        >
          <p className="text-sm break-words whitespace-pre-wrap">
            {message.content}
          </p>

          {message.attachments && message.attachments.length > 0 && (
            <div className="mt-2 space-y-2">
              {message.attachments.map((attachment) => (
                <AttachmentPreview
                  key={attachment.id}
                  attachment={attachment}
                />
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 px-1">
          <time
            className="text-muted-foreground text-xs"
            dateTime={message.createdAt}
            title={new Date(message.createdAt).toLocaleString()}
          >
            {formatTime(message.createdAt)}
          </time>
          {isCurrentUser && message.readAt && (
            <span className="text-muted-foreground text-xs" title="Read">
              ✓
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
