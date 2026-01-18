using ElaviewBackend.Data.Entities;
using HotChocolate.Authorization;

namespace ElaviewBackend.Features.Notifications;

[ExtendObjectType<Conversation>]
public static class ConversationExtensions {
    [Authorize]
    [UsePaging]
    [UseProjection]
    [UseFiltering]
    [UseSorting]
    public static IQueryable<Message> GetMessages(
        [Parent] Conversation conversation,
        IMessageService messageService
    ) => messageService.GetByConversationId(conversation.Id);

    [Authorize]
    [UseProjection]
    public static IQueryable<ConversationParticipant> GetParticipants(
        [Parent] Conversation conversation,
        IConversationService conversationService
    ) => conversationService.GetParticipantsByConversationId(conversation.Id);
}