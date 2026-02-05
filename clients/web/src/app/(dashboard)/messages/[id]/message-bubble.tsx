"use client";

import { cn, getInitials } from "@/lib/utils";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/primitives/avatar";
import { Button } from "@/components/primitives/button";
import { DownloadIcon, FileIcon } from "lucide-react";
import Image from "next/image";
import {
  graphql,
  getFragmentData,
  MessageType,
  type FragmentType,
} from "@/types/gql";

export const MessageBubble_MessageFragment = graphql(`
  fragment MessageBubble_MessageFragment on Message {
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
`);

type Props = {
  data: FragmentType<typeof MessageBubble_MessageFragment>;
  isCurrentUser: boolean;
  showAvatar?: boolean;
  isRead?: boolean;
  showReadReceipt?: boolean;
};

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

function getFileNameFromUrl(url: string): string {
  try {
    const pathname = new URL(url).pathname;
    const fileName = pathname.split("/").pop() || "file";
    return decodeURIComponent(fileName);
  } catch {
    return url.split("/").pop() || "file";
  }
}

function isImageUrl(url: string): boolean {
  const imageExtensions = [".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg"];
  const lowerUrl = url.toLowerCase();
  return imageExtensions.some((ext) => lowerUrl.includes(ext));
}

function AttachmentPreview({ url }: { url: string }) {
  const fileName = getFileNameFromUrl(url);
  const isImage = isImageUrl(url);

  return (
    <div className="group bg-muted/50 relative mt-2 overflow-hidden rounded-lg border">
      {isImage ? (
        <div className="relative aspect-video w-full max-w-xs">
          <Image
            src={url}
            alt={fileName}
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
            <p className="truncate text-sm font-medium">{fileName}</p>
          </div>
        </div>
      )}
      <div className="absolute right-2 bottom-2 opacity-0 transition-opacity group-hover:opacity-100">
        <Button
          size="icon-sm"
          variant="secondary"
          className="h-7 w-7"
          onClick={() => window.open(url, "_blank")}
          aria-label={`Download ${fileName}`}
        >
          <DownloadIcon className="size-3.5" />
        </Button>
      </div>
    </div>
  );
}

export default function MessageBubble({
  data,
  isCurrentUser,
  showAvatar = true,
  isRead = false,
  showReadReceipt = false,
}: Props) {
  const message = getFragmentData(MessageBubble_MessageFragment, data);
  const isSystem = message.type === MessageType.System;
  const senderName = message.senderUser?.name ?? "Unknown";
  const senderAvatar = message.senderUser?.avatar;

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
          {senderAvatar && <AvatarImage src={senderAvatar} alt={senderName} />}
          <AvatarFallback className="text-xs">
            {getInitials(senderName)}
          </AvatarFallback>
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
          <p className="text-sm wrap-break-word whitespace-pre-wrap">
            {message.content}
          </p>

          {message.attachments && message.attachments.length > 0 && (
            <div className="mt-2 space-y-2">
              {message.attachments.map((url, index) => (
                <AttachmentPreview key={index} url={url} />
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
          {isCurrentUser && showReadReceipt && (
            <span className="text-muted-foreground text-xs">
              {isRead ? "Seen" : "Sent"}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
