using Bogus;
using ElaviewBackend.Data.Entities;
using ElaviewBackend.Data.Seeding.Generators;

namespace ElaviewBackend.Data.Seeding.Seeders;

public sealed class DevelopmentDataSeeder(AppDbContext context) : ISeeder {
    public int Order {
        get { return 100; }
    }

    public string Name {
        get { return "100_DevelopmentDataSeeder"; }
    }

    public bool RunInProduction {
        get { return false; }
    }

    private const int Seed = 8675309;

    public async Task SeedAsync(CancellationToken ct) {
        var userGen = new UserGenerator(Seed);
        var spaceGen = new SpaceGenerator(Seed);
        var campaignGen = new CampaignGenerator(Seed);
        var bookingGen = new BookingGenerator(Seed);
        var faker = new Faker { Random = new Randomizer(Seed) };

        var users = userGen.Generate(20);
        context.Users.AddRange(users);
        await context.SaveChangesAsync(ct);

        var spaceOwnerUsers = users.Take(10).ToList();
        var advertiserUsers = users.Skip(10).ToList();

        var spaceOwnerProfiles = spaceOwnerUsers.Select(u => new SpaceOwnerProfile {
            UserId = u.Id,
            OnboardingComplete = true,
            BusinessName = faker.Company.CompanyName(),
            BusinessType = faker.PickRandom("Sign Company", "Property Manager", "Retail Store"),
            PayoutSchedule = faker.PickRandom<PayoutSchedule>()
        }).ToList();

        foreach (var (user, _) in spaceOwnerUsers.Zip(spaceOwnerProfiles))
            user.ActiveProfileType = ProfileType.SpaceOwner;

        context.SpaceOwnerProfiles.AddRange(spaceOwnerProfiles);

        var advertiserProfiles = advertiserUsers.Select(u => new AdvertiserProfile {
            UserId = u.Id,
            OnboardingComplete = true,
            CompanyName = faker.Company.CompanyName(),
            Industry = faker.Commerce.Department(),
            Website = faker.Internet.Url()
        }).ToList();

        foreach (var user in advertiserUsers)
            user.ActiveProfileType = ProfileType.Advertiser;

        context.AdvertiserProfiles.AddRange(advertiserProfiles);
        await context.SaveChangesAsync(ct);

        var spaces = spaceOwnerProfiles
            .SelectMany(p => spaceGen.ForOwner(p.Id, 3))
            .ToList();
        context.Spaces.AddRange(spaces);
        await context.SaveChangesAsync(ct);

        var campaigns = advertiserProfiles
            .SelectMany(p => campaignGen.Generate(p.Id, 2))
            .ToList();
        context.Campaigns.AddRange(campaigns);
        await context.SaveChangesAsync(ct);

        var bookings = bookingGen.Generate(50, campaigns, spaces);
        context.Bookings.AddRange(bookings);
        await context.SaveChangesAsync(ct);
    }
}