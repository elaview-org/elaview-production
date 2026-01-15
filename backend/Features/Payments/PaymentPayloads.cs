using ElaviewBackend.Data.Entities;

namespace ElaviewBackend.Features.Payments;

public record CreatePaymentIntentPayload(
    string ClientSecret,
    string PaymentIntentId,
    decimal Amount
);

public record ConfirmPaymentPayload(Payment Payment);