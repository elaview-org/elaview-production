namespace ElaviewBackend.Features.Shared.Errors;

public sealed class InvalidStatusTransitionException(string from, string to)
    : DomainException("INVALID_STATUS_TRANSITION", $"Cannot transition from {from} to {to}") {
    public string FromStatus { get; } = from;
    public string ToStatus { get; } = to;
}