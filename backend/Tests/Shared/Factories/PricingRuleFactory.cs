using Bogus;
using ElaviewBackend.Data.Entities;

namespace ElaviewBackend.Tests.Shared.Factories;

public static class PricingRuleFactory {
    private static readonly Faker Faker = new();

    public static PricingRule Create(Guid spaceId, Action<PricingRule>? customize = null) {
        var rule = new PricingRule {
            Id = Guid.NewGuid(),
            SpaceId = spaceId,
            Type = PricingRuleType.Fixed,
            Value = Faker.Finance.Amount(10, 200),
            StartDate = DateOnly.FromDateTime(DateTime.UtcNow.AddDays(1)),
            EndDate = DateOnly.FromDateTime(DateTime.UtcNow.AddDays(30)),
            Priority = 0,
            CreatedAt = DateTime.UtcNow
        };
        customize?.Invoke(rule);
        return rule;
    }

    public static PricingRule CreateFixed(Guid spaceId, decimal value, DateOnly? start = null, DateOnly? end = null, int priority = 0) {
        return new PricingRule {
            Id = Guid.NewGuid(),
            SpaceId = spaceId,
            Type = PricingRuleType.Fixed,
            Value = value,
            StartDate = start,
            EndDate = end,
            Priority = priority,
            CreatedAt = DateTime.UtcNow
        };
    }

    public static PricingRule CreateMultiplier(Guid spaceId, decimal multiplier, DateOnly? start = null, DateOnly? end = null, int priority = 0) {
        return new PricingRule {
            Id = Guid.NewGuid(),
            SpaceId = spaceId,
            Type = PricingRuleType.Multiplier,
            Value = multiplier,
            StartDate = start,
            EndDate = end,
            Priority = priority,
            CreatedAt = DateTime.UtcNow
        };
    }

    public static PricingRule CreateWithDaysOfWeek(Guid spaceId, PricingRuleType type, decimal value, List<int> daysOfWeek, int priority = 0) {
        return new PricingRule {
            Id = Guid.NewGuid(),
            SpaceId = spaceId,
            Type = type,
            Value = value,
            DaysOfWeek = daysOfWeek,
            Priority = priority,
            CreatedAt = DateTime.UtcNow
        };
    }
}
