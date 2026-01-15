using System.Diagnostics.CodeAnalysis;
using ElaviewBackend.Data.Entities;
using HotChocolate.Authorization;

namespace ElaviewBackend.Features.Payments;

[MutationType]
[SuppressMessage("ReSharper", "MemberCanBePrivate.Global")]
public static partial class PayoutMutations {
    [Authorize(Roles = ["Admin"])]
    public static async Task<ProcessPayoutPayload> ProcessPayout(
        [ID] Guid bookingId,
        PayoutStage stage,
        IPayoutService payoutService,
        CancellationToken ct
    ) {
        return new ProcessPayoutPayload(
            await payoutService.ProcessPayoutAsync(bookingId, stage, ct));
    }

    [Authorize(Roles = ["Admin"])]
    public static async Task<RetryPayoutPayload> RetryPayout(
        [ID] Guid payoutId,
        IPayoutService payoutService,
        CancellationToken ct
    ) {
        return new RetryPayoutPayload(
            await payoutService.RetryPayoutAsync(payoutId, ct));
    }
}