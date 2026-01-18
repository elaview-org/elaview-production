using ElaviewBackend.Data;
using ElaviewBackend.Data.Entities;
using Microsoft.EntityFrameworkCore;

namespace ElaviewBackend.Features.Notifications;

public interface IMessageRepository {
    IQueryable<Message> Query();
    Task<Message?> GetByIdAsync(Guid id, CancellationToken ct);
    IQueryable<Message> GetByConversationId(Guid conversationId);
    Task<IReadOnlyList<Message>> GetByConversationIdAsync(Guid conversationId, CancellationToken ct);
    Task<bool> IsUserParticipantAsync(Guid conversationId, Guid userId, CancellationToken ct);
    Task<Conversation?> GetConversationByIdAsync(Guid conversationId, CancellationToken ct);
    Task<List<Guid>> GetOtherParticipantsAsync(Guid conversationId, Guid excludeUserId, CancellationToken ct);
    Task<Message> AddAsync(Message message, CancellationToken ct);
    Task UpdateConversationTimestampAsync(Guid conversationId, CancellationToken ct);
}

public sealed class MessageRepository(
    AppDbContext context,
    IMessageByIdDataLoader messageById,
    IMessagesByConversationIdDataLoader messagesByConversationId
) : IMessageRepository {
    public IQueryable<Message> Query()
        => context.Messages;

    public async Task<Message?> GetByIdAsync(Guid id, CancellationToken ct)
        => await messageById.LoadAsync(id, ct);

    public IQueryable<Message> GetByConversationId(Guid conversationId)
        => context.Messages
            .Where(m => m.ConversationId == conversationId)
            .OrderByDescending(m => m.CreatedAt);

    public async Task<IReadOnlyList<Message>> GetByConversationIdAsync(Guid conversationId, CancellationToken ct)
        => await messagesByConversationId.LoadAsync(conversationId, ct) ?? [];

    public async Task<bool> IsUserParticipantAsync(Guid conversationId, Guid userId, CancellationToken ct)
        => await context.ConversationParticipants
            .AnyAsync(p => p.ConversationId == conversationId && p.UserId == userId, ct);

    public async Task<Conversation?> GetConversationByIdAsync(Guid conversationId, CancellationToken ct)
        => await context.Conversations.FindAsync([conversationId], ct);

    public async Task<List<Guid>> GetOtherParticipantsAsync(Guid conversationId, Guid excludeUserId, CancellationToken ct)
        => await context.ConversationParticipants
            .Where(p => p.ConversationId == conversationId && p.UserId != excludeUserId)
            .Select(p => p.UserId)
            .ToListAsync(ct);

    public async Task<Message> AddAsync(Message message, CancellationToken ct) {
        context.Messages.Add(message);
        await context.SaveChangesAsync(ct);
        return message;
    }

    public async Task UpdateConversationTimestampAsync(Guid conversationId, CancellationToken ct) {
        var conversation = await context.Conversations.FindAsync([conversationId], ct);
        if (conversation is not null) {
            context.Entry(conversation).Property(c => c.UpdatedAt).CurrentValue = DateTime.UtcNow;
            await context.SaveChangesAsync(ct);
        }
    }
}

internal static class MessageDataLoaders {
    [DataLoader]
    public static async Task<IReadOnlyDictionary<Guid, Message>> GetMessageById(
        IReadOnlyList<Guid> ids, AppDbContext context, CancellationToken ct
    ) {
        return await context.Messages
            .Where(m => ids.Contains(m.Id))
            .ToDictionaryAsync(m => m.Id, ct);
    }

    [DataLoader]
    public static async Task<ILookup<Guid, Message>>
        GetMessagesByConversationId(
            IReadOnlyList<Guid> conversationIds, AppDbContext context,
            CancellationToken ct
        ) {
        return (await context.Messages
            .Where(m => conversationIds.Contains(m.ConversationId))
            .OrderByDescending(m => m.CreatedAt)
            .ToListAsync(ct)).ToLookup(m => m.ConversationId);
    }
}