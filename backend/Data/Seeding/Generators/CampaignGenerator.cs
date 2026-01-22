using Bogus;
using ElaviewBackend.Data.Entities;

namespace ElaviewBackend.Data.Seeding.Generators;

public sealed class CampaignGenerator {
    private readonly Faker _faker;

    public CampaignGenerator(int? seed = null) {
        _faker = seed.HasValue
            ? new Faker { Random = new Randomizer(seed.Value) }
            : new Faker();
    }

    public Campaign Generate(Guid advertiserProfileId) {
        var startDate = DateTime.SpecifyKind(_faker.Date.Future(1), DateTimeKind.Utc);
        var endDate = DateTime.SpecifyKind(startDate.AddDays(_faker.Random.Int(14, 90)), DateTimeKind.Utc);

        return new Campaign {
            AdvertiserProfileId = advertiserProfileId,
            Name = $"{_faker.Commerce.ProductAdjective()} {_faker.Commerce.Product()} Campaign",
            Description = _faker.Lorem.Paragraph(),
            ImageUrl = _faker.Image.PicsumUrl(),
            TargetAudience = _faker.PickRandom("Young Adults", "Families", "Professionals", "Seniors"),
            Goals = _faker.PickRandom("Brand Awareness", "Lead Generation", "Sales", "Event Promotion"),
            TotalBudget = _faker.Finance.Amount(1000, 10000),
            Status = CampaignStatus.Draft,
            StartDate = startDate,
            EndDate = endDate
        };
    }

    public List<Campaign> Generate(Guid advertiserProfileId, int count) {
        return Enumerable.Range(0, count)
            .Select(_ => Generate(advertiserProfileId))
            .ToList();
    }
}