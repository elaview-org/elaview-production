using ElaviewBackend.Features.Shared.Errors;
using HotChocolate.Authorization;

namespace ElaviewBackend.Features.Payments;

[MutationType]
public static partial class RefundMutations {
    [Authorize(Roles = ["Admin"])]
    [Error<NotFoundException>]
    [Error<InvalidStatusTransitionException>]
    [Error<ValidationException>]
    [Error<PaymentException>]
    public static async Task<RequestRefundPayload> RequestRefund(
        [ID] Guid paymentId,
        decimal amount,
        string reason,
        IRefundService refundService,
        CancellationToken ct
    ) => new(await refundService.RequestRefundAsync(paymentId, amount, reason, ct));
}