using HotChocolate.Execution;
using Path = System.IO.Path;

namespace ElaviewBackend.Bootstrap;

public static class Startup {
    public static async Task RunElaviewAsync(this WebApplication app,
        string[] args) {
        var envVars = Environment.GetEnvironmentVariables();
        var serverPort = envVars["ELAVIEW_BACKEND_SERVER_PORT"]?.ToString();
        if (string.IsNullOrEmpty(serverPort))
            serverPort = envVars["PORT"]?.ToString() ?? "8080";
        var logger = app.Services.GetRequiredService<ILogger<Program>>();

        var hasTls = !string.IsNullOrEmpty(
            envVars["ELAVIEW_BACKEND_SERVER_TLS_CERT_PATH"]?.ToString());
        app.Services.GetRequiredService<IHostApplicationLifetime>()
            .ApplicationStarted.Register(() => {
                var protocol = hasTls ? "https" : "http";
                logger.LogInformation(
                    "{Protocol}://localhost:{ServerPort}", protocol, serverPort
                );
                logger.LogInformation(
                    "{Protocol}://localhost:{ServerPort}/api/graphql", protocol,
                    serverPort
                );
            });

        if (app.Environment.IsDevelopment())
            await Task.Run(async () => {
                var dataDir = Path.Combine(
                    Directory.GetCurrentDirectory(), "Data"
                );
                Directory.CreateDirectory(dataDir);

                var executorResolver = await app.Services
                    .GetRequiredService<IRequestExecutorResolver>()
                    .GetRequestExecutorAsync();
                await File.WriteAllTextAsync(
                    Path.Combine(dataDir, "schema.graphql"),
                    executorResolver.Schema.Print()
                );

                logger.LogInformation(
                    "Schema downloaded and is stored at Data/schema.graphql"
                );
            });

        app.RunWithGraphQLCommands(args);
    }
}