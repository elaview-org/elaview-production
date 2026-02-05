using ElaviewBackend.Features.Shared.Errors;
using ElaviewBackend.Features.Users;
using HotChocolate.Authorization;
using HotChocolate.Subscriptions;

namespace ElaviewBackend.Features.Notifications;

[MutationType]
public static partial class TypingMutations {
    [Authorize]
    [Error<ForbiddenException>]
    public static async Task<bool> NotifyTyping(
        NotifyTypingInput input,
        IUserService userService,
        IMessageRepository messageRepository,
        IUserRepository userRepository,
        ITopicEventSender eventSender,
        CancellationToken ct
    ) {
        var userId = userService.GetPrincipalId();

        var isParticipant = await messageRepository.IsUserParticipantAsync(
            input.ConversationId, userId, ct);
        if (!isParticipant)
            throw new ForbiddenException("send typing indicators in this conversation");

        var user = await userRepository.GetByIdAsync(userId, ct);

        var indicator = new TypingIndicator(
            input.ConversationId,
            userId,
            user?.Name ?? "User",
            user?.Avatar,
            input.IsTyping,
            DateTime.UtcNow
        );

        await eventSender.SendAsync($"typing:{input.ConversationId}", indicator, ct);
        return true;
    }
}
