using ElaviewBackend.Data.Entities;

namespace ElaviewBackend.Features.Marketplace;

public record CreatePricingRulePayload(PricingRule PricingRule);

public record UpdatePricingRulePayload(PricingRule PricingRule);

public record DeletePricingRulePayload(Guid DeletedRuleId);

public record EffectivePricePayload(decimal EffectivePrice, Guid? AppliedRuleId, string? AppliedRuleLabel);

public record DatePrice(DateOnly Date, decimal EffectivePrice, Guid? AppliedRuleId, string? AppliedRuleLabel);
