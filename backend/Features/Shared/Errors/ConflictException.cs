namespace ElaviewBackend.Features.Shared.Errors;

public sealed class ConflictException(string resource, string reason)
    : DomainException("CONFLICT", $"{resource}: {reason}") {
    public string Resource { get; } = resource;
    public string Reason { get; } = reason;
}