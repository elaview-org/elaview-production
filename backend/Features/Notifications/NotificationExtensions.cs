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
        [Parent] Conversation conversation, IMessageService messageService
    ) {
        return messageService.GetMessagesByConversationIdQuery(conversation.Id);
    }

    [Authorize]
    [UseProjection]
    public static IQueryable<ConversationParticipant> GetParticipants(
        [Parent] Conversation conversation,
        IConversationService conversationService
    ) {
        return conversationService.GetParticipantsByConversationIdQuery(
            conversation.Id);
    }
}