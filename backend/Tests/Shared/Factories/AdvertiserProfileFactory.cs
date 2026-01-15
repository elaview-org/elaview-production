using Bogus;
using ElaviewBackend.Data.Entities;

namespace ElaviewBackend.Tests.Shared.Factories;

public static class AdvertiserProfileFactory {
    private static readonly Faker Faker = new();

    public static AdvertiserProfile Create(Guid userId, Action<AdvertiserProfile>? customize = null) {
        var profile = new AdvertiserProfile {
            Id = Guid.NewGuid(),
            UserId = userId,
            CompanyName = Faker.Company.CompanyName(),
            Industry = Faker.Commerce.Categories(1)[0],
            Website = Faker.Internet.Url(),
            CreatedAt = DateTime.UtcNow
        };
        customize?.Invoke(profile);
        return profile;
    }
}