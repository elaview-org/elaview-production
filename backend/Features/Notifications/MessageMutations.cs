using System.Diagnostics.CodeAnalysis;
using ElaviewBackend.Data.Entities;
using HotChocolate.Authorization;

namespace ElaviewBackend.Features.Notifications;

[MutationType]
[SuppressMessage("ReSharper", "MemberCanBePrivate.Global")]
public static partial class MessageMutations {
    [Authorize]
    public static async Task<SendMessagePayload> SendMessage(
        [ID] Guid conversationId,
        string content,
        MessageType? type,
        List<string>? attachments,
        IMessageService messageService,
        CancellationToken ct
    ) {
        return new SendMessagePayload(await messageService.SendMessageAsync(
            conversationId,
            content, type ?? MessageType.Text, attachments, ct));
    }
}