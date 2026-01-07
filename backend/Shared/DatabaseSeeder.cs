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
                "No development accounts configured in secrets.json");
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
                userRole = UserRole.Advertiser;
                logger.LogWarning(
                    "Invalid role '{Role}' for {Email}, defaulting to Advertiser",
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

            logger.LogInformation(
                "Created development account: {Email} with role {Role}",
                account.Email, userRole);
        }

        await SeedSpacesAsync();
    }

    async Task SeedSpacesAsync() {
        var spaceOwner = await dbContext.Users
            .FirstOrDefaultAsync(u => u.Email == "spaceowner@email.com");

        if (spaceOwner == null) {
            logger.LogWarning(
                "SpaceOwner account not found, skipping space seeding");
            return;
        }

        var existingSpacesCount = await dbContext.Spaces
            .CountAsync(s => s.OwnerId == spaceOwner.Id);

        if (existingSpacesCount >= 128) {
            logger.LogInformation(
                "SpaceOwner already has {Count} spaces, skipping seeding",
                existingSpacesCount);
            return;
        }

        var random = new Random(42);
        var cities = new[] {
            "New York", "Los Angeles", "Chicago", "Houston", "Phoenix",
            "Philadelphia", "San Antonio", "San Diego"
        };
        var states = new[] { "NY", "CA", "IL", "TX", "AZ", "PA" };
        var streetNames = new[] {
            "Main St", "Oak Ave", "Broadway", "Market St", "Park Ave", "1st St",
            "2nd Ave", "Elm St"
        };
        var spaceTypes = Enum.GetValues<SpaceType>();

        var spaces = new List<Space>();

        for (int i = 0; i < 128; i++) {
            var city = cities[random.Next(cities.Length)];
            var state = states[random.Next(states.Length)];
            var streetNumber = random.Next(100, 9999);
            var streetName = streetNames[random.Next(streetNames.Length)];

            var space = new Space {
                Id = Guid.NewGuid().ToString(),
                OwnerId = spaceOwner.Id,
                Title = $"{spaceTypes[i % spaceTypes.Length]} Space #{i + 1}",
                Description = $"Premium advertising space in {city}",
                Type = spaceTypes[i % spaceTypes.Length],
                Status = SpaceStatus.Active,
                Address = $"{streetNumber} {streetName}",
                City = city,
                State = state,
                ZipCode = $"{random.Next(10000, 99999)}",
                Latitude = 40.7128 + (random.NextDouble() - 0.5) * 10,
                Longitude = -74.0060 + (random.NextDouble() - 0.5) * 10,
                Width = random.Next(10, 100),
                Height = random.Next(10, 50),
                PricePerDay = random.Next(50, 500),
                InstallationFee = random.Next(10, 100),
                MinDuration = random.Next(1, 7),
                MaxDuration = random.Next(30, 365),
                Images = new List<string>(),
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            spaces.Add(space);
        }

        dbContext.Spaces.AddRange(spaces);
        await dbContext.SaveChangesAsync();

        logger.LogInformation("Created 128 spaces for SpaceOwner account");
    }
}