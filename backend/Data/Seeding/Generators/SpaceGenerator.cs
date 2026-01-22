using Bogus;
using ElaviewBackend.Data.Entities;

namespace ElaviewBackend.Data.Seeding.Generators;

public sealed class SpaceGenerator {
    private readonly Faker<Space> _faker;

    public SpaceGenerator(int? seed = null) {
        if (seed.HasValue)
            Randomizer.Seed = new Random(seed.Value);

        _faker = new Faker<Space>()
            .RuleFor(s => s.Title, f => $"{f.Commerce.ProductAdjective()} {f.Address.StreetSuffix()} Ad Space")
            .RuleFor(s => s.Description, f => f.Lorem.Paragraph())
            .RuleFor(s => s.Type, f => f.PickRandom<SpaceType>())
            .RuleFor(s => s.Status, _ => SpaceStatus.Active)
            .RuleFor(s => s.Address, f => f.Address.StreetAddress())
            .RuleFor(s => s.City, f => f.Address.City())
            .RuleFor(s => s.State, f => f.Address.StateAbbr())
            .RuleFor(s => s.ZipCode, f => f.Address.ZipCode())
            .RuleFor(s => s.Latitude, f => f.Address.Latitude())
            .RuleFor(s => s.Longitude, f => f.Address.Longitude())
            .RuleFor(s => s.Width, f => f.Random.Double(4, 20))
            .RuleFor(s => s.Height, f => f.Random.Double(3, 15))
            .RuleFor(s => s.PricePerDay, f => f.Finance.Amount(25, 200))
            .RuleFor(s => s.InstallationFee, f => f.Finance.Amount(15, 50))
            .RuleFor(s => s.MinDuration, f => f.PickRandom(7, 14, 30))
            .RuleFor(s => s.MaxDuration, f => f.PickRandom(90, 180, 365));
    }

    public Space Generate() => _faker.Generate();

    public List<Space> Generate(int count) => _faker.Generate(count);

    public Space ForOwner(Guid ownerProfileId) {
        var space = Generate();
        space.SpaceOwnerProfileId = ownerProfileId;
        return space;
    }

    public List<Space> ForOwner(Guid ownerProfileId, int count) {
        return Enumerable.Range(0, count)
            .Select(_ => ForOwner(ownerProfileId))
            .ToList();
    }
}