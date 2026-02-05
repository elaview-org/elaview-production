using dotenv.net;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

namespace ElaviewBackend.Data;

public sealed class DesignTimeDbContextFactory : IDesignTimeDbContextFactory<AppDbContext> {
    public AppDbContext CreateDbContext(string[] args) {
        DotEnv.Load();
        var envVars = Environment.GetEnvironmentVariables();

        var host = envVars["ELAVIEW_BACKEND_DATABASE_HOST"]?.ToString() ?? "localhost";
        var port = envVars["ELAVIEW_BACKEND_DATABASE_PORT"]?.ToString() ?? "5432";
        var user = envVars["ELAVIEW_BACKEND_DATABASE_USER"]?.ToString() ?? "postgres";
        var password = envVars["ELAVIEW_BACKEND_DATABASE_PASSWORD"]?.ToString() ?? "postgres";
        var database = "elaview_dev";

        var connectionString = $"Host={host};Port={port};Database={database};Username={user};Password={password}";

        var optionsBuilder = new DbContextOptionsBuilder<AppDbContext>();
        optionsBuilder.UseNpgsql(connectionString);

        return new AppDbContext(optionsBuilder.Options);
    }
}
