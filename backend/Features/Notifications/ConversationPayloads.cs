using ElaviewBackend.Data.Entities;

namespace ElaviewBackend.Features.Notifications;

public record CreateBookingConversationPayload(Conversation Conversation);

public record MarkConversationReadPayload(ConversationParticipant Participant);