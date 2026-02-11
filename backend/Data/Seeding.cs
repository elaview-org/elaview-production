using ElaviewBackend.Data.Entities;
using Microsoft.EntityFrameworkCore;

namespace ElaviewBackend.Data;

public static class Seeding {
    private static readonly (string Email, string PasswordPrefix, string Name, UserRole Role)[] Accounts = [
        ("admin@elaview.com", "admin", "Administrator", UserRole.Admin),
        ("marketing@elaview.com", "marketing", "Marketing", UserRole.Marketing),
        ("user1@elaview.com", "user1", "User1", UserRole.User),
        ("user2@elaview.com", "user2", "User2", UserRole.User)
    ];

    public static async Task SeedAsync(AppDbContext context, CancellationToken ct) {
        var adminPassword = Environment.GetEnvironmentVariable("ELAVIEW_BACKEND_ADMIN_PASSWORD")
            ?? throw new InvalidOperationException("ELAVIEW_BACKEND_ADMIN_PASSWORD environment variable is not set");

        foreach (var account in Accounts) {
            if (await context.Users.AnyAsync(u => u.Email == account.Email, ct))
                continue;

            context.Users.Add(new User {
                Email = account.Email,
                Password = BCrypt.Net.BCrypt.HashPassword(account.PasswordPrefix + adminPassword),
                Name = account.Name,
                Role = account.Role,
                Status = UserStatus.Active
            });

            await context.SaveChangesAsync(ct);
        }
    }
}
