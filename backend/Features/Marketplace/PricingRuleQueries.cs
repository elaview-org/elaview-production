using ElaviewBackend.Data.Entities;

namespace ElaviewBackend.Features.Marketplace;

[QueryType]
public static partial class PricingRuleQueries {
    [UsePaging(IncludeTotalCount = true)]
    [UseProjection]
    [UseFiltering]
    [UseSorting]
    public static IQueryable<PricingRule> GetPricingRulesBySpace(
        [ID] Guid spaceId,
        IPricingRuleService pricingRuleService
    ) => pricingRuleService.GetBySpaceId(spaceId);

    public static async Task<EffectivePricePayload> GetEffectivePriceByDate(
        [ID] Guid spaceId,
        DateOnly date,
        IPricingRuleService pricingRuleService,
        CancellationToken ct
    ) => await pricingRuleService.GetEffectivePriceAsync(spaceId, date, ct);
}
