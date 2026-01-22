namespace ElaviewBackend.Data.Seeding;

public interface ISeeder {
    int Order { get; }
    string Name { get; }
    bool RunInProduction { get; }
    Task SeedAsync(CancellationToken ct);
}