import type {
  Conversation,
  Message,
  ThreadContext,
} from "../../../../types/messages";

// ============================================
// Mock Data
// ============================================

export const mockThreadContext: ThreadContext = {
  bookingId: "booking-123",
  spaceName: "Coffee Shop Window Display",
  bookingStatus: "PAID",
  spaceId: "space-456",
};

export const mockConversations: Conversation[] = [
  {
    bookingId: "booking-123",
    spaceName: "Coffee Shop Window Display",
    bookingStatus: "PAID",
    unreadCount: 2,
    updatedAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 min ago
    lastMessage: {
      id: "msg-1",
      bookingId: "booking-123",
      sender: "SPACE_OWNER",
      type: "TEXT",
      content:
        "I've uploaded the verification photos. Please review when you have a chance.",
      createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    },
  },
  {
    bookingId: "booking-124",
    spaceName: "Dry Cleaner Bulletin Board",
    bookingStatus: "ACCEPTED",
    unreadCount: 0,
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
    lastMessage: {
      id: "msg-2",
      bookingId: "booking-124",
      sender: "ADVERTISER",
      type: "TEXT",
      content: "Thanks for accepting! I'll send the creative file soon.",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    },
  },
  {
    bookingId: "booking-125",
    spaceName: "Barbershop Wall Mount",
    bookingStatus: "VERIFIED",
    unreadCount: 0,
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
    lastMessage: {
      id: "msg-3",
      bookingId: "booking-125",
      sender: "SYSTEM",
      type: "SYSTEM",
      content: "Booking has been verified and completed.",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    },
  },
];

export const mockMessages: Message[] = [
  {
    id: "msg-1",
    bookingId: "booking-123",
    sender: "ADVERTISER",
    type: "TEXT",
    content:
      "Hi! I'm interested in booking your window display for my restaurant opening.",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
    readAt: new Date(
      Date.now() - 1000 * 60 * 60 * 24 * 3 + 1000 * 60 * 10
    ).toISOString(),
  },
  {
    id: "msg-2",
    bookingId: "booking-123",
    sender: "SPACE_OWNER",
    type: "TEXT",
    content: "Great! I'd be happy to help. When are you looking to start?",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
    readAt: new Date(
      Date.now() - 1000 * 60 * 60 * 24 * 2 + 1000 * 60 * 5
    ).toISOString(),
  },
  {
    id: "msg-3",
    bookingId: "booking-123",
    sender: "ADVERTISER",
    type: "TEXT",
    content:
      "Looking to start next Monday if possible. I'll submit the booking request now.",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
    readAt: new Date(
      Date.now() - 1000 * 60 * 60 * 24 * 2 + 1000 * 60 * 15
    ).toISOString(),
  },
  {
    id: "msg-4",
    bookingId: "booking-123",
    sender: "SYSTEM",
    type: "SYSTEM",
    content: "Booking request has been submitted.",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
  },
  {
    id: "msg-5",
    bookingId: "booking-123",
    sender: "SYSTEM",
    type: "SYSTEM",
    content: "Booking has been accepted and payment received.",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 20).toISOString(),
  },
  {
    id: "msg-6",
    bookingId: "booking-123",
    sender: "SPACE_OWNER",
    type: "TEXT",
    content:
      "I've downloaded the creative file. Will print and install tomorrow morning.",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 18).toISOString(),
    readAt: new Date(
      Date.now() - 1000 * 60 * 60 * 18 + 1000 * 60 * 5
    ).toISOString(),
  },
  {
    id: "msg-7",
    bookingId: "booking-123",
    sender: "SPACE_OWNER",
    type: "FILE",
    content: "Here's the installation photo",
    attachments: [
      {
        id: "att-1",
        fileName: "installation-photo.jpg",
        fileUrl:
          "/components/assets/images/still-b742de551ffe7ebf2eda37f96ab92d00.webp",
        fileSize: 2048000,
        mimeType: "image/jpeg",
        thumbnailUrl:
          "/components/assets/images/still-b742de551ffe7ebf2eda37f96ab92d00.webp",
      },
    ],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
    readAt: new Date(
      Date.now() - 1000 * 60 * 60 * 12 + 1000 * 60 * 2
    ).toISOString(),
  },
  {
    id: "msg-8",
    bookingId: "booking-123",
    sender: "SPACE_OWNER",
    type: "TEXT",
    content:
      "I've uploaded the verification photos. Please review when you have a chance.",
    createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
  },
];
