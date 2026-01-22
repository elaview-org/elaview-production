using Microsoft.EntityFrameworkCore;

namespace ElaviewBackend.Data.Seeding;

public sealed class DatabaseSeeder(
    AppDbContext context,
    IEnumerable<ISeeder> seeders,
    IWebHostEnvironment env,
    ILogger<DatabaseSeeder> logger
) {
    public async Task SeedAsync(CancellationToken ct = default) {
        await EnsureSeedHistoryTableAsync(ct);

        var appliedSeeders = await GetAppliedSeedersAsync(ct);

        var pendingSeeders = seeders
            .Where(s => !appliedSeeders.Contains(s.Name))
            .Where(s => env.IsDevelopment() || s.RunInProduction)
            .OrderBy(s => s.Order);

        var strategy = context.Database.CreateExecutionStrategy();

        foreach (var seeder in pendingSeeders) {
            logger.LogInformation("Running seeder: {Name}", seeder.Name);

            await strategy.ExecuteAsync(async () => {
                await using var transaction = await context.Database.BeginTransactionAsync(ct);
                try {
                    await seeder.SeedAsync(ct);
                    await RecordSeederAsync(seeder.Name, ct);
                    await transaction.CommitAsync(ct);
                    logger.LogInformation("Seeder completed: {Name}", seeder.Name);
                }
                catch (Exception ex) {
                    logger.LogError(ex, "Seeder failed: {Name}", seeder.Name);
                    await transaction.RollbackAsync(ct);
                    throw;
                }
            });
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

    private async Task<HashSet<string>> GetAppliedSeedersAsync(CancellationToken ct) {
        var connection = context.Database.GetDbConnection();
        await connection.OpenAsync(ct);

        await using var command = connection.CreateCommand();
        command.CommandText = """SELECT "SeederName" FROM "__SeedHistory" """;

        var result = new HashSet<string>();
        await using var reader = await command.ExecuteReaderAsync(ct);
        while (await reader.ReadAsync(ct))
            result.Add(reader.GetString(0));

        return result;
    }

    private async Task RecordSeederAsync(string seederName, CancellationToken ct) {
        await context.Database.ExecuteSqlRawAsync(
            """INSERT INTO "__SeedHistory" ("SeederName", "AppliedAt") VALUES ({0}, {1})""",
            seederName,
            DateTime.UtcNow);
    }
}