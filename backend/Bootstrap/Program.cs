namespace ElaviewBackend.Bootstrap;

public sealed class Program {
    public static async Task Main(string[] args) {
        var builder = WebApplication.CreateBuilder(args);
        builder.Configure();
        builder.AddServices();

        var app = builder.Build();
        await app.ConfigureAsync();
        await app.RunElaviewAsync(args);
    }
}