using ElaviewBackend.Data.Entities;
using Microsoft.EntityFrameworkCore;

namespace ElaviewBackend.Data.Seeding.Seeders;

public sealed class AdminSeeder(AppDbContext context) : ISeeder {
    public int Order {
        get { return 1; }
    }

    public string Name {
        get { return "001_AdminSeeder"; }
    }

    public bool RunInProduction {
        get { return true; }
    }

    public async Task SeedAsync(CancellationToken ct) {
        if (await context.Users.AnyAsync(u => u.Role == UserRole.Admin, ct))
            return;

        var adminPassword = Environment.GetEnvironmentVariable("ELAVIEW_ADMIN_PASSWORD")
            ?? throw new InvalidOperationException("ELAVIEW_ADMIN_PASSWORD environment variable not set");

        context.Users.Add(new User {
            Email = "admin@elaview.com",
            Password = BCrypt.Net.BCrypt.HashPassword(adminPassword),
            Name = "System Admin",
            Role = UserRole.Admin,
            Status = UserStatus.Active
        });

        await context.SaveChangesAsync(ct);
    }
}