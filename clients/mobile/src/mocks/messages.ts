// Mock messages data for development
// These will be replaced with real API data later

export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: Date;
  read: boolean;
}

export interface Conversation {
  id: string;
  participantId: string;
  participantName: string;
  participantAvatar?: string;
  bookingId?: string;
  spaceTitle?: string;
  lastMessage: string;
  lastMessageTime: Date;
  unreadCount: number;
  messages: Message[];
}

export const mockConversations: Conversation[] = [
  {
    id: 'conv-1',
    participantId: 'owner-1',
    participantName: 'Sarah Chen',
    participantAvatar: undefined,
    bookingId: 'booking-1',
    spaceTitle: 'Downtown Coffee Shop Window',
    lastMessage: 'Your installation looks great! I\'ve approved the verification.',
    lastMessageTime: new Date('2026-01-06T14:30:00Z'),
    unreadCount: 2,
    messages: [
      {
        id: 'msg-1',
        senderId: 'user-1',
        senderName: 'Alex Johnson',
        content: 'Hi Sarah! I just submitted the installation photo for verification.',
        timestamp: new Date('2026-01-06T10:15:00Z'),
        read: true,
      },
      {
        id: 'msg-2',
        senderId: 'owner-1',
        senderName: 'Sarah Chen',
        content: 'Thanks Alex! Let me take a look.',
        timestamp: new Date('2026-01-06T11:00:00Z'),
        read: true,
      },
      {
        id: 'msg-3',
        senderId: 'owner-1',
        senderName: 'Sarah Chen',
        content: 'Your installation looks great! I\'ve approved the verification.',
        timestamp: new Date('2026-01-06T14:30:00Z'),
        read: false,
      },
    ],
  },
  {
    id: 'conv-2',
    participantId: 'owner-3',
    participantName: 'Emma Williams',
    participantAvatar: undefined,
    bookingId: 'booking-2',
    spaceTitle: 'Restaurant Digital Screen',
    lastMessage: 'Please let me know if you need any help with the content format.',
    lastMessageTime: new Date('2026-01-05T16:45:00Z'),
    unreadCount: 0,
    messages: [
      {
        id: 'msg-4',
        senderId: 'owner-3',
        senderName: 'Emma Williams',
        content: 'Welcome! Your booking has been confirmed. The screen supports 1080p video.',
        timestamp: new Date('2026-01-04T09:00:00Z'),
        read: true,
      },
      {
        id: 'msg-5',
        senderId: 'user-1',
        senderName: 'Alex Johnson',
        content: 'Perfect! I\'ll prepare the content in that format.',
        timestamp: new Date('2026-01-04T10:30:00Z'),
        read: true,
      },
      {
        id: 'msg-6',
        senderId: 'owner-3',
        senderName: 'Emma Williams',
        content: 'Please let me know if you need any help with the content format.',
        timestamp: new Date('2026-01-05T16:45:00Z'),
        read: true,
      },
    ],
  },
  {
    id: 'conv-3',
    participantId: 'owner-2',
    participantName: 'Mike Rodriguez',
    participantAvatar: undefined,
    bookingId: 'booking-3',
    spaceTitle: 'Gym Entrance Poster Board',
    lastMessage: 'I\'ll review your request and get back to you soon!',
    lastMessageTime: new Date('2026-01-06T09:20:00Z'),
    unreadCount: 1,
    messages: [
      {
        id: 'msg-7',
        senderId: 'user-1',
        senderName: 'Alex Johnson',
        content: 'Hi Mike, I just submitted a booking request for your poster board.',
        timestamp: new Date('2026-01-06T08:00:00Z'),
        read: true,
      },
      {
        id: 'msg-8',
        senderId: 'owner-2',
        senderName: 'Mike Rodriguez',
        content: 'I\'ll review your request and get back to you soon!',
        timestamp: new Date('2026-01-06T09:20:00Z'),
        read: false,
      },
    ],
  },
  {
    id: 'conv-4',
    participantId: 'support',
    participantName: 'Elaview Support',
    participantAvatar: undefined,
    lastMessage: 'Is there anything else we can help you with?',
    lastMessageTime: new Date('2026-01-03T15:00:00Z'),
    unreadCount: 0,
    messages: [
      {
        id: 'msg-9',
        senderId: 'user-1',
        senderName: 'Alex Johnson',
        content: 'How do I update my payment method?',
        timestamp: new Date('2026-01-03T14:00:00Z'),
        read: true,
      },
      {
        id: 'msg-10',
        senderId: 'support',
        senderName: 'Elaview Support',
        content: 'You can update your payment method in Profile > Payment Methods. Tap the card you want to update or add a new one.',
        timestamp: new Date('2026-01-03T14:30:00Z'),
        read: true,
      },
      {
        id: 'msg-11',
        senderId: 'support',
        senderName: 'Elaview Support',
        content: 'Is there anything else we can help you with?',
        timestamp: new Date('2026-01-03T15:00:00Z'),
        read: true,
      },
    ],
  },
];

// Helper to get total unread count
export function getTotalUnreadCount(conversations: Conversation[]): number {
  return conversations.reduce((sum, conv) => sum + conv.unreadCount, 0);
}

// Helper to format message time
export function formatMessageTime(date: Date): string {
  const now = new Date();
  const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) {
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  } else if (diffDays === 1) {
    return 'Yesterday';
  } else if (diffDays < 7) {
    return date.toLocaleDateString('en-US', { weekday: 'short' });
  } else {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }
}
