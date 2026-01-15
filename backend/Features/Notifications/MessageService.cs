using System.Security.Claims;
using ElaviewBackend.Data;
using ElaviewBackend.Data.Entities;
using HotChocolate.Subscriptions;
using Microsoft.EntityFrameworkCore;

namespace ElaviewBackend.Features.Notifications;

public interface IMessageService {
    Guid? GetCurrentUserIdOrNull();
    IQueryable<Message> GetMessagesByConversationIdQuery(Guid conversationId);

    Task<Message> SendMessageAsync(Guid conversationId, string content,
        MessageType type, List<string>? attachments, CancellationToken ct);
}

public sealed class MessageService(
    IHttpContextAccessor httpContextAccessor,
    AppDbContext context,
    IMessageRepository messageRepository,
    INotificationService notificationService,
    ITopicEventSender eventSender
) : IMessageService {
    public Guid? GetCurrentUserIdOrNull() {
        var principalId = httpContextAccessor.HttpContext?.User.FindFirstValue(
            ClaimTypes.NameIdentifier
        );
        return principalId is null ? null : Guid.Parse(principalId);
    }

    public IQueryable<Message> GetMessagesByConversationIdQuery(
        Guid conversationId) {
        return context.Messages
            .Where(m => m.ConversationId == conversationId)
            .OrderByDescending(m => m.CreatedAt);
    }

    public async Task<Message> SendMessageAsync(Guid conversationId,
        string content, MessageType type, List<string>? attachments,
        CancellationToken ct) {
        var userId = GetCurrentUserId();

        var isParticipant = await context.ConversationParticipants
            .AnyAsync(
                p => p.ConversationId == conversationId && p.UserId == userId,
                ct);

        if (!isParticipant)
            throw new GraphQLException(
                "You are not a participant of this conversation");

        var now = DateTime.UtcNow;
        var message = new Message {
            ConversationId = conversationId,
            SenderUserId = userId,
            Type = type,
            Content = content,
            Attachments = attachments,
            CreatedAt = now
        };

        await messageRepository.AddAsync(message, ct);

        var conversation =
            await context.Conversations.FindAsync([conversationId], ct);
        if (conversation is not null) {
            var convEntry = context.Entry(conversation);
            convEntry.Property(c => c.UpdatedAt).CurrentValue = now;
            await context.SaveChangesAsync(ct);
        }

        var otherParticipants = await context.ConversationParticipants
            .Where(p =>
                p.ConversationId == conversationId && p.UserId != userId)
            .Select(p => p.UserId)
            .ToListAsync(ct);

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

    private Guid GetCurrentUserId() {
        return GetCurrentUserIdOrNull() ??
               throw new GraphQLException("Not authenticated");
    }
}