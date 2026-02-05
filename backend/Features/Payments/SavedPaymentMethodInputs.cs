namespace ElaviewBackend.Features.Payments;

public record ConfirmSetupIntentInput(string SetupIntentId);

public record SetDefaultPaymentMethodInput(Guid PaymentMethodId);

public record DeletePaymentMethodInput(Guid PaymentMethodId);
