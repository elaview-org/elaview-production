namespace ElaviewBackend.Features.Notifications;

public record TypingIndicator(
    Guid ConversationId,
    Guid UserId,
    string UserName,
    string? UserAvatar,
    bool IsTyping,
    DateTime Timestamp
);

public record NotifyTypingInput(Guid ConversationId, bool IsTyping);
