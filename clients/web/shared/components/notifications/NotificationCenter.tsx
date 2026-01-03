// src/components/notifications/NotificationCenter.tsx
"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Bell,
  CheckCheck,
  Trash2,
  AlertCircle,
  DollarSign,
  MessageSquare,
  FileCheck,
  Calendar,
  Building,
  Megaphone,
  X,
} from "lucide-react";
import { NotificationBadge } from "./NotificationBadge";
// import { toast } from "sonner";
import useUnreadNotifications from "@/shared/hooks/api/getters/useUnreadNotifications/useUnreadNotifications";
import useAllNotificationsAsRead from "@/shared/hooks/api/actions/useAllNotificationsAsRead/useAllNotificationsAsRead";
import useNotificationAsRead from "@/shared/hooks/api/actions/useNotificationAsRead/useNotificationAsRead";
import useDeleteNotification from "@/shared/hooks/api/actions/useDeleteNotification/useDeleteNotification";

type NotificationType = any;
// 🆕 NEW: Native JavaScript date formatting (no date-fns in components)
function formatTimeAgo(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - new Date(date).getTime();
  const diffMinutes = Math.floor(diffMs / 60000);

  if (diffMinutes < 1) return "Just now";
  if (diffMinutes < 60) return `${diffMinutes}m ago`;

  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours}h ago`;

  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return `${diffDays}d ago`;

  return new Date(date).toLocaleDateString();
}

// 🆕 NEW: Get icon for notification type
function getNotificationIcon(type: NotificationType) {
  const iconProps = { className: "h-4 w-4" };

  switch (type) {
    case "BOOKING_REQUEST":
    case "BOOKING_APPROVED":
    case "BOOKING_REJECTED":
    case "BOOKING_CANCELLED":
      return <Calendar {...iconProps} />;
    case "PAYMENT_RECEIVED":
    case "PAYOUT_PROCESSED":
    case "REFUND_PROCESSED":
    case "PAYMENT_FAILED":
      return <DollarSign {...iconProps} />;
    case "PROOF_UPLOADED":
    case "PROOF_APPROVED":
    case "PROOF_REJECTED":
    case "PROOF_DISPUTED":
      return <FileCheck {...iconProps} />;
    case "MESSAGE_RECEIVED":
      return <MessageSquare {...iconProps} />;
    case "SPACE_APPROVED":
    case "SPACE_REJECTED":
    case "SPACE_SUSPENDED":
    case "SPACE_REACTIVATED":
      return <Building {...iconProps} />;
    case "SYSTEM_UPDATE":
      return <Megaphone {...iconProps} />;
    default:
      return <AlertCircle {...iconProps} />;
  }
}

// 🆕 NEW: Get notification link for navigation
function getNotificationLink(notification: any): string {
  switch (notification.type) {
    case "BOOKING_REQUEST":
      return "/requests";
    case "BOOKING_APPROVED":
    case "BOOKING_REJECTED":
    case "PROOF_UPLOADED":
    case "PROOF_APPROVED":
    case "PROOF_REJECTED":
      return notification.campaignId
        ? `/campaigns/${notification.campaignId}`
        : "/campaigns";
    case "PAYMENT_RECEIVED":
    case "PAYOUT_PROCESSED":
      return "/earnings";
    case "MESSAGE_RECEIVED":
      return notification.campaignId
        ? `/messages?campaign=${notification.campaignId}`
        : "/messages";
    case "SPACE_APPROVED":
    case "SPACE_REJECTED":
      return "/spaces";
    default:
      return "/";
  }
}

// 🆕 NEW: Get color for notification type
function getNotificationColor(type: NotificationType): string {
  switch (type) {
    case "BOOKING_REQUEST":
    case "PROOF_UPLOADED":
      return "bg-blue-500/10 text-blue-400 border-blue-500/20";
    case "BOOKING_APPROVED":
    case "PROOF_APPROVED":
    case "PAYMENT_RECEIVED":
    case "PAYOUT_PROCESSED":
    case "SPACE_APPROVED":
      return "bg-green-500/10 text-green-400 border-green-500/20";
    case "BOOKING_REJECTED":
    case "PROOF_REJECTED":
    case "PAYMENT_FAILED":
    case "SPACE_REJECTED":
      return "bg-red-500/10 text-red-400 border-red-500/20";
    case "REFUND_PROCESSED":
    case "SPACE_SUSPENDED":
      return "bg-orange-500/10 text-orange-400 border-orange-500/20";
    default:
      return "bg-slate-500/10 text-slate-400 border-slate-500/20";
  }
}

interface NotificationCenterProps {
  className?: string;
}

export function NotificationCenter({
  className = "",
}: NotificationCenterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [panelPosition, setPanelPosition] = useState({ top: 0, right: 0 });
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const router = useRouter();

  // 🆕 NEW: Fetch unread notifications with 30s polling

  const { notificationData: data, isLoading } = useUnreadNotifications(
    undefined,
    {
      refetchInterval: 30000, // Poll every 30 seconds
      refetchOnWindowFocus: true,
      staleTime: 25000, // Don't refetch if data is <25s old
    }
  );
  const { markAsRead } = useNotificationAsRead();
  const { markAllAsRead, isPending: markAllAsReadMutationPending } =
    useAllNotificationsAsRead();
  const { deleteNotification } = useDeleteNotification();

  // Calculate panel position relative to bell icon
  useEffect(() => {
    if (isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const panelWidth = 384; // w-96 = 24rem = 384px

      setPanelPosition({
        top: rect.bottom + 8, // 8px gap below bell icon
        right: Math.max(16, window.innerWidth - rect.right), // Align right edge of panel with right edge of button, keep 16px from edge
      });
    }
  }, [isOpen]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen]);

  const handleNotificationClick = (notification: any) => {
    // Mark as read
    if (!notification.isRead) {
      markAsRead();
    }

    // Navigate to relevant page
    const link = getNotificationLink(notification);
    router.push(link);
    setIsOpen(false);
  };

  const handleMarkAllRead = () => {
    markAllAsRead();
  };

  const handleDelete = (e: React.MouseEvent, notificationId: string) => {
    e.stopPropagation(); // Prevent navigation
    deleteNotification();
  };

  const notifications = data?.notifications ?? [];
  const unreadCount = data?.unreadCount ?? 0;

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Bell Button */}
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-lg hover:bg-slate-800 transition-colors"
        aria-label="Notifications"
        aria-expanded={isOpen}
      >
        <Bell className="h-5 w-5 text-slate-400" />
        {unreadCount > 0 && (
          <div className="absolute -top-1 -right-1">
            <NotificationBadge count={unreadCount} size="sm" />
          </div>
        )}
      </button>

      {/* Dropdown Panel - RELATIVE POSITIONING */}
      {isOpen && (
        <>
          {/* Backdrop - closes dropdown when clicking outside */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />

          {/* Notification Panel - Positioned relative to bell icon */}
          <div
            className="fixed w-96 max-h-[calc(100vh-120px)] bg-slate-900 border border-slate-700 rounded-xl shadow-2xl z-50 flex flex-col overflow-hidden"
            style={{
              top: `${panelPosition.top}px`,
              right: `${panelPosition.right}px`,
            }}
          >
            {/* Header - Sticky */}
            <div className="shrink-0 p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900">
              <div>
                <h3 className="text-lg font-semibold text-white">
                  Notifications
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  {unreadCount === 0
                    ? "All caught up!"
                    : `${unreadCount} unread`}
                </p>
              </div>
              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllRead}
                    disabled={markAllAsReadMutationPending}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 rounded-lg transition-colors disabled:opacity-50"
                  >
                    <CheckCheck className="h-3.5 w-3.5" />
                    Mark all
                  </button>
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
                  aria-label="Close notifications"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Notifications List - Scrollable */}
            <div className="flex-1 overflow-y-auto">
              {isLoading ? (
                <div className="p-8 text-center">
                  <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
                  <p className="text-sm text-slate-400 mt-3">
                    Loading notifications...
                  </p>
                </div>
              ) : notifications.length === 0 ? (
                <div className="p-12 text-center">
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-slate-800 mb-3">
                    <Bell className="h-6 w-6 text-slate-400" />
                  </div>
                  <p className="text-sm font-medium text-white">
                    No notifications
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    You're all caught up!
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-slate-800">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      onClick={() => handleNotificationClick(notification)}
                      className={`
                        p-4 cursor-pointer transition-colors
                        ${
                          notification.isRead
                            ? "hover:bg-slate-800/50"
                            : "bg-blue-500/5 hover:bg-blue-500/10"
                        }
                      `}
                    >
                      <div className="flex items-start gap-3">
                        {/* Icon */}
                        <div
                          className={`shrink-0 p-2 rounded-lg border ${getNotificationColor(
                            notification.type
                          )}`}
                        >
                          {getNotificationIcon(notification.type)}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <p
                              className={`text-sm font-medium ${
                                notification.isRead
                                  ? "text-slate-300"
                                  : "text-white"
                              }`}
                            >
                              {notification.title}
                            </p>
                            {!notification.isRead && (
                              <div className="shrink-0 h-2 w-2 rounded-full bg-blue-500"></div>
                            )}
                          </div>
                          <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                            {notification.content}
                          </p>
                          <div className="flex items-center justify-between mt-2">
                            <p className="text-xs text-slate-500">
                              {formatTimeAgo(notification.createdAt)}
                            </p>
                            <button
                              onClick={(e) => handleDelete(e, notification.id)}
                              className="p-1 rounded hover:bg-red-500/10 text-slate-500 hover:text-red-400 transition-colors"
                              aria-label="Delete notification"
                            >
                              <Trash2 className="h-3 w-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer - Sticky */}
            {notifications.length > 0 && (
              <div className="shrink-0 p-3 border-t border-slate-800 bg-slate-900">
                <button
                  onClick={() => {
                    router.push("/notifications");
                    setIsOpen(false);
                  }}
                  className="w-full text-center text-sm font-medium text-blue-400 hover:text-blue-300 py-2 rounded-lg hover:bg-blue-500/10 transition-colors"
                >
                  View all notifications
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
