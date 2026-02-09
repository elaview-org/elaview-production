using ElaviewBackend.Features.Shared.Errors;
using ElaviewBackend.Features.Users;
using HotChocolate.Authorization;

namespace ElaviewBackend.Features.Marketplace;

[MutationType]
public static partial class PricingRuleMutations {
    [Authorize]
    [Error<NotFoundException>]
    [Error<ForbiddenException>]
    [Error<ValidationException>]
    public static async Task<CreatePricingRulePayload> CreatePricingRule(
        CreatePricingRuleInput input,
        IUserService userService,
        IPricingRuleService pricingRuleService,
        CancellationToken ct
    ) {
        var rule = await pricingRuleService.CreateAsync(userService.GetPrincipalId(), input, ct);
        return new CreatePricingRulePayload(rule);
    }

    [Authorize]
    [Error<NotFoundException>]
    [Error<ForbiddenException>]
    [Error<ValidationException>]
    public static async Task<UpdatePricingRulePayload> UpdatePricingRule(
        [ID] Guid id,
        UpdatePricingRuleInput input,
        IUserService userService,
        IPricingRuleService pricingRuleService,
        CancellationToken ct
    ) {
        var rule = await pricingRuleService.UpdateAsync(userService.GetPrincipalId(), id, input, ct);
        return new UpdatePricingRulePayload(rule);
    }

    [Authorize]
    [Error<NotFoundException>]
    [Error<ForbiddenException>]
    public static async Task<DeletePricingRulePayload> DeletePricingRule(
        [ID] Guid id,
        IUserService userService,
        IPricingRuleService pricingRuleService,
        CancellationToken ct
    ) {
        var deletedId = await pricingRuleService.DeleteAsync(userService.GetPrincipalId(), id, ct);
        return new DeletePricingRulePayload(deletedId);
    }
}
