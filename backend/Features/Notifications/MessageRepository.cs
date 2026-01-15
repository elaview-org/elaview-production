using ElaviewBackend.Data;
using ElaviewBackend.Data.Entities;
using Microsoft.EntityFrameworkCore;

namespace ElaviewBackend.Features.Notifications;

public interface IMessageRepository {
    IQueryable<Message> Query();
    Task<Message?> GetByIdAsync(Guid id, CancellationToken ct);
    Task<IReadOnlyList<Message>> GetByConversationIdAsync(Guid conversationId, CancellationToken ct);
    Task<Message> AddAsync(Message message, CancellationToken ct);
}

public sealed class MessageRepository(
    AppDbContext context,
    IMessageByIdDataLoader messageById,
    IMessagesByConversationIdDataLoader messagesByConversationId
) : IMessageRepository {
    public IQueryable<Message> Query() => context.Messages;

    public async Task<Message?> GetByIdAsync(Guid id, CancellationToken ct) =>
        await messageById.LoadAsync(id, ct);

    public async Task<IReadOnlyList<Message>> GetByConversationIdAsync(Guid conversationId, CancellationToken ct) =>
        await messagesByConversationId.LoadAsync(conversationId, ct) ?? [];

    public async Task<Message> AddAsync(Message message, CancellationToken ct) {
        context.Messages.Add(message);
        await context.SaveChangesAsync(ct);
        return message;
    }
}

internal static class MessageDataLoaders {
    [DataLoader]
    public static async Task<IReadOnlyDictionary<Guid, Message>> GetMessageById(
        IReadOnlyList<Guid> ids, AppDbContext context, CancellationToken ct
    ) => await context.Messages
        .Where(m => ids.Contains(m.Id))
        .ToDictionaryAsync(m => m.Id, ct);

    [DataLoader]
    public static async Task<ILookup<Guid, Message>> GetMessagesByConversationId(
        IReadOnlyList<Guid> conversationIds, AppDbContext context, CancellationToken ct
    ) => (await context.Messages
        .Where(m => conversationIds.Contains(m.ConversationId))
        .OrderByDescending(m => m.CreatedAt)
        .ToListAsync(ct)).ToLookup(m => m.ConversationId);
}
