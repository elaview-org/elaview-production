import Link from "next/link";
import { cn, formatTime, truncateText, getInitials } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/primitives/avatar";
import { Badge } from "@/components/primitives/badge";
import { MessageType, type MessagesDataQuery } from "@/types/gql";

type Conversation = NonNullable<
  NonNullable<MessagesDataQuery["myConversations"]>["nodes"]
>[number];

type Props = {
  conversation: Conversation;
  isSelected: boolean;
  currentUserId: string;
};

export default function ConversationItem({
  conversation,
  isSelected,
  currentUserId,
}: Props) {
  const spaceName = conversation.booking?.space?.title ?? "Unknown Space";
  const bookingId = conversation.booking?.id;
  const lastMessage = conversation.messages?.nodes?.[0];
  const otherParticipant = conversation.participants.find(
    (p) => p.user.id !== currentUserId
  );

  const lastMessagePreview = lastMessage
    ? lastMessage.type === MessageType.System
      ? truncateText(lastMessage.content, 60)
      : truncateText(lastMessage.content, 60)
    : "No messages yet";

  const myParticipant = conversation.participants.find(
    (p) => p.user.id === currentUserId
  );
  const hasUnread =
    lastMessage &&
    myParticipant?.lastReadAt &&
    new Date(lastMessage.createdAt) > new Date(myParticipant.lastReadAt);

  const href = `/messages/${conversation.id}`;

  return (
    <Link
      href={href}
      className={cn(
        "block w-full text-left transition-colors",
        "hover:bg-muted/50 focus-visible:bg-muted/50 focus-visible:outline-none",
        isSelected && "bg-muted"
      )}
      aria-label={`Open conversation for ${spaceName}`}
    >
      <div className="flex items-start gap-3 px-4 py-3">
        <Avatar className="size-10 shrink-0">
          {otherParticipant?.user.avatar && (
            <AvatarImage
              src={otherParticipant.user.avatar}
              alt={otherParticipant.user.name ?? ""}
            />
          )}
          <AvatarFallback className="text-xs">
            {getInitials(otherParticipant?.user.name ?? spaceName)}
          </AvatarFallback>
        </Avatar>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <h3 className="truncate text-sm font-semibold">{spaceName}</h3>
            {lastMessage && (
              <time
                className="text-muted-foreground shrink-0 text-xs"
                dateTime={lastMessage.createdAt}
              >
                {formatTime(lastMessage.createdAt)}
              </time>
            )}
          </div>

          <div className="mt-1 flex items-center gap-2">
            <p className="text-muted-foreground truncate text-xs">
              {lastMessagePreview}
            </p>
            {hasUnread && (
              <span className="bg-primary size-2 shrink-0 rounded-full" />
            )}
          </div>

          {bookingId && (
            <div className="mt-1">
              <Badge variant="outline" className="text-[10px]">
                Booking #{bookingId.split("-")[0]}
              </Badge>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
