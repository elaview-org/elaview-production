"use client";

import { usePathname } from "next/navigation";
import { ConversationList } from "./conversation-list";
import type { Conversation } from "@/types/types";

interface MessagesClientProps {
  conversations: Conversation[];
  initialSelectedBookingId?: string;
  children?: React.ReactNode;
}

export default function MessagesClient({
  conversations,
  initialSelectedBookingId,
  children,
}: MessagesClientProps) {
  const pathname = usePathname();

  const currentBookingId = pathname?.match(
    /\/bookings\/([^/]+)\/messages/
  )?.[1];
  const selectedBookingId = currentBookingId || initialSelectedBookingId;

  return (
    <div className="flex h-full flex-col">
      {children}
      <ConversationList
        conversations={conversations}
        selectedBookingId={selectedBookingId}
        isLoading={false}
      />
    </div>
  );
}
