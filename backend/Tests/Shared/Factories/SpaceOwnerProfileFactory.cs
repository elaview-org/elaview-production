using Bogus;
using ElaviewBackend.Data.Entities;

namespace ElaviewBackend.Tests.Shared.Factories;

public static class SpaceOwnerProfileFactory {
    private static readonly Faker Faker = new();

    public static SpaceOwnerProfile Create(Guid userId,
        Action<SpaceOwnerProfile>? customize = null) {
        var profile = new SpaceOwnerProfile {
            Id = Guid.NewGuid(),
            UserId = userId,
            BusinessName = Faker.Company.CompanyName(),
            BusinessType = Faker.Commerce.Categories(1)[0],
            PayoutSchedule = PayoutSchedule.Weekly,
            CreatedAt = DateTime.UtcNow
        };
        customize?.Invoke(profile);
        return profile;
    }
}