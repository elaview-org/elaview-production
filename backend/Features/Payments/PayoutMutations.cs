using ElaviewBackend.Data.Entities;
using ElaviewBackend.Features.Shared.Errors;
using ElaviewBackend.Features.Users;
using HotChocolate.Authorization;

namespace ElaviewBackend.Features.Payments;

[MutationType]
public static partial class PayoutMutations {
    [Authorize(Roles = ["Admin"])]
    [Error<NotFoundException>]
    [Error<ConflictException>]
    [Error<PaymentException>]
    public static async Task<ProcessPayoutPayload> ProcessPayout(
        [ID] Guid bookingId,
        PayoutStage stage,
        IPayoutService payoutService,
        CancellationToken ct
    ) => new ProcessPayoutPayload(
        await payoutService.ProcessPayoutAsync(bookingId, stage, ct));

    [Authorize(Roles = ["Admin"])]
    [Error<NotFoundException>]
    [Error<InvalidStatusTransitionException>]
    [Error<PaymentException>]
    public static async Task<RetryPayoutPayload> RetryPayout(
        [ID] Guid payoutId,
        IPayoutService payoutService,
        CancellationToken ct
    ) => new RetryPayoutPayload(
        await payoutService.RetryPayoutAsync(payoutId, ct));

    [Authorize]
    [Error<NotFoundException>]
    [Error<ValidationException>]
    [Error<PaymentException>]
    public static async Task<RequestManualPayoutPayload> RequestManualPayout(
        RequestManualPayoutInput input,
        IUserService userService,
        IPayoutService payoutService,
        CancellationToken ct
    ) => new RequestManualPayoutPayload(
        await payoutService.RequestManualPayoutAsync(
            userService.GetPrincipalId(), input.Amount, ct));
}