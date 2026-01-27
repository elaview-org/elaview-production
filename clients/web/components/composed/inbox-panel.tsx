"use client";

import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { ConversationList } from "./conversation-list";
import type { Conversation } from "@/types/types";

interface MessagesClientProps {
  conversations: Conversation[];
  initialSelectedBookingId?: string;
  children?: React.ReactNode;
}

export default function InboxPanel({
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
    <div
      className={cn(
        "bg-background flex flex-col border-r",
        "w-full max-w-sm md:max-w-sm"
      )}
    >
      {/** header */}
      {children}
      {/** body */}
      <ConversationList
        conversations={conversations}
        selectedBookingId={selectedBookingId}
        isLoading={false}
      />
    </div>
  );
}
