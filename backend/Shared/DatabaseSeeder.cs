using ElaviewBackend.Shared.Entities;
using ElaviewBackend.Shared.Settings;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;

namespace ElaviewBackend.Shared;

public class DatabaseSeeder(
    AppDbContext dbContext,
    IOptions<GlobalSettings> settings,
    ILogger<DatabaseSeeder> logger) {
    public async Task SeedDevelopmentAccountsAsync(bool development) {
        var developmentAccounts = settings.Value.DevelopmentAccounts;

        if (developmentAccounts.Count == 0) {
            logger.LogInformation(
                "No development accounts configured in .env");
            return;
        }

        foreach (var account in developmentAccounts) {
            var existingUser = await dbContext.Users
                .FirstOrDefaultAsync(u => u.Email == account.Email);

            if (existingUser != null) {
                logger.LogInformation(
                    "Development account {Email} already exists",
                    account.Email);
                continue;
            }

            var hashedPassword =
                BCrypt.Net.BCrypt.HashPassword(account.Password);

            if (!Enum.TryParse<UserRole>(account.Role, out var userRole)) {
                userRole = UserRole.User;
                logger.LogWarning(
                    "Invalid role '{Role}' for {Email}, defaulting to User",
                    account.Role, account.Email);
            }

            var user = new User {
                Email = account.Email,
                Password = hashedPassword,
                Name = account.Name,
                Role = userRole,
                Status = UserStatus.Active
            };

            dbContext.Users.Add(user);
            await dbContext.SaveChangesAsync();

            if (userRole == UserRole.User) {
                var advertiserProfile = new Profile {
                    User = user,
                    ProfileType = ProfileType.Advertiser
                };
                dbContext.Profiles.Add(advertiserProfile);
                await dbContext.SaveChangesAsync();

                var advertiserProfileExtension = new AdvertiserProfile {
                    Profile = advertiserProfile,
                    OnboardingComplete = false
                };
                dbContext.AdvertiserProfiles.Add(advertiserProfileExtension);

                var spaceOwnerProfile = new Profile {
                    User = user,
                    ProfileType = ProfileType.SpaceOwner
                };
                dbContext.Profiles.Add(spaceOwnerProfile);
                await dbContext.SaveChangesAsync();

                var spaceOwnerProfileExtension = new SpaceOwnerProfile {
                    Profile = spaceOwnerProfile,
                    PayoutSchedule = PayoutSchedule.Weekly,
                    OnboardingComplete = false
                };
                dbContext.SpaceOwnerProfiles.Add(spaceOwnerProfileExtension);

                user.ActiveProfile = advertiserProfile;

                await dbContext.SaveChangesAsync();
            }

#pragma warning disable CA1873
            logger.LogInformation(
                "Created development account: {Email} with role {Role}",
                account.Email, userRole);
#pragma warning restore CA1873
        }

        if (development) {
            await SeedSpacesAsync();
        }
    }

    private async Task SeedSpacesAsync() {
        var regularUsers = await dbContext.Users
            .Where(u => u.Role == UserRole.User)
            .Take(2)
            .ToListAsync();

        if (regularUsers.Count < 2) {
            logger.LogWarning("Not enough regular users to seed spaces");
            return;
        }

        foreach (var user in regularUsers) {
            var profile = await dbContext.Profiles
                .FirstOrDefaultAsync(p => p.User.Id == user.Id &&
                                          p.ProfileType ==
                                          ProfileType.SpaceOwner);

            if (profile == null) {
                logger.LogWarning(
                    "SpaceOwner profile not found for user {Email}, skipping",
                    user.Email);
                continue;
            }

            var existingSpacesCount = await dbContext.Spaces
                .CountAsync(s => s.OwnerProfile.User.Id == user.Id);

            if (existingSpacesCount >= 64) {
                logger.LogInformation(
                    "User {Email} already has {Count} spaces, skipping",
                    user.Email, existingSpacesCount);
                continue;
            }

            var spacesToCreate = 64 - existingSpacesCount;
            await CreateSpacesForProfile(profile.Id, spacesToCreate);

            logger.LogInformation(
                "Created {Count} spaces for user {Email}",
                spacesToCreate, user.Email);
        }
    }

    private async Task CreateSpacesForProfile(string profileId, int count) {
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

        for (var i = 0; i < count; i++) {
            var spaceType = spaceTypes[random.Next(spaceTypes.Length)];
            var city = cities[random.Next(cities.Length)];

            var latOffset = (random.NextDouble() - 0.5) * 0.1;
            var lonOffset = (random.NextDouble() - 0.5) * 0.1;

            var space = new Space {
                Title = GenerateSpaceTitle(spaceType, i),
                Description = GenerateSpaceDescription(spaceType),
                Type = spaceType,
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
                OwnerProfile = await dbContext.Profiles.FindAsync(profileId) ??
                               throw new InvalidOperationException(
                                   "Profile not found")
            };

            dbContext.Spaces.Add(space);
        }

        await dbContext.SaveChangesAsync();
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