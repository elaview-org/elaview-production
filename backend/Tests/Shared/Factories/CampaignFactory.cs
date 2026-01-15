using Bogus;
using ElaviewBackend.Data.Entities;

namespace ElaviewBackend.Tests.Shared.Factories;

public static class CampaignFactory {
    private static readonly Faker Faker = new();

    public static Campaign Create(Guid advertiserProfileId,
        Action<Campaign>? customize = null) {
        var campaign = new Campaign {
            Id = Guid.NewGuid(),
            AdvertiserProfileId = advertiserProfileId,
            Name = Faker.Commerce.ProductName() + " Campaign",
            Description = Faker.Lorem.Paragraph(),
            ImageUrl = Faker.Image.PicsumUrl(),
            TargetAudience = Faker.Commerce.Categories(1)[0],
            Goals = "Brand Awareness",
            TotalBudget = Faker.Random.Decimal(1000, 10000),
            Status = CampaignStatus.Draft,
            StartDate =
                DateTime.SpecifyKind(Faker.Date.Future(), DateTimeKind.Utc),
            EndDate =
                DateTime.SpecifyKind(Faker.Date.Future(2), DateTimeKind.Utc),
            CreatedAt = DateTime.UtcNow
        };
        customize?.Invoke(campaign);
        return campaign;
    }

    public static List<Campaign> CreateMany(Guid advertiserProfileId, int count,
        Action<Campaign, int>? customize = null) {
        return Enumerable.Range(0, count)
            .Select(i => {
                var campaign = Create(advertiserProfileId);
                customize?.Invoke(campaign, i);
                return campaign;
            })
            .ToList();
    }
}