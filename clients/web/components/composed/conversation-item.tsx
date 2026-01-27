import Link from "next/link";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/primitives/avatar";
import { Badge } from "@/components/primitives/badge";
import type { Conversation } from "../../types/types";
import { formatTime } from "../../lib/time-format";
import { truncateText } from "../../utils";

interface ConversationItemProps {
  conversation: Conversation;
  isSelected: boolean;
}

export function ConversationItem({
  conversation,
  isSelected,
}: ConversationItemProps) {
  const lastMessagePreview = conversation.lastMessage
    ? truncateText(conversation.lastMessage.content, 60)
    : "No messages yet";

  const href = `/messages/${conversation.bookingId}`;

  return (
    <Link
      href={href}
      className={cn(
        "block w-full text-left transition-colors",
        "hover:bg-muted/50 focus-visible:bg-muted/50 focus-visible:outline-none",
        isSelected && "bg-muted"
      )}
      aria-label={`Open conversation for ${conversation.spaceName}`}
    >
      <div className="flex items-start gap-3 px-4 py-3">
        <Avatar className="size-10 shrink-0">
          <AvatarFallback className="text-xs">
            {conversation.spaceName
              .split(" ")
              .map((word) => word[0])
              .join("")
              .slice(0, 2)
              .toUpperCase()}
          </AvatarFallback>
        </Avatar>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <h3 className="truncate text-sm font-semibold">
              {conversation.spaceName}
            </h3>
            {conversation.lastMessage && (
              <time
                className="text-muted-foreground shrink-0 text-xs"
                dateTime={conversation.lastMessage.createdAt}
              >
                {formatTime(conversation.lastMessage.createdAt)}
              </time>
            )}
          </div>

          <div className="mt-1 flex items-center gap-2">
            <p className="text-muted-foreground truncate text-xs">
              {lastMessagePreview}
            </p>
            {conversation.unreadCount > 0 && (
              <Badge
                variant="default"
                className="shrink-0 px-1.5 py-0 text-[10px]"
              >
                {conversation.unreadCount}
              </Badge>
            )}
          </div>

          <div className="mt-1">
            <Badge variant="outline" className="text-[10px]">
              Booking #{conversation.bookingId.split("-")[1]}
            </Badge>
          </div>
        </div>
      </div>
    </Link>
  );
}
