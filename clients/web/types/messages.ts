// ============================================
// Message Types
// ============================================

export type MessageSender = "ADVERTISER" | "SPACE_OWNER" | "SYSTEM";

export type MessageType = "TEXT" | "SYSTEM" | "FILE";

export interface MessageAttachment {
  id: string;
  fileName: string;
  fileUrl: string;
  fileSize: number; // bytes
  mimeType: string;
  thumbnailUrl?: string;
}

export interface Message {
  id: string;
  bookingId: string;
  sender: MessageSender;
  type: MessageType;
  content: string;
  attachments?: MessageAttachment[];
  createdAt: string; // ISO date string
  readAt?: string; // ISO date string
}

export interface Conversation {
  bookingId: string;
  spaceName: string;
  bookingStatus: string;
  lastMessage?: Message;
  unreadCount: number;
  updatedAt: string; // ISO date string
}

export interface ThreadContext {
  bookingId: string;
  spaceName: string;
  bookingStatus: string;
  spaceId: string;
}
