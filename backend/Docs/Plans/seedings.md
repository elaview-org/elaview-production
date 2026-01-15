# Database Seeding Specification

Complete specification for Elaview backend database seeding using custom seeder pattern with Bogus for fake data generation.

---

## Architecture Overview

### Seeding Philosophy

**Custom Seeder Pattern over EF Core HasData**: EF Core's `HasData()` is limited to static reference data and captures data in migration snapshots (leading to huge files). Custom seeders offer environment-specific execution, individual tracking, and support for dynamic/generated data.

**EF Core 9+ UseSeeding Alternative**: While EF Core 9+ introduced `UseSeeding`/`UseAsyncSeeding`, the custom `ISeeder` pattern provides finer control: per-seeder history tracking, dev-only seeders, and clear separation between production bootstrap data and development fake data.

**Bogus for Realistic Data**: Development environments use Bogus to generate realistic fake data. Deterministic seeds ensure reproducible datasets across team members.

### Seeding Categories

| Category | Environment | Tracking | Examples |
|----------|-------------|----------|----------|
| Bootstrap | Production + Development | `__SeedHistory` table | Admin users, space categories, system config |
| Reference | Production + Development | `__SeedHistory` table | Lookup tables, enum mappings |
| Development | Development only | `__SeedHistory` table | Fake users, spaces, bookings via Bogus |
| Migration | Production + Development | `__SeedHistory` table | Data fixes, backfills after schema changes |

### Directory Structure

```
Data/
├── Seeding/
│   ├── ISeeder.cs               # Interface
│   ├── DatabaseSeeder.cs        # Orchestrator
│   ├── SeedHistory.cs           # Tracking entity
│   ├── Seeders/
│   │   ├── 001_AdminSeeder.cs
│   │   ├── 002_SpaceCategoriesSeeder.cs
│   │   ├── 003_NotificationTypesSeeder.cs
│   │   └── 100_DevelopmentDataSeeder.cs
│   └── Generators/
│       ├── UserGenerator.cs
│       ├── SpaceGenerator.cs
│       ├── CampaignGenerator.cs
│       └── BookingGenerator.cs
└── AppDbContext.cs
```

---

## Core Components

### ISeeder Interface

```csharp
public interface ISeeder {
    int Order { get; }
    string Name { get; }
    bool RunInProduction { get; }
    Task SeedAsync(CancellationToken ct);
}
```

| Property | Purpose |
|----------|---------|
| Order | Execution order (gaps recommended: 1, 2, 3... 100, 101) |
| Name | Unique identifier stored in `__SeedHistory` |
| RunInProduction | `false` for dev-only seeders |

### SeedHistory Entity

```csharp
[Table("__SeedHistory")]
public sealed class SeedHistory {
    [Key]
    [MaxLength(256)]
    public required string SeederName { get; init; }
    public DateTime AppliedAt { get; init; }
}
```

### DatabaseSeeder Orchestrator

```csharp
public sealed class DatabaseSeeder(
    AppDbContext context,
    IEnumerable<ISeeder> seeders,
    IWebHostEnvironment env,
    ILogger<DatabaseSeeder> logger
) {
    public async Task SeedAsync(CancellationToken ct = default) {
        await EnsureSeedHistoryTableAsync(ct);

        var appliedSeeders = await context.Set<SeedHistory>()
            .Select(h => h.SeederName)
            .ToHashSetAsync(ct);

        var pendingSeeders = seeders
            .Where(s => !appliedSeeders.Contains(s.Name))
            .Where(s => env.IsDevelopment() || s.RunInProduction)
            .OrderBy(s => s.Order);

        foreach (var seeder in pendingSeeders) {
            logger.LogInformation("Running seeder: {Name}", seeder.Name);

            await using var transaction = await context.Database.BeginTransactionAsync(ct);
            try {
                await seeder.SeedAsync(ct);
                context.Set<SeedHistory>().Add(new SeedHistory {
                    SeederName = seeder.Name,
                    AppliedAt = DateTime.UtcNow
                });
                await context.SaveChangesAsync(ct);
                await transaction.CommitAsync(ct);
            }
            catch {
                await transaction.RollbackAsync(ct);
                throw;
            }
        }
    }

    private async Task EnsureSeedHistoryTableAsync(CancellationToken ct) {
        await context.Database.ExecuteSqlRawAsync("""
            CREATE TABLE IF NOT EXISTS "__SeedHistory" (
                "SeederName" VARCHAR(256) PRIMARY KEY,
                "AppliedAt" TIMESTAMP WITH TIME ZONE NOT NULL
            )
            """, ct);
    }
}
```

---

## Production Seeders

### 001_AdminSeeder

```csharp
public sealed class AdminSeeder(AppDbContext context) : ISeeder {
    public int Order => 1;
    public string Name => "001_AdminSeeder";
    public bool RunInProduction => true;

    public async Task SeedAsync(CancellationToken ct) {
        if (await context.Users.AnyAsync(u => u.Role == UserRole.Admin, ct))
            return;

        var adminPassword = Environment.GetEnvironmentVariable("ELAVIEW_ADMIN_PASSWORD")
            ?? throw new InvalidOperationException("ELAVIEW_ADMIN_PASSWORD not set");

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
```

### 002_SpaceCategoriesSeeder

```csharp
public sealed class SpaceCategoriesSeeder(AppDbContext context) : ISeeder {
    public int Order => 2;
    public string Name => "002_SpaceCategoriesSeeder";
    public bool RunInProduction => true;

    public async Task SeedAsync(CancellationToken ct) {
        if (await context.SpaceCategories.AnyAsync(ct))
            return;

        context.SpaceCategories.AddRange([
            new SpaceCategory { Name = "Storefront", Slug = "storefront" },
            new SpaceCategory { Name = "Billboard", Slug = "billboard" },
            new SpaceCategory { Name = "Vehicle", Slug = "vehicle" },
            new SpaceCategory { Name = "Event Space", Slug = "event-space" },
            new SpaceCategory { Name = "Digital Display", Slug = "digital-display" }
        ]);

        await context.SaveChangesAsync(ct);
    }
}
```

### 003_NotificationTypesSeeder

```csharp
public sealed class NotificationTypesSeeder(AppDbContext context) : ISeeder {
    public int Order => 3;
    public string Name => "003_NotificationTypesSeeder";
    public bool RunInProduction => true;

    public async Task SeedAsync(CancellationToken ct) {
        var existingTypes = await context.NotificationTypes.Select(t => t.Code).ToListAsync(ct);
        var allTypes = Enum.GetValues<NotificationType>();

        var missingTypes = allTypes
            .Where(t => !existingTypes.Contains(t.ToString()))
            .Select(t => new NotificationTypeEntity {
                Code = t.ToString(),
                Name = t.ToString().Replace("_", " "),
                DefaultEmailEnabled = t is NotificationType.PaymentReceived or NotificationType.DisputeFiled,
                DefaultPushEnabled = true,
                DefaultInAppEnabled = true
            });

        context.NotificationTypes.AddRange(missingTypes);
        await context.SaveChangesAsync(ct);
    }
}
```

---

## Bogus Generators

### Generator Base Pattern

```csharp
public sealed class UserGenerator {
    private readonly Faker<User> _faker;

    public UserGenerator(int? seed = null) {
        if (seed.HasValue)
            Randomizer.Seed = new Random(seed.Value);

        _faker = new Faker<User>()
            .RuleFor(u => u.Id, f => Guid.NewGuid())
            .RuleFor(u => u.Email, f => f.Internet.Email())
            .RuleFor(u => u.Password, _ => BCrypt.Net.BCrypt.HashPassword("Test123!"))
            .RuleFor(u => u.Name, f => f.Name.FullName())
            .RuleFor(u => u.Phone, f => f.Phone.PhoneNumber("###-###-####"))
            .RuleFor(u => u.Role, _ => UserRole.User)
            .RuleFor(u => u.Status, _ => UserStatus.Active)
            .RuleFor(u => u.CreatedAt, f => f.Date.Past(1).ToUniversalTime());
    }

    public User Generate() => _faker.Generate();
    public List<User> Generate(int count) => _faker.Generate(count);

    public User WithRole(UserRole role) {
        var user = Generate();
        user.Role = role;
        return user;
    }
}
```

### SpaceGenerator

```csharp
public sealed class SpaceGenerator {
    private readonly Faker<Space> _faker;

    public SpaceGenerator(int? seed = null) {
        if (seed.HasValue)
            Randomizer.Seed = new Random(seed.Value);

        _faker = new Faker<Space>()
            .RuleFor(s => s.Id, f => Guid.NewGuid())
            .RuleFor(s => s.Title, f => $"{f.Commerce.ProductAdjective()} {f.Address.StreetSuffix()} Ad Space")
            .RuleFor(s => s.Description, f => f.Lorem.Paragraph())
            .RuleFor(s => s.Type, f => f.PickRandom<SpaceType>())
            .RuleFor(s => s.Status, _ => SpaceStatus.Active)
            .RuleFor(s => s.Address, f => f.Address.StreetAddress())
            .RuleFor(s => s.City, f => f.Address.City())
            .RuleFor(s => s.State, f => f.Address.StateAbbr())
            .RuleFor(s => s.ZipCode, f => f.Address.ZipCode())
            .RuleFor(s => s.Latitude, f => f.Address.Latitude(-90, 90))
            .RuleFor(s => s.Longitude, f => f.Address.Longitude(-180, 180))
            .RuleFor(s => s.PricePerDay, f => f.Finance.Amount(25, 200))
            .RuleFor(s => s.InstallationFee, f => f.Finance.Amount(15, 50))
            .RuleFor(s => s.MinDuration, f => f.PickRandom(7, 14, 30))
            .RuleFor(s => s.CreatedAt, f => f.Date.Past(1).ToUniversalTime());
    }

    public Space Generate() => _faker.Generate();
    public List<Space> Generate(int count) => _faker.Generate(count);

    public Space ForOwner(Guid ownerProfileId) {
        var space = Generate();
        space.SpaceOwnerProfileId = ownerProfileId;
        return space;
    }
}
```

### BookingGenerator

```csharp
public sealed class BookingGenerator {
    private readonly Faker _faker;

    public BookingGenerator(int? seed = null) {
        _faker = seed.HasValue ? new Faker { Random = new Randomizer(seed.Value) } : new Faker();
    }

    public Booking Generate(Guid campaignId, Space space, BookingStatus? status = null) {
        var startDate = _faker.Date.Future(1).ToUniversalTime();
        var endDate = startDate.AddDays(_faker.Random.Int(7, 30));
        var totalDays = (endDate - startDate).Days;
        var subtotal = space.PricePerDay * totalDays;
        var platformFee = subtotal * 0.10m;

        return new Booking {
            Id = Guid.NewGuid(),
            CampaignId = campaignId,
            SpaceId = space.Id,
            Status = status ?? _faker.PickRandom<BookingStatus>(),
            StartDate = startDate,
            EndDate = endDate,
            TotalDays = totalDays,
            PricePerDay = space.PricePerDay,
            SubtotalAmount = subtotal,
            InstallationFee = space.InstallationFee,
            PlatformFeePercent = 0.10m,
            PlatformFeeAmount = platformFee,
            TotalAmount = subtotal + space.InstallationFee + platformFee,
            OwnerPayoutAmount = subtotal + space.InstallationFee,
            CreatedAt = _faker.Date.Past(1).ToUniversalTime()
        };
    }

    public List<Booking> Generate(int count, List<Campaign> campaigns, List<Space> spaces) {
        return Enumerable.Range(0, count)
            .Select(_ => Generate(
                _faker.PickRandom(campaigns).Id,
                _faker.PickRandom(spaces)))
            .ToList();
    }
}
```

---

## Development Seeder

### 100_DevelopmentDataSeeder

```csharp
public sealed class DevelopmentDataSeeder(AppDbContext context) : ISeeder {
    public int Order => 100;
    public string Name => "100_DevelopmentDataSeeder";
    public bool RunInProduction => false;

    private const int Seed = 8675309;

    public async Task SeedAsync(CancellationToken ct) {
        var userGen = new UserGenerator(Seed);
        var spaceGen = new SpaceGenerator(Seed);
        var campaignGen = new CampaignGenerator(Seed);
        var bookingGen = new BookingGenerator(Seed);

        var users = userGen.Generate(20);
        context.Users.AddRange(users);
        await context.SaveChangesAsync(ct);

        var spaceOwnerUsers = users.Take(10).ToList();
        var advertiserUsers = users.Skip(10).ToList();

        var spaceOwnerProfiles = spaceOwnerUsers.Select(u => {
            u.ActiveProfileType = ProfileType.SpaceOwner;
            return new SpaceOwnerProfile {
                UserId = u.Id,
                BusinessName = new Faker().Company.CompanyName(),
                BusinessAddress = new Faker().Address.FullAddress()
            };
        }).ToList();
        context.SpaceOwnerProfiles.AddRange(spaceOwnerProfiles);

        var advertiserProfiles = advertiserUsers.Select(u => {
            u.ActiveProfileType = ProfileType.Advertiser;
            return new AdvertiserProfile {
                UserId = u.Id,
                CompanyName = new Faker().Company.CompanyName(),
                Industry = new Faker().Commerce.Department()
            };
        }).ToList();
        context.AdvertiserProfiles.AddRange(advertiserProfiles);
        await context.SaveChangesAsync(ct);

        var spaces = spaceOwnerProfiles
            .SelectMany(p => Enumerable.Range(0, 3).Select(_ => spaceGen.ForOwner(p.Id)))
            .ToList();
        context.Spaces.AddRange(spaces);
        await context.SaveChangesAsync(ct);

        var campaigns = advertiserProfiles
            .SelectMany(p => campaignGen.ForAdvertiser(p.Id, 2))
            .ToList();
        context.Campaigns.AddRange(campaigns);
        await context.SaveChangesAsync(ct);

        var bookings = bookingGen.Generate(50, campaigns, spaces);
        context.Bookings.AddRange(bookings);
        await context.SaveChangesAsync(ct);
    }
}
```

---

## Migration Seeders

### Data Fix Pattern

When schema changes require data updates, create a numbered migration seeder:

```csharp
public sealed class BackfillSpaceRatingsSeeder(AppDbContext context) : ISeeder {
    public int Order => 101;
    public string Name => "101_BackfillSpaceRatingsSeeder";
    public bool RunInProduction => true;

    public async Task SeedAsync(CancellationToken ct) {
        await context.Spaces
            .Where(s => s.AverageRating == null)
            .ExecuteUpdateAsync(s => s.SetProperty(x => x.AverageRating, 0.0), ct);
    }
}
```

### Migration Seeder Use Cases

| Scenario | Example |
|----------|---------|
| New required column with default | Backfill existing rows with calculated value |
| Enum value additions | Seed new notification types, space categories |
| Data normalization | Split full names into first/last |
| Soft delete cleanup | Mark orphaned records as deleted |

---

## DI Registration

### Services.cs

```csharp
builder.Services.AddScoped<DatabaseSeeder>();
builder.Services.AddScoped<ISeeder, AdminSeeder>();
builder.Services.AddScoped<ISeeder, SpaceCategoriesSeeder>();
builder.Services.AddScoped<ISeeder, NotificationTypesSeeder>();
builder.Services.AddScoped<ISeeder, DevelopmentDataSeeder>();
```

### Startup Integration

```csharp
public static async Task ConfigureAsync(this WebApplication app) {
    using var scope = app.Services.CreateScope();
    var seeder = scope.ServiceProvider.GetRequiredService<DatabaseSeeder>();
    await seeder.SeedAsync();
}
```

---

## Sharing with Tests

### Factory Location

Generators in `Data/Seeding/Generators/` are referenced by test factories:

```csharp
namespace ElaviewBackend.Tests.Shared.Factories;

public static class UserFactory {
    private static readonly UserGenerator Generator = new();

    public static User Create(Action<User>? customize = null) {
        var user = Generator.Generate();
        customize?.Invoke(user);
        return user;
    }

    public static List<User> CreateMany(int count, Action<User, int>? customize = null) {
        return Generator.Generate(count)
            .Select((u, i) => { customize?.Invoke(u, i); return u; })
            .ToList();
    }
}
```

### Deterministic vs Random

| Context | Seed | Rationale |
|---------|------|-----------|
| Development seeder | Fixed (8675309) | Same data across team, reproducible debugging |
| Test factories | None (random) | Unique data per test prevents false positives |
| Snapshot tests | Fixed | Deterministic output comparison |

---

## Commands

```bash
ev backend:start

psql -c "SELECT * FROM \"__SeedHistory\" ORDER BY \"AppliedAt\""

DELETE FROM "__SeedHistory" WHERE "SeederName" = '100_DevelopmentDataSeeder';
dotnet run

DELETE FROM "__SeedHistory";
dotnet run
```

---

## EF Core 9+ Alternative

For simpler projects, EF Core's built-in seeding may suffice:

```csharp
optionsBuilder
    .UseNpgsql(connectionString)
    .UseSeeding((context, _) => {
        if (!context.Set<User>().Any(u => u.Role == UserRole.Admin)) {
            context.Set<User>().Add(new User { /* admin */ });
            context.SaveChanges();
        }
    })
    .UseAsyncSeeding(async (context, _, ct) => {
        if (!await context.Set<User>().AnyAsync(u => u.Role == UserRole.Admin, ct)) {
            context.Set<User>().Add(new User { /* admin */ });
            await context.SaveChangesAsync(ct);
        }
    });
```

**Limitations**: No per-seeder tracking, no environment differentiation, no migration-aware data fixes.

---

## Best Practices

| Practice | Rationale |
|----------|-----------|
| Production seeders must be idempotent | Safe re-run if history lost |
| Environment variables for secrets | Never hardcode passwords |
| Order numbers with gaps (1, 2, 3... 100, 101) | Room for insertion |
| Fixed seeds for development data | Reproducible across team |
| Random seeds for tests | Avoid false positives |
| Transactions per seeder | Atomic execution, clean rollback |
| UTC for all DateTime values | PostgreSQL timestamptz requirement |
| Separate generators from seeders | Reusable for tests and seeders |

---

**Last Updated**: 2026-01-15

Sources:
- [EF Core Data Seeding](https://learn.microsoft.com/en-us/ef/core/modeling/data-seeding)
- [Bogus GitHub Repository](https://github.com/bchavez/Bogus)
- [EF Core Data Seeding with Bogus](https://learn.microsoft.com/en-us/shows/on-dotnet/on-dotnet-live-next-level-ef-core-data-seeding-with-bogus)