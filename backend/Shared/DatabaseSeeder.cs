using ElaviewBackend.Shared.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;

namespace ElaviewBackend.Shared;

public class DatabaseSeeder {
    private readonly AppDbContext _db;
    private readonly IOptions<GlobalSettings> _settings;
    private readonly ILogger<DatabaseSeeder> _logger;

    public DatabaseSeeder(AppDbContext db, IOptions<GlobalSettings> settings,
        ILogger<DatabaseSeeder> logger) {
        _db = db;
        _settings = settings;
        _logger = logger;
    }

    public async Task SeedDevelopmentAccountsAsync(bool development) {
        var devAccounts = _settings.Value.DevelopmentAccounts;
        if (!devAccounts.Any()) {
            _logger.LogInformation(
                "No development accounts configured in .env");
            return;
        }

        foreach (var account in devAccounts) {
            if (await _db.Users.AnyAsync(u => u.Email == account.Email)) {
                _logger.LogInformation(
                    "Development account {Email} already exists",
                    account.Email);
                continue;
            }

            var hashedPassword =
                BCrypt.Net.BCrypt.HashPassword(account.Password);
            var role = Enum.TryParse<UserRole>(account.Role, out var parsedRole)
                ? parsedRole
                : UserRole.User;

            if (role != parsedRole)
                _logger.LogWarning(
                    "Invalid role '{Role}' for {Email}, defaulting to User",
                    account.Role, account.Email);

            // create user
            var user = new User {
                Email = account.Email,
                Password = hashedPassword,
                Name = account.Name!,
                Role = role,
                Status = UserStatus.Active
            };
            _db.Users.Add(user);
            await _db.SaveChangesAsync();

            if (role == UserRole.User) {
                // create AdvertiserProfile
                var advertiserProfile = new AdvertiserProfile {
                    UserId = user.Id,
                    OnboardingComplete = false
                };
                _db.AdvertiserProfiles.Add(advertiserProfile);

                // create SpaceOwnerProfile
                var spaceOwnerProfile = new SpaceOwnerProfile {
                    UserId = user.Id,
                    OnboardingComplete = false,
                    PayoutSchedule = PayoutSchedule.Weekly
                };
                _db.SpaceOwnerProfiles.Add(spaceOwnerProfile);

                // set user's active profile to advertiser by default
                user.ActiveProfileType = ProfileType.Advertiser;

                await _db.SaveChangesAsync();
            }

            _logger.LogInformation(
                "Created development account: {Email} with role {Role}",
                account.Email, role);
        }

        if (development)
            await SeedSpacesAsync();
    }

    private async Task SeedSpacesAsync() {
        var users = await _db.Users
            .Where(u => u.Role == UserRole.User)
            .Include(u => u.SpaceOwnerProfile)
            .Take(2)
            .ToListAsync();

        foreach (var user in users) {
            var spaceOwnerProfile = user.SpaceOwnerProfile;
            if (spaceOwnerProfile == null) {
                _logger.LogWarning(
                    "SpaceOwner profile not found for user {Email}",
                    user.Email);
                continue;
            }

            var existingSpaces = await _db.Spaces
                .CountAsync(s => s.SpaceOwnerProfileId == spaceOwnerProfile.Id);

            var toCreate = 64 - existingSpaces;
            if (toCreate <= 0) {
                _logger.LogInformation(
                    "User {Email} already has {Count} spaces", user.Email,
                    existingSpaces);
                continue;
            }

            await CreateSpacesForProfile(spaceOwnerProfile, toCreate);
            _logger.LogInformation("Created {Count} spaces for user {Email}",
                toCreate, user.Email);
        }
    }

    private async Task CreateSpacesForProfile(SpaceOwnerProfile spaceOwner,
        int count) {
        var random = new Random(42);
        var spaceTypes = Enum.GetValues<SpaceType>();
        var cities = new[] {
            ("New York", "NY", 40.7128, -74.0060),
            ("Los Angeles", "CA", 34.0522, -118.2437),
            ("Chicago", "IL", 41.8781, -87.6298),
            ("Houston", "TX", 29.7604, -95.3698),
            ("Phoenix", "AZ", 33.4484, -112.0740),
            ("Philadelphia", "PA", 39.9526, -75.1652),
            ("San Antonio", "TX", 29.4241, -98.4936),
            ("San Diego", "CA", 32.7157, -117.1611)
        };

        var spaces = new List<Space>(count);

        for (var i = 0; i < count; i++) {
            var type = spaceTypes[random.Next(spaceTypes.Length)];
            var city = cities[random.Next(cities.Length)];
            var latOffset = (random.NextDouble() - 0.5) * 0.1;
            var lonOffset = (random.NextDouble() - 0.5) * 0.1;

            spaces.Add(new Space {
                Title = GenerateSpaceTitle(type, i),
                Description = GenerateSpaceDescription(type),
                Type = type,
                Status = SpaceStatus.Active,
                Address =
                    $"{random.Next(100, 9999)} {GenerateStreetName(random)}",
                City = city.Item1,
                State = city.Item2,
                ZipCode = random.Next(10000, 99999).ToString(),
                Latitude = city.Item3 + latOffset,
                Longitude = city.Item4 + lonOffset,
                Width = random.Next(4, 20),
                Height = random.Next(3, 15),
                PricePerDay = random.Next(10, 200),
                InstallationFee = random.Next(10, 50),
                MinDuration = random.Next(1, 7),
                MaxDuration = random.Next(30, 365),
                Images = new List<string>(),
                SpaceOwnerProfileId = spaceOwner.Id
            });
        }

        _db.Spaces.AddRange(spaces);
        await _db.SaveChangesAsync();
    }

    private static string GenerateSpaceTitle(SpaceType type, int index) =>
        type switch {
            SpaceType.Billboard => $"Highway Billboard #{index + 1}",
            SpaceType.Storefront => $"Storefront Window Display #{index + 1}",
            SpaceType.Transit => $"Bus Stop Advertising #{index + 1}",
            SpaceType.DigitalDisplay => $"Digital Screen #{index + 1}",
            SpaceType.WindowDisplay => $"Retail Window #{index + 1}",
            SpaceType.VehicleWrap => $"Vehicle Wrap Space #{index + 1}",
            _ => $"Advertising Space #{index + 1}"
        };

    private static string GenerateSpaceDescription(SpaceType type) =>
        type switch {
            SpaceType.Billboard =>
                "High-visibility billboard located on major highway with heavy traffic flow.",
            SpaceType.Storefront =>
                "Prime storefront window display in busy shopping district.",
            SpaceType.Transit =>
                "Bus shelter advertising space at high-traffic transit stop.",
            SpaceType.DigitalDisplay =>
                "Modern digital display screen in commercial area.",
            SpaceType.WindowDisplay =>
                "Street-facing retail window perfect for brand visibility.",
            SpaceType.VehicleWrap =>
                "Mobile advertising opportunity through vehicle wrap.",
            _ => "Premium advertising space in excellent location."
        };

    private static string GenerateStreetName(Random random) {
        var streetNames = new[] {
            "Main St", "Broadway", "Park Ave", "Market St", "1st Ave",
            "Oak St", "Elm St", "Washington St", "Maple Ave", "Pine St"
        };
        return streetNames[random.Next(streetNames.Length)];
    }
}