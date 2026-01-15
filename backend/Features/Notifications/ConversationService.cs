using System.Security.Claims;
using ElaviewBackend.Data;
using ElaviewBackend.Data.Entities;
using Microsoft.EntityFrameworkCore;

namespace ElaviewBackend.Features.Notifications;

public interface IConversationService {
    Guid? GetCurrentUserIdOrNull();
    IQueryable<Conversation> GetMyConversationsQuery();
    IQueryable<Conversation> GetConversationByIdQuery(Guid id);

    IQueryable<ConversationParticipant> GetParticipantsByConversationIdQuery(
        Guid conversationId);

    Task<Conversation?> GetConversationByIdAsync(Guid id, CancellationToken ct);

    Task<Conversation> GetOrCreateBookingConversationAsync(Guid bookingId,
        CancellationToken ct);

    Task<ConversationParticipant> MarkConversationReadAsync(Guid conversationId,
        CancellationToken ct);

    Task<int> GetUnreadConversationsCountAsync(CancellationToken ct);
}

public sealed class ConversationService(
    IHttpContextAccessor httpContextAccessor,
    AppDbContext context,
    IConversationRepository conversationRepository
) : IConversationService {
    public Guid? GetCurrentUserIdOrNull() {
        var principalId = httpContextAccessor.HttpContext?.User.FindFirstValue(
            ClaimTypes.NameIdentifier
        );
        return principalId is null ? null : Guid.Parse(principalId);
    }

    public IQueryable<Conversation> GetMyConversationsQuery() {
        var userId = GetCurrentUserId();
        return context.Conversations
            .Where(c => c.Participants.Any(p => p.UserId == userId))
            .OrderByDescending(c => c.UpdatedAt);
    }

    public IQueryable<Conversation> GetConversationByIdQuery(Guid id) {
        return context.Conversations.Where(c => c.Id == id);
    }

    public IQueryable<ConversationParticipant>
        GetParticipantsByConversationIdQuery(Guid conversationId) {
        return context.ConversationParticipants.Where(p =>
            p.ConversationId == conversationId);
    }

    public async Task<Conversation?> GetConversationByIdAsync(Guid id,
        CancellationToken ct) {
        return await conversationRepository.GetByIdAsync(id, ct);
    }

    public async Task<Conversation> GetOrCreateBookingConversationAsync(
        Guid bookingId, CancellationToken ct) {
        var existing =
            await conversationRepository.GetByBookingIdAsync(bookingId, ct);
        if (existing is not null) return existing;

        var booking = await context.Bookings
                          .Include(b => b.Campaign)
                          .ThenInclude(c => c.AdvertiserProfile)
                          .Include(b => b.Space)
                          .ThenInclude(s => s.SpaceOwnerProfile)
                          .FirstOrDefaultAsync(b => b.Id == bookingId, ct)
                      ?? throw new GraphQLException("Booking not found");

        var now = DateTime.UtcNow;
        var conversation = new Conversation {
            BookingId = bookingId,
            UpdatedAt = now,
            CreatedAt = now
        };

        context.Conversations.Add(conversation);
        await context.SaveChangesAsync(ct);

        var participants = new[] {
            new ConversationParticipant {
                ConversationId = conversation.Id,
                UserId = booking.Campaign.AdvertiserProfile.UserId,
                JoinedAt = now,
                CreatedAt = now
            },
            new ConversationParticipant {
                ConversationId = conversation.Id,
                UserId = booking.Space.SpaceOwnerProfile.UserId,
                JoinedAt = now,
                CreatedAt = now
            }
        };

        context.ConversationParticipants.AddRange(participants);
        await context.SaveChangesAsync(ct);

        return conversation;
    }

    public async Task<ConversationParticipant> MarkConversationReadAsync(
        Guid conversationId, CancellationToken ct) {
        var userId = GetCurrentUserId();

        var participant = await context.ConversationParticipants
                              .FirstOrDefaultAsync(
                                  p => p.ConversationId == conversationId &&
                                       p.UserId == userId, ct)
                          ?? throw new GraphQLException(
                              "You are not a participant of this conversation");

        var entry = context.Entry(participant);
        entry.Property(p => p.LastReadAt).CurrentValue = DateTime.UtcNow;
        await context.SaveChangesAsync(ct);

        return participant;
    }

    public async Task<int> GetUnreadConversationsCountAsync(
        CancellationToken ct) {
        var userId = GetCurrentUserId();

        return await context.ConversationParticipants
            .Where(p => p.UserId == userId)
            .CountAsync(p =>
                    context.Messages
                        .Where(m =>
                            m.ConversationId == p.ConversationId &&
                            m.SenderUserId != userId)
                        .Any(m =>
                            p.LastReadAt == null || m.CreatedAt > p.LastReadAt),
                ct);
    }

    private Guid GetCurrentUserId() {
        return GetCurrentUserIdOrNull() ??
               throw new GraphQLException("Not authenticated");
    }
}