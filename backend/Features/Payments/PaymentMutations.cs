using ElaviewBackend.Features.Shared.Errors;
using ElaviewBackend.Features.Users;
using HotChocolate.Authorization;

namespace ElaviewBackend.Features.Payments;

[MutationType]
public static partial class PaymentMutations {
    [Authorize]
    [Error<NotFoundException>]
    [Error<ForbiddenException>]
    [Error<InvalidStatusTransitionException>]
    [Error<ConflictException>]
    public static async Task<CreatePaymentIntentPayload> CreatePaymentIntent(
        [ID] Guid bookingId,
        IUserService userService,
        IPaymentService paymentService,
        CancellationToken ct
    ) {
        var result = await paymentService.CreatePaymentIntentAsync(
            userService.GetPrincipalId(), bookingId, ct);
        return new CreatePaymentIntentPayload(
            result.ClientSecret, result.PaymentIntentId, result.Amount);
    }

    [Authorize]
    [Error<NotFoundException>]
    [Error<PaymentException>]
    public static async Task<ConfirmPaymentPayload> ConfirmPayment(
        string paymentIntentId,
        IPaymentService paymentService,
        CancellationToken ct
    ) => new ConfirmPaymentPayload(
        await paymentService.ConfirmPaymentAsync(paymentIntentId, ct));
}