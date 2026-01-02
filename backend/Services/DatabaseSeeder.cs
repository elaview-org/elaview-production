using ElaviewBackend.Data;
using ElaviewBackend.Data.Entities;
using ElaviewBackend.Settings;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;

namespace ElaviewBackend.Services;

public class DatabaseSeeder(
    AppDbContext dbContext,
    IOptions<GlobalSettings> settings,
    ILogger<DatabaseSeeder> logger) {
    public async Task SeedDevelopmentAccountsAsync() {
        var developmentAccounts = settings.Value.DevelopmentAccounts;

        if (developmentAccounts == null || developmentAccounts.Count == 0) {
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
    }
}