using dotenv.net;
using Microsoft.AspNetCore.Server.Kestrel.Core;
using Microsoft.EntityFrameworkCore;

namespace ElaviewBackend.Bootstrap;

public static class Config {
    public static void Configure(this WebApplicationBuilder builder) {
        DotEnv.Load();
        var envVars = Environment.GetEnvironmentVariables();

        var stripeSecretKey =
            envVars["ELAVIEW_BACKEND_STRIPE_SECRET_KEY"]?.ToString();
        if (!string.IsNullOrEmpty(stripeSecretKey))
            Stripe.StripeConfiguration.ApiKey = stripeSecretKey;

        var configData = new Dictionary<string, string?> {
            ["Database:Host"] =
                envVars["ELAVIEW_BACKEND_DATABASE_HOST"]?.ToString(),
            ["Database:Port"] =
                envVars["ELAVIEW_BACKEND_DATABASE_PORT"]?.ToString(),
            ["Database:User"] =
                envVars["ELAVIEW_BACKEND_DATABASE_USER"]?.ToString(),
            ["Database:Password"] = envVars["ELAVIEW_BACKEND_DATABASE_PASSWORD"]
                ?.ToString(),
            ["Cloudinary:CloudName"] =
                envVars["ELAVIEW_BACKEND_CLOUDINARY_CLOUD_NAME"]?.ToString(),
            ["Cloudinary:ApiKey"] =
                envVars["ELAVIEW_BACKEND_CLOUDINARY_API_KEY"]?.ToString(),
            ["Cloudinary:ApiSecret"] =
                envVars["ELAVIEW_BACKEND_CLOUDINARY_API_SECRET"]?.ToString()
        };

        builder.Configuration.AddInMemoryCollection(configData);

        var certPath = envVars["ELAVIEW_BACKEND_SERVER_TLS_CERT_PATH"]
            ?.ToString();
        var certPassword = envVars["ELAVIEW_BACKEND_SERVER_TLS_CERT_PASSWORD"]
            ?.ToString();

        var isTestOrDev = builder.Environment.IsDevelopment() ||
                          builder.Environment.EnvironmentName == "Testing";

        if (isTestOrDev) {
            var port = envVars["ELAVIEW_BACKEND_SERVER_PORT"]?.ToString();
            if (!string.IsNullOrEmpty(port))
                builder.WebHost.ConfigureKestrel((_, serverOptions) => {
                    serverOptions.ListenAnyIP(
                        int.Parse(port),
                        listenOptions => {
                            listenOptions.Protocols =
                                HttpProtocols.Http1AndHttp2;
                        });
                });
        }
        else {
            if (string.IsNullOrEmpty(certPath))
                throw new InvalidOperationException(
                    "ELAVIEW_BACKEND_SERVER_TLS_CERT_PATH is required");

            builder.WebHost
                .UseQuic(options => {
#pragma warning disable CA2252
                    options.MaxBidirectionalStreamCount = 200;
#pragma warning restore CA2252
                })
                .ConfigureKestrel((_, serverOptions) => {
                    serverOptions.ListenAnyIP(
                        int.Parse(envVars["ELAVIEW_BACKEND_SERVER_PORT"]!
                            .ToString()!),
                        listenOptions => {
                            listenOptions.Protocols =
                                HttpProtocols.Http1AndHttp2AndHttp3;
                            listenOptions.UseHttps(certPath, certPassword);
                        });
                });
        }
    }

    public static async Task ConfigureAsync(this WebApplication app) {
        var isTesting = app.Environment.EnvironmentName == "Testing";
        var isTestOrDev = app.Environment.IsDevelopment() || isTesting;

        using (var scope = app.Services.CreateScope()) {
            var dbContext = scope.ServiceProvider.GetRequiredService<Data.AppDbContext>();
            if (isTestOrDev)
                await dbContext.Database.MigrateAsync();

            if (!isTesting)
                await Data.Seeding.SeedAsync(dbContext, ct: default);
        }

        if (!isTestOrDev) {
            app.MapOpenApi();
            app.UseHttpsRedirection();
        }

        app
            .UseCors()
            .UseAuthentication()
            .UseAuthorization();
        app.MapControllers();
        app.MapGraphQL("/api/graphql");
    }
}