using System.Diagnostics.CodeAnalysis;
using ElaviewBackend.Data.Entities;
using HotChocolate.Authorization;

namespace ElaviewBackend.Features.Notifications;

[QueryType]
[SuppressMessage("ReSharper", "MemberCanBePrivate.Global")]
public static partial class ConversationQueries {
    [Authorize]
    [UsePaging]
    [UseProjection]
    [UseFiltering]
    [UseSorting]
    public static IQueryable<Conversation> GetMyConversations(IConversationService conversationService)
        => conversationService.GetMyConversationsQuery();

    [Authorize]
    [UseFirstOrDefault]
    [UseProjection]
    public static IQueryable<Conversation> GetConversationById(
        [ID] Guid id, IConversationService conversationService
    ) => conversationService.GetConversationByIdQuery(id);

    [Authorize]
    public static async Task<int> GetUnreadConversationsCount(
        IConversationService conversationService, CancellationToken ct
    ) => await conversationService.GetUnreadConversationsCountAsync(ct);
}
