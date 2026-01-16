namespace ElaviewBackend.Features.Shared.Errors;

public sealed class PaymentException(string operation, string reason)
    : DomainException("PAYMENT_FAILED", $"Payment {operation} failed: {reason}") {
    public string Operation { get; } = operation;
    public string Reason { get; } = reason;
}