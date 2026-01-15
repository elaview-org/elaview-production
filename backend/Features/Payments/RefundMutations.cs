using System.Diagnostics.CodeAnalysis;
using ElaviewBackend.Data.Entities;
using HotChocolate.Authorization;

namespace ElaviewBackend.Features.Payments;

[MutationType]
[SuppressMessage("ReSharper", "MemberCanBePrivate.Global")]
public static partial class RefundMutations {
    [Authorize(Roles = ["Admin"])]
    public static async Task<RequestRefundPayload> RequestRefund(
        [ID] Guid paymentId,
        decimal amount,
        string reason,
        IRefundService refundService,
        CancellationToken ct
    ) => new(await refundService.RequestRefundAsync(paymentId, amount, reason, ct));
}
