using ElaviewBackend.Data.Entities;
using ElaviewBackend.Features.Shared.Errors;

namespace ElaviewBackend.Features.Notifications;

public interface IConversationService {
    IQueryable<Conversation> GetByUserId(Guid userId);
    IQueryable<ConversationParticipant> GetParticipantsByConversationId(Guid conversationId);
    Task<Conversation?> GetByIdAsync(Guid id, CancellationToken ct);
    Task<Conversation> GetOrCreateBookingConversationAsync(Guid bookingId, CancellationToken ct);
    Task<ConversationParticipant> MarkConversationReadAsync(Guid userId, Guid conversationId, CancellationToken ct);
    Task<int> GetUnreadCountAsync(Guid userId, CancellationToken ct);
}

public sealed class ConversationService(IConversationRepository repository) : IConversationService {
    public IQueryable<Conversation> GetByUserId(Guid userId)
        => repository.GetByUserId(userId);

    public IQueryable<ConversationParticipant> GetParticipantsByConversationId(Guid conversationId)
        => repository.GetParticipantsByConversationId(conversationId);

    public async Task<Conversation?> GetByIdAsync(Guid id, CancellationToken ct)
        => await repository.GetByIdAsync(id, ct);

    public async Task<Conversation> GetOrCreateBookingConversationAsync(Guid bookingId, CancellationToken ct) {
        var existing = await repository.GetByBookingIdAsync(bookingId, ct);
        if (existing is not null) return existing;

        var booking = await repository.GetBookingInfoForConversationAsync(bookingId, ct)
            ?? throw new NotFoundException("Booking", bookingId);

        var now = DateTime.UtcNow;
        var conversation = new Conversation {
            BookingId = bookingId,
            UpdatedAt = now,
            CreatedAt = now
        };

        var result = await repository.AddAsync(conversation, ct);

        var participants = new[] {
            new ConversationParticipant {
                ConversationId = result.Id,
                UserId = booking.AdvertiserUserId,
                JoinedAt = now,
                CreatedAt = now
            },
            new ConversationParticipant {
                ConversationId = result.Id,
                UserId = booking.OwnerUserId,
                JoinedAt = now,
                CreatedAt = now
            }
        };

        await repository.AddParticipantsAsync(participants, ct);

        return result;
    }

    public async Task<ConversationParticipant> MarkConversationReadAsync(Guid userId, Guid conversationId, CancellationToken ct) {
        var participant = await repository.GetParticipantAsync(conversationId, userId, ct)
            ?? throw new ForbiddenException("mark this conversation as read");

        return await repository.UpdateLastReadAsync(participant, ct);
    }

    public async Task<int> GetUnreadCountAsync(Guid userId, CancellationToken ct)
        => await repository.GetUnreadCountByUserIdAsync(userId, ct);
}