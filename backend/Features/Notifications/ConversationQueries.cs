using ElaviewBackend.Data.Entities;
using ElaviewBackend.Features.Users;
using HotChocolate.Authorization;

namespace ElaviewBackend.Features.Notifications;

[QueryType]
public static partial class ConversationQueries {
    [Authorize]
    [UsePaging]
    [UseProjection]
    [UseFiltering]
    [UseSorting]
    public static IQueryable<Conversation> GetMyConversations(
        IUserService userService,
        IConversationService conversationService
    ) => conversationService.GetByUserId(userService.GetPrincipalId());

    [Authorize]
    public static async Task<int> GetUnreadConversationsCount(
        IUserService userService,
        IConversationService conversationService,
        CancellationToken ct
    ) => await conversationService.GetUnreadCountAsync(userService.GetPrincipalId(), ct);
}