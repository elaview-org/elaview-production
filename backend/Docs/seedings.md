# Database Seeding

Migration-aware seeding system with tracking. Seeders run once and are recorded in `__SeedHistory`.

## How It Works

On app startup, `DatabaseSeeder` runs pending seeders in order:

1. Creates `__SeedHistory` table if missing
2. Queries which seeders have already run
3. Filters by environment (`RunInProduction` flag)
4. Runs pending seeders in `Order` sequence, each in a transaction
5. Records seeder name + timestamp after success

## Running Seeders

Seeders run automatically on startup:

```bash
ev backend:start
```

Check what has run:

```bash
psql -c 'SELECT * FROM "__SeedHistory" ORDER BY "AppliedAt"'
```

Re-run a specific seeder:

```bash
psql -c "DELETE FROM \"__SeedHistory\" WHERE \"SeederName\" = '100_DevelopmentDataSeeder'"
ev backend:start
```

## Creating a New Seeder

1. Create file in `Data/Seeding/Seeders/` with numbered prefix
2. Implement `ISeeder` interface

```csharp
public sealed class 002_SpaceCategoriesSeeder(AppDbContext context) : ISeeder {
    public int Order => 2;
    public string Name => "002_SpaceCategoriesSeeder";
    public bool RunInProduction => true;

    public async Task SeedAsync(CancellationToken ct) {
        // Your seeding logic
        await context.SaveChangesAsync(ct);
    }
}
```

3. Register in `Bootstrap/Services.cs`:

```csharp
.AddScoped<ISeeder, SpaceCategoriesSeeder>()
```

## Conventions

### Numbering

| Range | Purpose | RunInProduction |
|-------|---------|-----------------|
| 001-099 | Production bootstrap (admin, reference data) | `true` |
| 100-199 | Development fake data (Bogus) | `false` |
| 200+ | Migration data fixes | `true` |

Use gaps (001, 002, 005...) to allow insertion without renumbering.

### Naming

- File: `{Order}_{PascalCaseName}Seeder.cs`
- Name property: `"{Order}_{PascalCaseName}Seeder"`

### Idempotency

Production seeders should be idempotent (safe to re-run if `__SeedHistory` is cleared):

```csharp
public async Task SeedAsync(CancellationToken ct) {
    if (await context.Users.AnyAsync(u => u.Role == UserRole.Admin, ct))
        return;

    // Create admin...
}
```

## Structure

```
Data/Seeding/
├── ISeeder.cs                    # Interface
├── SeedHistory.cs                # Tracking entity (raw SQL, not in EF model)
├── DatabaseSeeder.cs             # Orchestrator
├── Seeders/
│   ├── 001_AdminSeeder.cs            # Production: creates admin user
│   ├── 100_DevelopmentDataSeeder.cs  # Dev only: fake data via Bogus
│   └── 101_LegacyDevAccountsSeeder.cs # Dev only: legacy dev accounts + spaces
└── Generators/
    ├── UserGenerator.cs          # Bogus generators for dev seeder
    ├── SpaceGenerator.cs
    ├── CampaignGenerator.cs
    └── BookingGenerator.cs
```

## Generators

Generators use Bogus for realistic fake data. Use a fixed seed for reproducibility:

```csharp
public sealed class UserGenerator(int? seed = null) {
    private readonly Faker<User> _faker;

    public UserGenerator() {
        if (seed.HasValue)
            Randomizer.Seed = new Random(seed.Value);

        _faker = new Faker<User>()
            .RuleFor(u => u.Email, f => f.Internet.Email())
            .RuleFor(u => u.Name, f => f.Name.FullName());
    }

    public User Generate() => _faker.Generate();
    public List<User> Generate(int count) => _faker.Generate(count);
}
```

## Current Seeders

| Seeder | Env | Creates |
|--------|-----|---------|
| `001_AdminSeeder` | All | 1 admin user (requires `ELAVIEW_ADMIN_PASSWORD` env var) |
| `100_DevelopmentDataSeeder` | Dev | 20 users, 10 space owners, 10 advertisers, 30 spaces, 20 campaigns, 50 bookings |
| `101_LegacyDevAccountsSeeder` | Dev | 4 dev accounts (admin, marketing, user1, user2) + 64 spaces per user |