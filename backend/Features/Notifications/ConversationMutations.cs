using ElaviewBackend.Features.Shared.Errors;
using ElaviewBackend.Features.Users;
using HotChocolate.Authorization;

namespace ElaviewBackend.Features.Notifications;

[MutationType]
public static partial class ConversationMutations {
    [Authorize]
    [Error<NotFoundException>]
    public static async Task<CreateBookingConversationPayload> CreateBookingConversation(
        [ID] Guid bookingId,
        IConversationService conversationService,
        CancellationToken ct
    ) {
        var conversation = await conversationService.GetOrCreateBookingConversationAsync(bookingId, ct);
        return new CreateBookingConversationPayload(conversation);
    }

    [Authorize]
    [Error<ForbiddenException>]
    public static async Task<MarkConversationReadPayload> MarkConversationRead(
        [ID] Guid conversationId,
        IUserService userService,
        IConversationService conversationService,
        CancellationToken ct
    ) {
        var participant = await conversationService.MarkConversationReadAsync(userService.GetPrincipalId(), conversationId, ct);
        return new MarkConversationReadPayload(participant);
    }
}