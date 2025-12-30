// src/components/messages/UnifiedMessagesLayout.tsx
"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, Loader2, MessageSquare, ArrowLeft, Filter } from "lucide-react";
import { api } from "../../../../elaview-mvp/src/trpc/react";
import { ConversationCard } from "./ConversationCard";
import { MessageList } from "./MessageList";
import { MessageInput } from "./MessageInput";

interface UnifiedMessagesLayoutProps {
  selectedConversationId?: string; // This is now a bookingId
}

export function UnifiedMessagesLayout({ selectedConversationId }: UnifiedMessagesLayoutProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [showMobileList, setShowMobileList] = useState(!selectedConversationId);

  // Get current user
  const { data: user } = api.user.getCurrentUser.useQuery();

  // Get conversations with preview (now booking-centric)
  const { data: conversations, isLoading } = api.messages.getConversationsWithPreview.useQuery(
    undefined,
    {
      refetchInterval: 10000,
      refetchOnWindowFocus: true,
    }
  );

  // Get selected conversation details
  const selectedConversation = conversations?.find(c => c.id === selectedConversationId);

  // Get selected conversation messages (with bookingId filter)
  // FIX: Don't wait for selectedConversation - fetch messages independently
  // This prevents race conditions where conversation list loads slowly
  const { data: messages } = api.messages.getConversation.useQuery(
    {
      campaignId: selectedConversation?.campaignId || "",
      bookingId: selectedConversationId,
    },
    {
      enabled: !!selectedConversationId, // Only need bookingId, not full conversation object
      refetchInterval: 5000,
    }
  );

  // DEBUG: Log when messages query updates
  useEffect(() => {
    console.log('🔄 [MESSAGES QUERY] Messages updated:', {
      messageCount: messages?.length || 0,
      messages: messages,
      queryParams: {
        campaignId: selectedConversation?.campaignId || "",
        bookingId: selectedConversationId,
      }
    });
  }, [messages, selectedConversation?.campaignId, selectedConversationId]);

  // Filter conversations
  const filteredConversations = useMemo(() => {
    if (!conversations) return [];

    return conversations.filter(conv => {
      const matchesSearch = searchQuery === "" || 
        conv.campaignName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        conv.spaceName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        conv.otherParty.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        conv.spaceLocation?.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStatus = statusFilter === "all" || 
        (statusFilter === "unread" && conv.unreadCount > 0) ||
        (statusFilter === "active" && conv.bookingStatus === "ACTIVE");
      
      return matchesSearch && matchesStatus;
    });
  }, [conversations, searchQuery, statusFilter]);

  // Get booking details for message input
  const bookingStartDate = useMemo(() => {
    if (!selectedConversation || !messages) return undefined;
    const booking = messages.find(m => m.booking)?.booking;
    return booking ? new Date() : undefined;
  }, [selectedConversation, messages]);

  const handleConversationSelect = (bookingId: string) => {
    router.push(`/messages/${bookingId}`); // Now using bookingId in URL
    setShowMobileList(false);
  };

  const handleBackToList = () => {
    router.push('/messages');
    setShowMobileList(true);
  };

  // Type guard for user role
  const userRole = (user?.role === 'ADVERTISER' || user?.role === 'SPACE_OWNER') 
    ? user.role 
    : 'ADVERTISER';

  if (isLoading) {
    return (
      <div className="h-full w-full p-4">
        <div className="w-full h-full flex items-center justify-center rounded-xl bg-slate-900 border border-slate-800 shadow-xl">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-3 text-blue-500" />
            <p className="text-sm text-slate-400">Loading conversations...</p>
          </div>
        </div>
      </div>
    );
  }

  // Empty state - no conversations
  if (!conversations || conversations.length === 0) {
    return (
      <div className="h-full w-full p-4">
        <div className="w-full h-full flex items-center justify-center rounded-xl bg-slate-900 border border-slate-800 shadow-xl">
          <div className="text-center max-w-md px-4">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-800 mb-4">
              <MessageSquare className="h-8 w-8 text-slate-500" />
            </div>
            <h2 className="text-xl font-semibold text-white mb-2">No Messages Yet</h2>
            <p className="text-slate-400 mb-6">
              {user?.role === 'ADVERTISER' 
                ? "You'll see conversations here once space owners approve your booking requests and you complete payment."
                : "Conversations will appear here when advertisers book your spaces and complete payment."
              }
            </p>
            {user?.role === 'ADVERTISER' && (
              <button
                onClick={() => router.push('/browse')}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Browse Spaces
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full w-full p-4">
      <div className="w-full h-full rounded-xl overflow-hidden shadow-2xl border border-slate-800 relative">
        {/* Split View - Full Height */}
        <div className="flex h-full bg-slate-950">
          {/* Conversations List - LEFT SIDEBAR */}
          <div className={`
            w-full md:w-96 border-r border-slate-800 bg-slate-900 flex flex-col
            ${!showMobileList && selectedConversationId ? 'hidden md:flex' : 'flex'}
          `}>
            {/* Header */}
            <div className="flex-shrink-0 p-4 border-b border-slate-800">
              <h1 className="text-xl font-bold text-white mb-4">Messages</h1>
              
              {/* Search */}
              <div className="relative mb-3">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                <input
                  type="text"
                  placeholder="Search conversations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Filters */}
              <div className="flex gap-2">
                <button
                  onClick={() => setStatusFilter("all")}
                  className={`flex-1 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                    statusFilter === "all"
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                  }`}
                >
                  All ({conversations.length})
                </button>
                <button
                  onClick={() => setStatusFilter("unread")}
                  className={`flex-1 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                    statusFilter === "unread"
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                  }`}
                >
                  Unread ({conversations.filter(c => c.unreadCount > 0).length})
                </button>
                <button
                  onClick={() => setStatusFilter("active")}
                  className={`flex-1 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                    statusFilter === "active"
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                  }`}
                >
                  Active
                </button>
              </div>
            </div>

            {/* Conversations List - Scrollable */}
            <div className="flex-1 overflow-y-auto">
              {filteredConversations.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full px-4 text-center">
                  <Filter className="h-12 w-12 text-slate-700 mb-3" />
                  <p className="text-slate-400">No conversations match your filters</p>
                </div>
              ) : (
                <div className="divide-y divide-slate-800">
                  {filteredConversations.map((conversation) => (
                    <ConversationCard
                      key={conversation.id}
                      conversation={conversation}
                      isActive={conversation.id === selectedConversationId}
                      onClick={() => handleConversationSelect(conversation.id)}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Message Thread - RIGHT PANEL */}
          <div className={`
            flex-1 flex flex-col bg-slate-950
            ${showMobileList && !selectedConversationId ? 'hidden md:flex' : 'flex'}
          `}>
            {selectedConversationId && selectedConversation ? (
              <>
                {/* Thread Header - Fixed */}
                <div className="flex-shrink-0 border-b border-slate-800 bg-slate-900 px-4 py-4">
                  <div className="flex items-center gap-4">
                    {/* Mobile back button */}
                    <button
                      onClick={handleBackToList}
                      className="md:hidden rounded-lg p-2 hover:bg-slate-800 transition-colors"
                    >
                      <ArrowLeft className="h-5 w-5 text-slate-400" />
                    </button>

                    {/* Avatar */}
                    <div className="w-10 h-10 rounded-full overflow-hidden bg-slate-800 border-2 border-slate-700 flex-shrink-0">
                      <img
                        src={(user?.role === 'ADVERTISER' ? selectedConversation.spaceImage : selectedConversation.campaignImage) || 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=100'}
                        alt="Conversation"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=100';
                        }}
                      />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <h2 className="font-semibold text-white truncate">
                        {user?.role === 'ADVERTISER' ? selectedConversation.spaceName : selectedConversation.campaignName}
                      </h2>
                      <p className="text-sm text-slate-400 truncate">
                        {selectedConversation.otherParty.name || selectedConversation.otherParty.email}
                      </p>
                    </div>

                    {/* Status badge */}
                    {selectedConversation.bookingStatus && (
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-500/10 text-green-400 border border-green-500/20 flex-shrink-0">
                        {selectedConversation.bookingStatus}
                      </span>
                    )}
                  </div>
                </div>

                {/* Messages - Scrollable */}
                <div className="flex-1 overflow-y-auto bg-slate-950">
                  <MessageList
                    messages={(messages || []).map(msg => ({
                      ...msg,
                      booking: msg.booking ? {
                        id: msg.booking.id,
                        totalAmount: Number(msg.booking.totalAmount),
                        spaceOwnerAmount: Number(msg.booking.spaceOwnerAmount),
                        pricePerDay: Number(msg.booking.pricePerDay),
                        totalDays: msg.booking.totalDays,
                        proofUploadedAt: msg.booking.proofUploadedAt,
                        campaign: {
                          advertiserId: msg.booking.campaign.advertiserId,
                        },
                        space: {
                          title: msg.booking.space.title,
                          installationFee: msg.booking.space.installationFee ? Number(msg.booking.space.installationFee) : null,
                        }
                      } : null,
                    }))}
                    currentUserId={user?.id || ""}
                    userRole={userRole}
                  />
                </div>

                {/* Input - Fixed */}
                <div className="flex-shrink-0 border-t border-slate-800 bg-slate-900 p-4">
                  <MessageInput
                    campaignId={selectedConversation.campaignId}
                    bookingId={selectedConversationId}
                    bookingStartDate={bookingStartDate}
                    userRole={userRole}
                  />
                </div>
              </>
            ) : (
              // Empty state - no conversation selected
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-800 mb-4">
                    <MessageSquare className="h-8 w-8 text-slate-500" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">Select a conversation</h3>
                  <p className="text-slate-400 max-w-sm">
                    Choose a conversation from the list to view messages
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}