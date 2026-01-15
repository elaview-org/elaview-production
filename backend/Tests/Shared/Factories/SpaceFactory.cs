using Bogus;
using ElaviewBackend.Data.Entities;

namespace ElaviewBackend.Tests.Shared.Factories;

public static class SpaceFactory {
    private static readonly Faker Faker = new();

    public static Space Create(Guid spaceOwnerProfileId,
        Action<Space>? customize = null) {
        var space = new Space {
            Id = Guid.NewGuid(),
            SpaceOwnerProfileId = spaceOwnerProfileId,
            Title = Faker.Commerce.ProductName(),
            Description = Faker.Lorem.Paragraph(),
            Type = SpaceType.Storefront,
            Status = SpaceStatus.Active,
            Address = Faker.Address.StreetAddress(),
            City = Faker.Address.City(),
            State = Faker.Address.StateAbbr(),
            ZipCode = Faker.Address.ZipCode(),
            Latitude = Faker.Address.Latitude(),
            Longitude = Faker.Address.Longitude(),
            PricePerDay = Faker.Random.Decimal(10, 100),
            InstallationFee = Faker.Random.Decimal(10, 50),
            MinDuration = 7,
            CreatedAt = DateTime.UtcNow
        };
        customize?.Invoke(space);
        return space;
    }

    public static List<Space> CreateMany(Guid spaceOwnerProfileId, int count,
        Action<Space, int>? customize = null) {
        return Enumerable.Range(0, count)
            .Select(i => {
                var space = Create(spaceOwnerProfileId);
                customize?.Invoke(space, i);
                return space;
            })
            .ToList();
    }

    public static Space CreateWithPricing(Guid spaceOwnerProfileId,
        decimal pricePerDay, decimal? installationFee) {
        return new Space {
            Id = Guid.NewGuid(),
            SpaceOwnerProfileId = spaceOwnerProfileId,
            Title = Faker.Commerce.ProductName(),
            Description = Faker.Lorem.Paragraph(),
            Type = SpaceType.Storefront,
            Status = SpaceStatus.Active,
            Address = Faker.Address.StreetAddress(),
            City = Faker.Address.City(),
            State = Faker.Address.StateAbbr(),
            ZipCode = Faker.Address.ZipCode(),
            Latitude = Faker.Address.Latitude(),
            Longitude = Faker.Address.Longitude(),
            PricePerDay = pricePerDay,
            InstallationFee = installationFee,
            MinDuration = 7,
            CreatedAt = DateTime.UtcNow
        };
    }

    public static Space CreateWithStatus(Guid spaceOwnerProfileId,
        SpaceStatus status) {
        return new Space {
            Id = Guid.NewGuid(),
            SpaceOwnerProfileId = spaceOwnerProfileId,
            Title = Faker.Commerce.ProductName(),
            Description = Faker.Lorem.Paragraph(),
            Type = SpaceType.Storefront,
            Status = status,
            Address = Faker.Address.StreetAddress(),
            City = Faker.Address.City(),
            State = Faker.Address.StateAbbr(),
            ZipCode = Faker.Address.ZipCode(),
            Latitude = Faker.Address.Latitude(),
            Longitude = Faker.Address.Longitude(),
            PricePerDay = Faker.Random.Decimal(10, 100),
            InstallationFee = Faker.Random.Decimal(10, 50),
            MinDuration = 7,
            CreatedAt = DateTime.UtcNow
        };
    }
}