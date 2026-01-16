namespace ElaviewBackend.Features.Shared.Errors;

public sealed class NotFoundException(string entityType, Guid entityId)
    : DomainException("NOT_FOUND", $"{entityType} with ID {entityId} not found") {
    public string EntityType { get; } = entityType;
    public Guid EntityId { get; } = entityId;
}