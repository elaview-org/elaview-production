// src/components/messages/ConversationCard.tsx
"use client";

import { MessageSquare, MapPin, Camera } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface ConversationCardProps {
  conversation: {
    id: string;
    type: 'ADVERTISER' | 'SPACE_OWNER';
    campaignName: string;
    campaignImage: string | null;
    spaceName: string | null;
    spaceLocation: string | null;
    spaceImage: string | null;
    bookingStatus: string | null;
    proofStatus: string | null;
    proofUploadedAt: Date | null;
    otherParty: {
      id: string | undefined;
      name: string | null;
      email: string | null;
      avatar: string | null;
    };
    lastMessage: {
      content: string;
      timestamp: Date;
      isOwn: boolean;
      type: string;
    } | null;
    unreadCount: number;
    updatedAt: Date;
  };
  isActive: boolean;
  onClick: () => void;
}

const BOOKING_STATUS_COLORS = {
  APPROVED: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  CONFIRMED: 'bg-green-500/10 text-green-400 border-green-500/20',
  PENDING_BALANCE: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  ACTIVE: 'bg-green-500/10 text-green-400 border-green-500/20',
  COMPLETED: 'bg-slate-500/10 text-slate-400 border-slate-500/20',
};

export function ConversationCard({ conversation, isActive, onClick }: ConversationCardProps) {
  const displayImage = conversation.type === 'ADVERTISER' 
    ? conversation.spaceImage || conversation.campaignImage
    : conversation.campaignImage;

  const primaryText = conversation.type === 'ADVERTISER'
    ? conversation.spaceName
    : conversation.campaignName;

  const secondaryText = conversation.type === 'ADVERTISER'
    ? conversation.otherParty.name || conversation.otherParty.email
    : conversation.otherParty.name || conversation.otherParty.email;

  // Check if photo is required (space owner needs to upload proof)
  const needsProofUpload = 
    conversation.type === 'SPACE_OWNER' && 
    conversation.bookingStatus === 'CONFIRMED' &&
    !conversation.proofUploadedAt;

  const getMessagePreview = () => {
    if (!conversation.lastMessage) return "No messages yet";
    
    const content = conversation.lastMessage.content;
    const prefix = conversation.lastMessage.isOwn ? "You: " : "";
    
    // Shorten proof submission messages
    if (conversation.lastMessage.type === 'PROOF_SUBMISSION') {
      return `${prefix}📸 Installation proof`;
    }
    
    // Truncate long messages
    const maxLength = 50;
    if (content.length > maxLength) {
      return `${prefix}${content.substring(0, maxLength)}...`;
    }
    
    return `${prefix}${content}`;
  };

  const formatTimestamp = (date: Date) => {
    return formatDistanceToNow(new Date(date), { addSuffix: true })
      .replace('about ', '')
      .replace(' ago', '');
  };

  return (
    <button
      onClick={onClick}
      className={`
        w-full text-left px-4 py-3 transition-colors
        ${isActive 
          ? 'bg-slate-800 border-l-4 border-blue-500' 
          : 'hover:bg-slate-800/50 border-l-4 border-transparent'
        }
      `}
    >
      <div className="flex items-center gap-3">
        {/* Avatar/Image */}
        <div className="relative flex-shrink-0">
          <div className="w-12 h-12 rounded-full overflow-hidden bg-slate-800 border-2 border-slate-700">
            {displayImage ? (
              <img
                src={displayImage}
                alt={primaryText || 'Conversation'}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=100';
                }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <MessageSquare className="h-6 w-6 text-slate-600" />
              </div>
            )}
          </div>
          {conversation.unreadCount > 0 && (
            <div className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs font-bold rounded-full min-w-[20px] h-5 flex items-center justify-center px-1.5">
              {conversation.unreadCount > 9 ? '9+' : conversation.unreadCount}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline justify-between gap-2 mb-1">
            <h3 className={`font-semibold truncate ${
              conversation.unreadCount > 0 ? 'text-white' : 'text-slate-200'
            }`}>
              {primaryText}
            </h3>
            <span className="text-xs text-slate-500 flex-shrink-0">
              {conversation.lastMessage && formatTimestamp(conversation.lastMessage.timestamp)}
            </span>
          </div>

          <p className={`text-sm truncate ${
            conversation.unreadCount > 0 ? 'text-slate-300 font-medium' : 'text-slate-500'
          }`}>
            {getMessagePreview()}
          </p>

          {/* Location/Status/Photo Required */}
          <div className="flex items-center gap-2 mt-1 flex-wrap">
            {conversation.spaceLocation && (
              <span className="flex items-center gap-1 text-xs text-slate-600">
                <MapPin className="h-3 w-3" />
                {conversation.spaceLocation}
              </span>
            )}
            
            {/* Photo Required Badge */}
            {needsProofUpload && (
              <span className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 animate-pulse">
                <Camera className="h-3 w-3" />
                Photo Required
              </span>
            )}
            
            {/* Booking Status Badge */}
            {conversation.bookingStatus && (
              <span className={`text-xs px-2 py-0.5 rounded-full border ${
                BOOKING_STATUS_COLORS[conversation.bookingStatus as keyof typeof BOOKING_STATUS_COLORS] || 
                'bg-slate-500/10 text-slate-400 border-slate-500/20'
              }`}>
                {conversation.bookingStatus}
              </span>
            )}
          </div>
        </div>
      </div>
    </button>
  );
}