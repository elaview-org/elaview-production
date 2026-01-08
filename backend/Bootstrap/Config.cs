using dotenv.net;
using ElaviewBackend.Shared;
using Microsoft.AspNetCore.Server.Kestrel.Core;

namespace ElaviewBackend.Bootstrap;

public static class Config {
    public static void Configure(this WebApplicationBuilder builder) {
        DotEnv.Load();
        var envVars = Environment.GetEnvironmentVariables();
        var configData = new Dictionary<string, string?> {
            ["Database:Host"] = envVars["DATABASE_HOST"]?.ToString(),
            ["Database:Port"] = envVars["DATABASE_PORT"]?.ToString(),
            ["Database:User"] = envVars["DATABASE_USER"]?.ToString(),
            ["Database:Password"] = envVars["DATABASE_PASSWORD"]?.ToString()
        };

        var i = 0;
        var emailKey = $"ACCOUNT_{i}_EMAIL";
        while (envVars[emailKey] != null) {
            configData[$"DevelopmentAccounts:{i}:Email"] =
                envVars[emailKey]?.ToString();
            configData[$"DevelopmentAccounts:{i}:Password"] =
                envVars[$"ACCOUNT_{i}_PASSWORD"]?.ToString();
            configData[$"DevelopmentAccounts:{i}:Name"] =
                envVars[$"ACCOUNT_{i}_NAME"]?.ToString();
            configData[$"DevelopmentAccounts:{i}:Role"] =
                envVars[$"ACCOUNT_{i}_ROLE"]?.ToString();
            ++i;
            emailKey = $"ACCOUNT_{i}_EMAIL";
        }

        builder.Configuration.AddInMemoryCollection(configData);

        var certPath = envVars["SERVER_TLS_CERT_PATH"]?.ToString();
        var certPassword = envVars["SERVER_TLS_CERT_PASSWORD"]?.ToString();

        if (builder.Environment.IsDevelopment()) {
            builder.WebHost.ConfigureKestrel((_, serverOptions) => {
                serverOptions.ListenAnyIP(
                    int.Parse(envVars["SERVER_PORT"]!.ToString()!),
                    listenOptions => {
                        listenOptions.Protocols = HttpProtocols.Http1AndHttp2;
                    });
            });
        }
        else {
            if (string.IsNullOrEmpty(certPath))
                throw new InvalidOperationException(
                    "SERVER_TLS_CERT_PATH is required");

            builder.WebHost
                .UseQuic(options => {
#pragma warning disable CA2252
                    options.MaxBidirectionalStreamCount = 200;
#pragma warning restore CA2252
                })
                .ConfigureKestrel((_, serverOptions) => {
                    serverOptions.ListenAnyIP(
                        int.Parse(envVars["SERVER_PORT"]!.ToString()!),
                        listenOptions => {
                            listenOptions.Protocols =
                                HttpProtocols.Http1AndHttp2AndHttp3;
                            listenOptions.UseHttps(certPath, certPassword);
                        });
                });
        }
    }

    public static Task ConfigureAsync(this WebApplication app) {
        if (app.Environment.IsDevelopment())
            app.MapOpenApi();

        var developmentAccounts = app.Configuration
            .GetSection("DevelopmentAccounts").GetChildren();

        var task = developmentAccounts.Any()
            ? Task.Run(async () => await app.Services.CreateScope()
                .ServiceProvider
                .GetRequiredService<DatabaseSeeder>()
                .SeedDevelopmentAccountsAsync(app.Environment.IsDevelopment()))
            : Task.CompletedTask;

        if (!app.Environment.IsDevelopment())
            app.UseHttpsRedirection();

        app
            .UseCors()
            .UseAuthentication()
            .UseAuthorization();

        app.MapControllers();
        app.MapGraphQL("/api/graphql");

        return task;
    }
}