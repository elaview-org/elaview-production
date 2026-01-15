namespace ElaviewBackend.Tests.Shared.Models;

public record SpacesResponse(SpacesConnection Spaces);

public record SpacesConnection(
    List<SpaceNode> Nodes,
    PageInfo PageInfo,
    int? TotalCount = null);

public record SpaceNode(
    Guid Id,
    string Title,
    string? Description,
    string Type,
    string Status,
    string Address,
    string City,
    string State,
    decimal PricePerDay,
    decimal? InstallationFee,
    int MinDuration
);

public record SpaceByIdResponse(SpaceNode? SpaceById);

public record MySpacesResponse(SpacesConnection MySpaces);

public record CreateSpaceResponse(CreateSpacePayload CreateSpace);

public record CreateSpacePayload(SpaceNode Space);

public record UpdateSpaceResponse(UpdateSpacePayload UpdateSpace);

public record UpdateSpacePayload(SpaceNode Space);

public record DeleteSpaceResponse(DeleteSpacePayload DeleteSpace);

public record DeleteSpacePayload(bool Success);

public record DeactivateSpaceResponse(DeactivateSpacePayload DeactivateSpace);

public record DeactivateSpacePayload(SpaceNode Space);

public record ReactivateSpaceResponse(ReactivateSpacePayload ReactivateSpace);

public record ReactivateSpacePayload(SpaceNode Space);