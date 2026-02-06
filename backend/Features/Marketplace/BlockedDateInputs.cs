namespace ElaviewBackend.Features.Marketplace;

public record BlockDatesInput(
    [property: ID] Guid SpaceId,
    List<DateOnly> Dates,
    string? Reason
);

public record UnblockDatesInput(
    [property: ID] Guid SpaceId,
    List<DateOnly> Dates
);
