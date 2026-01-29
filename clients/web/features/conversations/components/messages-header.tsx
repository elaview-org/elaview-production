interface MessagesHeaderProps {
  conversationCount: number;
}

export default function MessagesHeader({
  conversationCount,
}: MessagesHeaderProps) {
  return (
    <div className="border-b px-4 py-3">
      <h1 className="text-lg font-semibold">Messages</h1>
      <p className="text-muted-foreground text-xs">
        {conversationCount} conversation{conversationCount !== 1 ? "s" : ""}
      </p>
    </div>
  );
}
