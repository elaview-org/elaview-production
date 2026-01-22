using ElaviewBackend.Data.Entities;
using Microsoft.EntityFrameworkCore;

namespace ElaviewBackend.Data.Seeding.Seeders;

public sealed class LegacyDevAccountsSeeder(AppDbContext context) : ISeeder {
    public int Order => 101;
    public string Name => "101_LegacyDevAccountsSeeder";
    public bool RunInProduction => false;

    private static readonly (string Email, string Password, string Name, string Role)[] DevAccounts = [
        ("admin@email.com", "admin123", "Administrator", "Admin"),
        ("marketing@email.com", "marketing123", "Marketing", "Marketing"),
        ("user1@email.com", "user123", "User1", "User"),
        ("user2@email.com", "user123", "User2", "User")
    ];

    private static readonly (string City, string State, double Lat, double Lon)[] Cities = [
        ("New York", "NY", 40.7128, -74.0060),
        ("Los Angeles", "CA", 34.0522, -118.2437),
        ("Chicago", "IL", 41.8781, -87.6298),
        ("Houston", "TX", 29.7604, -95.3698),
        ("Phoenix", "AZ", 33.4484, -112.0740),
        ("Philadelphia", "PA", 39.9526, -75.1652),
        ("San Antonio", "TX", 29.4241, -98.4936),
        ("San Diego", "CA", 32.7157, -117.1611)
    ];

    private static readonly string[] StreetNames = [
        "Main St", "Broadway", "Park Ave", "Market St", "1st Ave",
        "Oak St", "Elm St", "Washington St", "Maple Ave", "Pine St"
    ];

    public async Task SeedAsync(CancellationToken ct) {
        foreach (var account in DevAccounts) {
            if (await context.Users.AnyAsync(u => u.Email == account.Email, ct))
                continue;

            var role = Enum.TryParse<UserRole>(account.Role, out var parsedRole)
                ? parsedRole
                : UserRole.User;

            var user = new User {
                Email = account.Email,
                Password = BCrypt.Net.BCrypt.HashPassword(account.Password),
                Name = account.Name,
                Role = role,
                Status = UserStatus.Active
            };
            context.Users.Add(user);
            await context.SaveChangesAsync(ct);

            if (role == UserRole.User) {
                context.AdvertiserProfiles.Add(new AdvertiserProfile {
                    UserId = user.Id,
                    OnboardingComplete = false
                });

                context.SpaceOwnerProfiles.Add(new SpaceOwnerProfile {
                    UserId = user.Id,
                    OnboardingComplete = false,
                    PayoutSchedule = PayoutSchedule.Weekly
                });

                user.ActiveProfileType = ProfileType.Advertiser;
                await context.SaveChangesAsync(ct);
            }
        }

        await SeedSpacesAsync(ct);
    }

    private async Task SeedSpacesAsync(CancellationToken ct) {
        var users = await context.Users
            .Where(u => u.Role == UserRole.User)
            .Include(u => u.SpaceOwnerProfile)
            .Take(2)
            .ToListAsync(ct);

        foreach (var user in users) {
            if (user.SpaceOwnerProfile == null)
                continue;

            var existingCount = await context.Spaces
                .CountAsync(s => s.SpaceOwnerProfileId == user.SpaceOwnerProfile.Id, ct);

            var toCreate = 64 - existingCount;
            if (toCreate <= 0)
                continue;

            await CreateSpacesAsync(user.SpaceOwnerProfile.Id, toCreate, ct);
        }
    }

    private async Task CreateSpacesAsync(Guid ownerId, int count, CancellationToken ct) {
        var random = new Random(42);
        var spaceTypes = Enum.GetValues<SpaceType>();

        for (var i = 0; i < count; i++) {
            var type = spaceTypes[random.Next(spaceTypes.Length)];
            var city = Cities[random.Next(Cities.Length)];

            context.Spaces.Add(new Space {
                Title = GetSpaceTitle(type, i),
                Description = GetSpaceDescription(type),
                Type = type,
                Status = SpaceStatus.Active,
                Address = $"{random.Next(100, 9999)} {StreetNames[random.Next(StreetNames.Length)]}",
                City = city.City,
                State = city.State,
                ZipCode = random.Next(10000, 99999).ToString(),
                Latitude = city.Lat + (random.NextDouble() - 0.5) * 0.1,
                Longitude = city.Lon + (random.NextDouble() - 0.5) * 0.1,
                Width = random.Next(4, 20),
                Height = random.Next(3, 15),
                PricePerDay = random.Next(10, 200),
                InstallationFee = random.Next(10, 50),
                MinDuration = random.Next(1, 7),
                MaxDuration = random.Next(30, 365),
                Images = [],
                SpaceOwnerProfileId = ownerId
            });
        }

        await context.SaveChangesAsync(ct);
    }

    private static string GetSpaceTitle(SpaceType type, int index) => type switch {
        SpaceType.Billboard => $"Highway Billboard #{index + 1}",
        SpaceType.Storefront => $"Storefront Window Display #{index + 1}",
        SpaceType.Transit => $"Bus Stop Advertising #{index + 1}",
        SpaceType.DigitalDisplay => $"Digital Screen #{index + 1}",
        SpaceType.WindowDisplay => $"Retail Window #{index + 1}",
        SpaceType.VehicleWrap => $"Vehicle Wrap Space #{index + 1}",
        _ => $"Advertising Space #{index + 1}"
    };

    private static string GetSpaceDescription(SpaceType type) => type switch {
        SpaceType.Billboard => "High-visibility billboard located on major highway with heavy traffic flow.",
        SpaceType.Storefront => "Prime storefront window display in busy shopping district.",
        SpaceType.Transit => "Bus shelter advertising space at high-traffic transit stop.",
        SpaceType.DigitalDisplay => "Modern digital display screen in commercial area.",
        SpaceType.WindowDisplay => "Street-facing retail window perfect for brand visibility.",
        SpaceType.VehicleWrap => "Mobile advertising opportunity through vehicle wrap.",
        _ => "Premium advertising space in excellent location."
    };
}