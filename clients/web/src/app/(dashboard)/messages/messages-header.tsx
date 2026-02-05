type Props = {
  conversationCount: number;
  unreadCount?: number;
};

export default function MessagesHeader({
  conversationCount,
  unreadCount = 0,
}: Props) {
  return (
    <div className="border-b px-4 py-3">
      <div className="flex items-center gap-2">
        <h1 className="text-lg font-semibold">Messages</h1>
        {unreadCount > 0 && (
          <span className="bg-primary text-primary-foreground rounded-full px-2 py-0.5 text-xs font-medium">
            {unreadCount}
          </span>
        )}
      </div>
      <p className="text-muted-foreground text-xs">
        {conversationCount} conversation{conversationCount !== 1 ? "s" : ""}
      </p>
    </div>
  );
}
