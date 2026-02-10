using ElaviewBackend.Data.Entities;
using ElaviewBackend.Features.Shared.Errors;

namespace ElaviewBackend.Features.Marketplace;

public interface IPricingRuleService {
    IQueryable<PricingRule> GetBySpaceId(Guid spaceId);
    Task<EffectivePricePayload> GetEffectivePriceAsync(Guid spaceId, DateOnly date, CancellationToken ct);
    Task<List<DatePrice>> GetEffectivePricesForRangeAsync(Guid spaceId, DateOnly start, DateOnly end, CancellationToken ct);
    Task<PricingRule> CreateAsync(Guid userId, CreatePricingRuleInput input, CancellationToken ct);
    Task<PricingRule> UpdateAsync(Guid userId, Guid ruleId, UpdatePricingRuleInput input, CancellationToken ct);
    Task<Guid> DeleteAsync(Guid userId, Guid ruleId, CancellationToken ct);
}

public sealed class PricingRuleService(IPricingRuleRepository repository) : IPricingRuleService {
    public IQueryable<PricingRule> GetBySpaceId(Guid spaceId)
        => repository.GetBySpaceId(spaceId);

    public async Task<EffectivePricePayload> GetEffectivePriceAsync(
        Guid spaceId, DateOnly date, CancellationToken ct) {
        var basePrice = await repository.GetBasePriceAsync(spaceId, ct);
        var rules = await repository.GetApplicableRulesForRangeAsync(spaceId, date, date, ct);

        var match = FindBestRule(rules, date);
        if (match is null)
            return new EffectivePricePayload(basePrice, null, null);

        var effectivePrice = ResolvePrice(basePrice, match);
        return new EffectivePricePayload(effectivePrice, match.Id, match.Label);
    }

    public async Task<List<DatePrice>> GetEffectivePricesForRangeAsync(
        Guid spaceId, DateOnly start, DateOnly end, CancellationToken ct) {
        var basePrice = await repository.GetBasePriceAsync(spaceId, ct);
        var rules = await repository.GetApplicableRulesForRangeAsync(spaceId, start, end, ct);

        var result = new List<DatePrice>();
        for (var date = start; date <= end; date = date.AddDays(1)) {
            var match = FindBestRule(rules, date);
            if (match is null) {
                result.Add(new DatePrice(date, basePrice, null, null));
                continue;
            }

            var effectivePrice = ResolvePrice(basePrice, match);
            result.Add(new DatePrice(date, effectivePrice, match.Id, match.Label));
        }

        return result;
    }

    public async Task<PricingRule> CreateAsync(
        Guid userId, CreatePricingRuleInput input, CancellationToken ct) {
        var space = await repository.GetSpaceWithOwnerAsync(input.SpaceId, ct)
            ?? throw new NotFoundException("Space", input.SpaceId);

        if (space.SpaceOwnerProfile.UserId != userId)
            throw new ForbiddenException("create pricing rules on this space");

        ValidateInput(input.Value, input.StartDate, input.EndDate, input.DaysOfWeek, input.Priority);

        var rule = new PricingRule {
            SpaceId = input.SpaceId,
            Type = input.Type,
            Value = input.Value,
            StartDate = input.StartDate,
            EndDate = input.EndDate,
            DaysOfWeek = input.DaysOfWeek,
            Label = input.Label,
            Priority = input.Priority,
            CreatedAt = DateTime.UtcNow
        };

        return await repository.AddAsync(rule, ct);
    }

    public async Task<PricingRule> UpdateAsync(
        Guid userId, Guid ruleId, UpdatePricingRuleInput input, CancellationToken ct) {
        var rule = await repository.GetByIdWithSpaceOwnerAsync(ruleId, ct)
            ?? throw new NotFoundException("PricingRule", ruleId);

        if (rule.Space.SpaceOwnerProfile.UserId != userId)
            throw new ForbiddenException("update this pricing rule");

        var effectiveValue = input.Value ?? rule.Value;
        var effectiveStartDate = input.StartDate ?? rule.StartDate;
        var effectiveEndDate = input.EndDate ?? rule.EndDate;
        var effectiveDaysOfWeek = input.DaysOfWeek ?? rule.DaysOfWeek;
        var effectivePriority = input.Priority ?? rule.Priority;

        ValidateInput(effectiveValue, effectiveStartDate, effectiveEndDate, effectiveDaysOfWeek, effectivePriority);

        return await repository.UpdateAsync(rule, input, ct);
    }

    public async Task<Guid> DeleteAsync(Guid userId, Guid ruleId, CancellationToken ct) {
        var rule = await repository.GetByIdWithSpaceOwnerAsync(ruleId, ct)
            ?? throw new NotFoundException("PricingRule", ruleId);

        if (rule.Space.SpaceOwnerProfile.UserId != userId)
            throw new ForbiddenException("delete this pricing rule");

        await repository.DeleteAsync(rule, ct);
        return ruleId;
    }

    private static PricingRule? FindBestRule(List<PricingRule> rules, DateOnly date) {
        var dayOfWeek = (int)date.DayOfWeek;

        PricingRule? best = null;
        foreach (var rule in rules) {
            if (!IsDateInRange(rule, date))
                continue;

            if (rule.DaysOfWeek is { Count: > 0 } && !rule.DaysOfWeek.Contains(dayOfWeek))
                continue;

            if (best is null) {
                best = rule;
                continue;
            }

            if (rule.Priority > best.Priority) {
                best = rule;
                continue;
            }

            if (rule.Priority == best.Priority && GetRangeSpan(rule) < GetRangeSpan(best))
                best = rule;
        }

        return best;
    }

    private static bool IsDateInRange(PricingRule rule, DateOnly date) {
        if (rule.StartDate.HasValue && date < rule.StartDate.Value)
            return false;
        if (rule.EndDate.HasValue && date > rule.EndDate.Value)
            return false;
        return true;
    }

    private static int GetRangeSpan(PricingRule rule) {
        if (rule.StartDate.HasValue && rule.EndDate.HasValue)
            return rule.EndDate.Value.DayNumber - rule.StartDate.Value.DayNumber;
        return int.MaxValue;
    }

    private static decimal ResolvePrice(decimal basePrice, PricingRule rule)
        => rule.Type switch {
            PricingRuleType.Fixed => rule.Value,
            PricingRuleType.Multiplier => basePrice * rule.Value,
            _ => basePrice
        };

    private static void ValidateInput(
        decimal value, DateOnly? startDate, DateOnly? endDate, List<int>? daysOfWeek, int priority) {
        if (value <= 0)
            throw new ValidationException("Value", "Value must be greater than 0");

        if (startDate.HasValue && endDate.HasValue && endDate.Value <= startDate.Value)
            throw new ValidationException("EndDate", "End date must be after start date");

        if (daysOfWeek is { Count: > 0 } && daysOfWeek.Any(d => d is < 0 or > 6))
            throw new ValidationException("DaysOfWeek", "Days of week must be between 0 (Sunday) and 6 (Saturday)");

        if (priority < 0)
            throw new ValidationException("Priority", "Priority must be 0 or greater");
    }
}
