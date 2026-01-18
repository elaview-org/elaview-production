using ElaviewBackend.Data.Entities;
using ElaviewBackend.Features.Shared.Errors;
using HotChocolate.Subscriptions;

namespace ElaviewBackend.Features.Notifications;

public interface IMessageService {
    IQueryable<Message> GetByConversationId(Guid conversationId);
    Task<Message> SendMessageAsync(Guid userId, Guid conversationId, string content, MessageType type, List<string>? attachments, CancellationToken ct);
}

public sealed class MessageService(
    IMessageRepository repository,
    INotificationService notificationService,
    ITopicEventSender eventSender
) : IMessageService {
    public IQueryable<Message> GetByConversationId(Guid conversationId)
        => repository.GetByConversationId(conversationId);

    public async Task<Message> SendMessageAsync(Guid userId, Guid conversationId, string content, MessageType type, List<string>? attachments, CancellationToken ct) {
        var isParticipant = await repository.IsUserParticipantAsync(conversationId, userId, ct);
        if (!isParticipant)
            throw new ForbiddenException("send messages in this conversation");

        var now = DateTime.UtcNow;
        var message = new Message {
            ConversationId = conversationId,
            SenderUserId = userId,
            Type = type,
            Content = content,
            Attachments = attachments,
            CreatedAt = now
        };

        await repository.AddAsync(message, ct);
        await repository.UpdateConversationTimestampAsync(conversationId, ct);

        var otherParticipants = await repository.GetOtherParticipantsAsync(conversationId, userId, ct);

        foreach (var recipientId in otherParticipants)
            await notificationService.SendNotificationAsync(
                recipientId,
                NotificationType.MessageReceived,
                "New Message",
                content.Length > 100 ? content[..100] + "..." : content,
                "Conversation",
                conversationId,
                ct
            );

        await eventSender.SendAsync($"messages:{conversationId}", message, ct);

        return message;
    }
}