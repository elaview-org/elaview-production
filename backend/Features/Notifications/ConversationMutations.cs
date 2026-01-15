using System.Diagnostics.CodeAnalysis;
using HotChocolate.Authorization;

namespace ElaviewBackend.Features.Notifications;

[MutationType]
[SuppressMessage("ReSharper", "MemberCanBePrivate.Global")]
public static partial class ConversationMutations {
    [Authorize]
    public static async Task<CreateBookingConversationPayload> CreateBookingConversation(
        [ID] Guid bookingId, IConversationService conversationService, CancellationToken ct
    ) => new(await conversationService.GetOrCreateBookingConversationAsync(bookingId, ct));

    [Authorize]
    public static async Task<MarkConversationReadPayload> MarkConversationRead(
        [ID] Guid conversationId, IConversationService conversationService, CancellationToken ct
    ) => new(await conversationService.MarkConversationReadAsync(conversationId, ct));
}
