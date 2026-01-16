namespace ElaviewBackend.Features.Shared.Errors;

public sealed class ValidationException : DomainException {
    public IReadOnlyDictionary<string, string[]> Errors { get; }

    public ValidationException(string field, string message)
        : base("VALIDATION_FAILED", message) {
        Errors = new Dictionary<string, string[]> { [field] = [message] };
    }

    public ValidationException(IReadOnlyDictionary<string, string[]> errors)
        : base("VALIDATION_FAILED", "One or more validation errors occurred") {
        Errors = errors;
    }
}