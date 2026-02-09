namespace ElaviewBackend.Tests.Shared.Models;

public record PricingRulesBySpaceResponse(PricingRulesConnection PricingRulesBySpace);

public record PricingRulesConnection(
    List<PricingRuleNode> Nodes,
    PageInfo PageInfo,
    int? TotalCount = null);

public record PricingRuleNode(
    Guid Id,
    Guid SpaceId,
    string Type,
    decimal Value,
    DateOnly? StartDate,
    DateOnly? EndDate,
    List<int>? DaysOfWeek,
    string? Label,
    int Priority
);

public record EffectivePriceByDateResponse(EffectivePricePayloadNode EffectivePriceByDate);

public record EffectivePricePayloadNode(
    decimal EffectivePrice,
    Guid? AppliedRuleId,
    string? AppliedRuleLabel);

public record CreatePricingRuleResponse(CreatePricingRulePayloadNode CreatePricingRule);

public record CreatePricingRulePayloadNode(PricingRuleNode? PricingRule, List<MutationError>? Errors);

public record UpdatePricingRuleResponse(UpdatePricingRulePayloadNode UpdatePricingRule);

public record UpdatePricingRulePayloadNode(PricingRuleNode? PricingRule, List<MutationError>? Errors);

public record DeletePricingRuleResponse(DeletePricingRulePayloadNode DeletePricingRule);

public record DeletePricingRulePayloadNode(Guid? DeletedRuleId, List<MutationError>? Errors);
