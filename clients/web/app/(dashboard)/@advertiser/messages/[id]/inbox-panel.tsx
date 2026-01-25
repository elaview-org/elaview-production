import { cn } from "@/lib/utils";
import { ConversationList } from "@/components/composed/conversation-list";
import type { Conversation } from "@/types/types";

interface InboxPanelProps {
  isLoading: boolean;
  selectedBookingId?: string;
  conversations: Conversation[];
}

/**
 * Server component for inbox panel
 * Displays conversation list
 * Uses CSS for responsive behavior instead of JS
 */
export function InboxPanel({
  isLoading,
  conversations,
  selectedBookingId,
}: InboxPanelProps) {
  return (
    <div
      className={cn(
        "bg-background flex flex-col border-r",
        "w-full max-w-sm md:max-w-sm" // Responsive via CSS
      )}
    >
      <div className="border-b px-4 py-3">
        <h1 className="text-lg font-semibold">Messages</h1>
        <p className="text-muted-foreground text-xs">
          {conversations.length} conversation
          {conversations.length !== 1 ? "s" : ""}
        </p>
      </div>
      <ConversationList
        conversations={conversations}
        selectedBookingId={selectedBookingId}
        isLoading={isLoading && !selectedBookingId}
      />
    </div>
  );
}
