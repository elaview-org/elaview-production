using System.Diagnostics.CodeAnalysis;
using ElaviewBackend.Data.Entities;
using HotChocolate.Authorization;

namespace ElaviewBackend.Features.Notifications;

[QueryType]
[SuppressMessage("ReSharper", "MemberCanBePrivate.Global")]
public static partial class MessageQueries {
    [Authorize]
    [UsePaging]
    [UseProjection]
    [UseFiltering]
    [UseSorting]
    public static IQueryable<Message> GetMessagesByConversation(
        [ID] Guid conversationId, IMessageService messageService
    ) => messageService.GetMessagesByConversationIdQuery(conversationId);
}
