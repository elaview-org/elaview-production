namespace ElaviewBackend.Features.Shared.Errors;

public sealed class ForbiddenException(string action)
    : DomainException("FORBIDDEN", $"Not authorized to {action}") {
    public string Action { get; } = action;
}