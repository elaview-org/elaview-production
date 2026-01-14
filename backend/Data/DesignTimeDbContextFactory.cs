namespace ElaviewBackend.Data;

// public class DesignTimeDbContextFactory {
//     public AppDbContext CreateDbContext(string[] args)
//     {
//         var configuration = new ConfigurationBuilder()
//             .SetBasePath(Directory.GetCurrentDirectory())
//             .AddJsonFile("appsettings.json")
//             .AddJsonFile("appsettings.Development.json", true)
//             .Build();
//
//         var builder = new DbContextOptionsBuilder<AppDbContext>();
//         var connectionString = configuration.GetConnectionString("Default");
//
//         builder.UseNpgsql()
//
//         return new AppDbContext(builder.Options);
//     }
// }