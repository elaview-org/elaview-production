using ElaviewBackend.Data.Entities;

namespace ElaviewBackend.Features.Payments;

public record CreateSetupIntentPayload(string ClientSecret, string SetupIntentId);

public record ConfirmSetupIntentPayload(SavedPaymentMethod PaymentMethod);

public record SetDefaultPaymentMethodPayload(SavedPaymentMethod PaymentMethod);

public record DeletePaymentMethodPayload(bool Success);
