"use client";

import { useIsMobile } from "@/lib/hooks/use-mobile";
import MessagesHeader from "./messages-header";
import InboxPanel from "./inbox-panel";
import { WelcomeChat } from "./welcome-chat";
import type { Conversation } from "@/types/messages";

interface MessagesClientProps {
  conversations: Conversation[];
}

export default function MessagesClient({ conversations }: MessagesClientProps) {
  const isMobile = useIsMobile();

  return (
    <div className="flex h-full overflow-hidden">
      {/* Inbox Panel - Always visible, full width on mobile, fixed width on desktop */}
      <InboxPanel
        conversations={conversations}
        initialSelectedBookingId={undefined}
      >
        <MessagesHeader conversationCount={conversations.length} />
      </InboxPanel>

      {/* Welcome Chat - Hidden on mobile, visible on desktop when no conversation selected */}
      {!isMobile && <WelcomeChat />}
    </div>
  );
}
