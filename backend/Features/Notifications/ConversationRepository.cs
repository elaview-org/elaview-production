using ElaviewBackend.Data;
using ElaviewBackend.Data.Entities;
using Microsoft.EntityFrameworkCore;

namespace ElaviewBackend.Features.Notifications;

public interface IConversationRepository {
    IQueryable<Conversation> Query();
    Task<Conversation?> GetByIdAsync(Guid id, CancellationToken ct);

    Task<Conversation?> GetByBookingIdAsync(Guid bookingId,
        CancellationToken ct);

    Task<Conversation> AddAsync(Conversation conversation,
        CancellationToken ct);

    Task SaveChangesAsync(CancellationToken ct);
}

public sealed class ConversationRepository(
    AppDbContext context,
    IConversationByIdDataLoader conversationById
) : IConversationRepository {
    public IQueryable<Conversation> Query() {
        return context.Conversations;
    }

    public async Task<Conversation?>
        GetByIdAsync(Guid id, CancellationToken ct) {
        return await conversationById.LoadAsync(id, ct);
    }

    public async Task<Conversation?> GetByBookingIdAsync(Guid bookingId,
        CancellationToken ct) {
        return await context.Conversations.FirstOrDefaultAsync(
            c => c.BookingId == bookingId, ct);
    }

    public async Task<Conversation> AddAsync(Conversation conversation,
        CancellationToken ct) {
        context.Conversations.Add(conversation);
        await context.SaveChangesAsync(ct);
        return conversation;
    }

    public async Task SaveChangesAsync(CancellationToken ct) {
        await context.SaveChangesAsync(ct);
    }
}

internal static class ConversationDataLoaders {
    [DataLoader]
    public static async Task<IReadOnlyDictionary<Guid, Conversation>>
        GetConversationById(
            IReadOnlyList<Guid> ids, AppDbContext context, CancellationToken ct
        ) {
        return await context.Conversations
            .Where(c => ids.Contains(c.Id))
            .ToDictionaryAsync(c => c.Id, ct);
    }

    [DataLoader]
    public static async Task<ILookup<Guid, ConversationParticipant>>
        GetParticipantsByConversationId(
            IReadOnlyList<Guid> conversationIds, AppDbContext context,
            CancellationToken ct
        ) {
        return (await context.ConversationParticipants
            .Where(p => conversationIds.Contains(p.ConversationId))
            .ToListAsync(ct)).ToLookup(p => p.ConversationId);
    }

    [DataLoader]
    public static async Task<ILookup<Guid, Conversation>>
        GetConversationsByUserId(
            IReadOnlyList<Guid> userIds, AppDbContext context,
            CancellationToken ct
        ) {
        return (await context.ConversationParticipants
            .Where(p => userIds.Contains(p.UserId))
            .Include(p => p.Conversation)
            .Select(p => new { p.UserId, p.Conversation })
            .ToListAsync(ct)).ToLookup(p => p.UserId, p => p.Conversation);
    }
}