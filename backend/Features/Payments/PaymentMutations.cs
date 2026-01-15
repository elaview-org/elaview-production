using System.Diagnostics.CodeAnalysis;
using HotChocolate.Authorization;

namespace ElaviewBackend.Features.Payments;

[MutationType]
[SuppressMessage("ReSharper", "MemberCanBePrivate.Global")]
public static partial class PaymentMutations {
    [Authorize]
    public static async Task<CreatePaymentIntentPayload> CreatePaymentIntent(
        [ID] Guid bookingId, IPaymentService paymentService,
        CancellationToken ct
    ) {
        var result =
            await paymentService.CreatePaymentIntentAsync(bookingId, ct);
        return new CreatePaymentIntentPayload(result.ClientSecret,
            result.PaymentIntentId, result.Amount);
    }

    [Authorize]
    public static async Task<ConfirmPaymentPayload> ConfirmPayment(
        string paymentIntentId, IPaymentService paymentService,
        CancellationToken ct
    ) {
        return new ConfirmPaymentPayload(
            await paymentService.ConfirmPaymentAsync(paymentIntentId, ct));
    }
}