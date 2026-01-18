using ElaviewBackend.Data.Entities;
using ElaviewBackend.Features.Shared.Errors;
using ElaviewBackend.Features.Users;
using HotChocolate.Authorization;

namespace ElaviewBackend.Features.Notifications;

[MutationType]
public static partial class MessageMutations {
    [Authorize]
    [Error<ForbiddenException>]
    public static async Task<SendMessagePayload> SendMessage(
        [ID] Guid conversationId,
        string content,
        MessageType? type,
        List<string>? attachments,
        IUserService userService,
        IMessageService messageService,
        CancellationToken ct
    ) {
        var message = await messageService.SendMessageAsync(
            userService.GetPrincipalId(),
            conversationId,
            content,
            type ?? MessageType.Text,
            attachments,
            ct);
        return new SendMessagePayload(message);
    }
}