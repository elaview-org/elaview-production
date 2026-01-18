using ElaviewBackend.Data;
using ElaviewBackend.Data.Entities;
using Microsoft.EntityFrameworkCore;

namespace ElaviewBackend.Features.Notifications;

public interface IConversationRepository {
    IQueryable<Conversation> Query();
    Task<Conversation?> GetByIdAsync(Guid id, CancellationToken ct);
    IQueryable<Conversation> GetByUserId(Guid userId);
    IQueryable<ConversationParticipant> GetParticipantsByConversationId(Guid conversationId);
    Task<Conversation?> GetByBookingIdAsync(Guid bookingId, CancellationToken ct);
    Task<ConversationParticipant?> GetParticipantAsync(Guid conversationId, Guid userId, CancellationToken ct);
    Task<BookingConversationInfo?> GetBookingInfoForConversationAsync(Guid bookingId, CancellationToken ct);
    Task<int> GetUnreadCountByUserIdAsync(Guid userId, CancellationToken ct);
    Task<Conversation> AddAsync(Conversation conversation, CancellationToken ct);
    Task AddParticipantsAsync(IEnumerable<ConversationParticipant> participants, CancellationToken ct);
    Task<ConversationParticipant> UpdateLastReadAsync(ConversationParticipant participant, CancellationToken ct);
    Task SaveChangesAsync(CancellationToken ct);
}

public record BookingConversationInfo(
    Guid BookingId,
    Guid AdvertiserUserId,
    Guid OwnerUserId
);

public sealed class ConversationRepository(
    AppDbContext context,
    IConversationByIdDataLoader conversationById
) : IConversationRepository {
    public IQueryable<Conversation> Query()
        => context.Conversations;

    public async Task<Conversation?> GetByIdAsync(Guid id, CancellationToken ct)
        => await conversationById.LoadAsync(id, ct);

    public IQueryable<Conversation> GetByUserId(Guid userId)
        => context.Conversations
            .Where(c => c.Participants.Any(p => p.UserId == userId))
            .OrderByDescending(c => c.UpdatedAt);

    public IQueryable<ConversationParticipant> GetParticipantsByConversationId(Guid conversationId)
        => context.ConversationParticipants.Where(p => p.ConversationId == conversationId);

    public async Task<Conversation?> GetByBookingIdAsync(Guid bookingId, CancellationToken ct)
        => await context.Conversations.FirstOrDefaultAsync(c => c.BookingId == bookingId, ct);

    public async Task<ConversationParticipant?> GetParticipantAsync(Guid conversationId, Guid userId, CancellationToken ct)
        => await context.ConversationParticipants.FirstOrDefaultAsync(
            p => p.ConversationId == conversationId && p.UserId == userId, ct);

    public async Task<BookingConversationInfo?> GetBookingInfoForConversationAsync(Guid bookingId, CancellationToken ct)
        => await context.Bookings
            .Where(b => b.Id == bookingId)
            .Select(b => new BookingConversationInfo(
                b.Id,
                b.Campaign.AdvertiserProfile.UserId,
                b.Space.SpaceOwnerProfile.UserId))
            .FirstOrDefaultAsync(ct);

    public async Task<int> GetUnreadCountByUserIdAsync(Guid userId, CancellationToken ct)
        => await context.ConversationParticipants
            .Where(p => p.UserId == userId)
            .CountAsync(p =>
                context.Messages
                    .Where(m => m.ConversationId == p.ConversationId && m.SenderUserId != userId)
                    .Any(m => p.LastReadAt == null || m.CreatedAt > p.LastReadAt), ct);

    public async Task<Conversation> AddAsync(Conversation conversation, CancellationToken ct) {
        context.Conversations.Add(conversation);
        await context.SaveChangesAsync(ct);
        return conversation;
    }

    public async Task AddParticipantsAsync(IEnumerable<ConversationParticipant> participants, CancellationToken ct) {
        context.ConversationParticipants.AddRange(participants);
        await context.SaveChangesAsync(ct);
    }

    public async Task<ConversationParticipant> UpdateLastReadAsync(ConversationParticipant participant, CancellationToken ct) {
        context.Entry(participant).Property(p => p.LastReadAt).CurrentValue = DateTime.UtcNow;
        await context.SaveChangesAsync(ct);
        return participant;
    }

    public async Task SaveChangesAsync(CancellationToken ct)
        => await context.SaveChangesAsync(ct);
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