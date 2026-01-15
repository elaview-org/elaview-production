using ElaviewBackend.Data.Entities;

namespace ElaviewBackend.Features.Marketplace;

public record CreateSpacePayload(Space Space);
public record UpdateSpacePayload(Space Space);
public record DeleteSpacePayload(bool Success);
public record DeactivateSpacePayload(Space Space);
public record ReactivateSpacePayload(Space Space);