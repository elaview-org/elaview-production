using ElaviewBackend.Data.Entities;

namespace ElaviewBackend.Features.Notifications;

public record UpdateNotificationPreferenceInput(
    NotificationType NotificationType,
    bool? EmailEnabled,
    bool? PushEnabled,
    bool? InAppEnabled
);

public record SendMessageInput(
    Guid ConversationId,
    string Content,
    MessageType? Type,
    List<string>? Attachments
);

public record CreateBookingConversationInput(Guid BookingId);