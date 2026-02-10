using ElaviewBackend.Data.Entities;

namespace ElaviewBackend.Features.Marketplace;

public record CreatePricingRuleInput(
    [property: ID] Guid SpaceId,
    PricingRuleType Type,
    decimal Value,
    DateOnly? StartDate,
    DateOnly? EndDate,
    List<int>? DaysOfWeek,
    string? Label,
    int Priority
);

public record UpdatePricingRuleInput(
    PricingRuleType? Type,
    decimal? Value,
    DateOnly? StartDate,
    DateOnly? EndDate,
    List<int>? DaysOfWeek,
    string? Label,
    int? Priority
);
