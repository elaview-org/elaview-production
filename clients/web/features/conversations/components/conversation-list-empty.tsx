export function ConversationListEmpty() {
  return (
    <div className="flex h-full items-center justify-center p-8">
      <div className="text-center">
        <p className="text-foreground text-sm font-medium">No conversations</p>
        <p className="text-muted-foreground mt-1 text-xs">
          Start a booking to begin messaging
        </p>
      </div>
    </div>
  );
}
