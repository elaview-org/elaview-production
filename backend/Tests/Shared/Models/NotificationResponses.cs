namespace ElaviewBackend.Tests.Shared.Models;

public record NotificationNode(
    Guid Id,
    string Type,
    string Title,
    string Body,
    bool IsRead,
    DateTime? ReadAt,
    string? EntityType,
    Guid? EntityId
);

public record NotificationByIdResponse(NotificationNode? NotificationById);

public record NotificationsConnection(List<NotificationNode> Nodes, PageInfo PageInfo, int? TotalCount = null);

public record MyNotificationsResponse(NotificationsConnection MyNotifications);

public record UnreadNotificationsCountResponse(int UnreadNotificationsCount);

public record NotificationPreferenceNode(
    Guid Id,
    string NotificationType,
    bool EmailEnabled,
    bool PushEnabled,
    bool InAppEnabled
);

public record MyNotificationPreferencesResponse(List<NotificationPreferenceNode> MyNotificationPreferences);

public record MarkNotificationReadPayloadResponse(NotificationNode Notification);

public record MarkNotificationReadResponse(MarkNotificationReadPayloadResponse MarkNotificationRead);

public record MarkAllNotificationsReadPayloadResponse(int Count);

public record MarkAllNotificationsReadResponse(MarkAllNotificationsReadPayloadResponse MarkAllNotificationsRead);

public record DeleteNotificationPayloadResponse(bool Success);

public record DeleteNotificationResponse(DeleteNotificationPayloadResponse DeleteNotification);

public record UpdateNotificationPreferencePayloadResponse(NotificationPreferenceNode Preference);

public record UpdateNotificationPreferenceResponse(UpdateNotificationPreferencePayloadResponse UpdateNotificationPreference);

public record ConversationNode(
    Guid Id,
    Guid? BookingId,
    DateTime UpdatedAt
);

public record ConversationByIdResponse(ConversationNode? ConversationById);

public record ConversationsConnection(List<ConversationNode> Nodes, PageInfo PageInfo, int? TotalCount = null);

public record MyConversationsResponse(ConversationsConnection MyConversations);

public record MessageNode(
    Guid Id,
    string Type,
    string Content,
    Guid SenderUserId
);

public record MessagesConnection(List<MessageNode> Nodes, PageInfo PageInfo, int? TotalCount = null);

public record MessagesByConversationResponse(MessagesConnection MessagesByConversation);

public record UnreadConversationsCountResponse(int UnreadConversationsCount);

public record CreateConversationPayloadResponse(ConversationNode Conversation);

public record CreateBookingConversationResponse(CreateConversationPayloadResponse CreateBookingConversation);

public record SendMessagePayloadResponse(MessageNode Message);

public record SendMessageResponse(SendMessagePayloadResponse SendMessage);

public record ConversationParticipantNode(
    Guid Id,
    Guid UserId,
    DateTime? LastReadAt
);

public record MarkConversationReadPayloadResponse(ConversationParticipantNode Participant);

public record MarkConversationReadResponse(MarkConversationReadPayloadResponse MarkConversationRead);
