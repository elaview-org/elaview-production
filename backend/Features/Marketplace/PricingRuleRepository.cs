using ElaviewBackend.Data;
using ElaviewBackend.Data.Entities;
using Microsoft.EntityFrameworkCore;

namespace ElaviewBackend.Features.Marketplace;

public interface IPricingRuleRepository {
    IQueryable<PricingRule> GetBySpaceId(Guid spaceId);
    Task<PricingRule?> GetByIdAsync(Guid id, CancellationToken ct);
    Task<PricingRule?> GetByIdWithSpaceOwnerAsync(Guid id, CancellationToken ct);
    Task<Space?> GetSpaceWithOwnerAsync(Guid spaceId, CancellationToken ct);
    Task<List<PricingRule>> GetApplicableRulesForRangeAsync(Guid spaceId, DateOnly start, DateOnly end, CancellationToken ct);
    Task<decimal> GetBasePriceAsync(Guid spaceId, CancellationToken ct);
    Task<PricingRule> AddAsync(PricingRule rule, CancellationToken ct);
    Task<PricingRule> UpdateAsync(PricingRule rule, UpdatePricingRuleInput input, CancellationToken ct);
    Task DeleteAsync(PricingRule rule, CancellationToken ct);
}

public sealed class PricingRuleRepository(AppDbContext context) : IPricingRuleRepository {
    public IQueryable<PricingRule> GetBySpaceId(Guid spaceId)
        => context.PricingRules
            .Where(r => r.SpaceId == spaceId)
            .OrderByDescending(r => r.Priority);

    public async Task<PricingRule?> GetByIdAsync(Guid id, CancellationToken ct)
        => await context.PricingRules.FirstOrDefaultAsync(r => r.Id == id, ct);

    public async Task<PricingRule?> GetByIdWithSpaceOwnerAsync(Guid id, CancellationToken ct)
        => await context.PricingRules
            .Include(r => r.Space)
            .ThenInclude(s => s.SpaceOwnerProfile)
            .FirstOrDefaultAsync(r => r.Id == id, ct);

    public async Task<Space?> GetSpaceWithOwnerAsync(Guid spaceId, CancellationToken ct)
        => await context.Spaces
            .Include(s => s.SpaceOwnerProfile)
            .FirstOrDefaultAsync(s => s.Id == spaceId, ct);

    public async Task<List<PricingRule>> GetApplicableRulesForRangeAsync(
        Guid spaceId, DateOnly start, DateOnly end, CancellationToken ct)
        => await context.PricingRules
            .Where(r => r.SpaceId == spaceId)
            .Where(r =>
                (r.StartDate == null && r.EndDate == null) ||
                (r.StartDate == null && r.EndDate >= start) ||
                (r.EndDate == null && r.StartDate <= end) ||
                (r.StartDate <= end && r.EndDate >= start))
            .OrderByDescending(r => r.Priority)
            .ToListAsync(ct);

    public async Task<decimal> GetBasePriceAsync(Guid spaceId, CancellationToken ct)
        => await context.Spaces
            .Where(s => s.Id == spaceId)
            .Select(s => s.PricePerDay)
            .FirstAsync(ct);

    public async Task<PricingRule> AddAsync(PricingRule rule, CancellationToken ct) {
        context.PricingRules.Add(rule);
        await context.SaveChangesAsync(ct);
        return rule;
    }

    public async Task<PricingRule> UpdateAsync(PricingRule rule, UpdatePricingRuleInput input, CancellationToken ct) {
        if (input.Type.HasValue) rule.Type = input.Type.Value;
        if (input.Value.HasValue) rule.Value = input.Value.Value;
        if (input.StartDate is not null) rule.StartDate = input.StartDate;
        if (input.EndDate is not null) rule.EndDate = input.EndDate;
        if (input.DaysOfWeek is not null) rule.DaysOfWeek = input.DaysOfWeek;
        if (input.Label is not null) rule.Label = input.Label;
        if (input.Priority.HasValue) rule.Priority = input.Priority.Value;

        await context.SaveChangesAsync(ct);
        return rule;
    }

    public async Task DeleteAsync(PricingRule rule, CancellationToken ct) {
        context.PricingRules.Remove(rule);
        await context.SaveChangesAsync(ct);
    }
}
