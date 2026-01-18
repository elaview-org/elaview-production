using ElaviewBackend.Data.Entities;
using HotChocolate.Authorization;

namespace ElaviewBackend.Features.Notifications;

[QueryType]
public static partial class MessageQueries {
    [Authorize]
    [UsePaging]
    [UseProjection]
    [UseFiltering]
    [UseSorting]
    public static IQueryable<Message> GetMessagesByConversation(
        [ID] Guid conversationId,
        IMessageService messageService
    ) => messageService.GetByConversationId(conversationId);
}