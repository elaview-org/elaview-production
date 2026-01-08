using HotChocolate.Execution;
using Path = System.IO.Path;

namespace ElaviewBackend.Bootstrap;

public static class Startup {
    public static async Task RunElaviewAsync(this WebApplication app,
        string[] args) {
        var envVars = Environment.GetEnvironmentVariables();
        var serverPort = envVars["SERVER_PORT"]!.ToString();
        var logger = app.Services.GetRequiredService<ILogger<Program>>();

        app.Services.GetRequiredService<IHostApplicationLifetime>()
            .ApplicationStarted.Register(() => {
                var protocol =
                    app.Environment.IsDevelopment() ? "http" : "https";
                logger.LogInformation(
                    "{Protocol}://localhost:{ServerPort}", protocol, serverPort
                );
                logger.LogInformation(
                    "{Protocol}://localhost:{ServerPort}/api/graphql", protocol,
                    serverPort
                );
            });

        if (app.Environment.IsDevelopment()) {
            await Task.Run(async () => {
                var sharedDir = Path.Combine(
                    Directory.GetCurrentDirectory(), "Shared"
                );
                Directory.CreateDirectory(sharedDir);

                var executorResolver = await app.Services
                    .GetRequiredService<IRequestExecutorResolver>()
                    .GetRequestExecutorAsync();
                await File.WriteAllTextAsync(
                    Path.Combine(sharedDir, "schema.graphql"),
                    executorResolver.Schema.Print()
                );

                logger.LogInformation(
                    "Schema downloaded and is stored at Shared/schema.graphql"
                );
            });
        }

        app.RunWithGraphQLCommands(args);
    }
}