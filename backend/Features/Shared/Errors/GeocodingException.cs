namespace ElaviewBackend.Features.Shared.Errors;

public sealed class GeocodingException(string address, string? details = null)
    : DomainException("GEOCODING_FAILED", $"Failed to geocode address: {address}{(details is not null ? $" - {details}" : "")}") {
    public string Address { get; } = address;
    public string? Details { get; } = details;
}
