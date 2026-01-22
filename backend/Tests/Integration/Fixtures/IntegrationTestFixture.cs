using ElaviewBackend.Bootstrap;
using ElaviewBackend.Data;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.EntityFrameworkCore;
using Npgsql;
using Respawn;
using Testcontainers.PostgreSql;
using Xunit;
using Path = System.IO.Path;

namespace ElaviewBackend.Tests.Integration.Fixtures;

public sealed class IntegrationTestFixture : WebApplicationFactory<Program>,
    IAsyncLifetime {
    private readonly PostgreSqlContainer _dbContainer = new PostgreSqlBuilder()
        .WithImage("postgres:17")
        .WithDatabase("elaview_test")
        .WithUsername("elaview_test")
        .WithPassword("test")
        .Build();

    private NpgsqlConnection _dbConnection = null!;
    private Respawner _respawner = null!;

    public async Task InitializeAsync() {
        await _dbContainer.StartAsync();

        Environment.SetEnvironmentVariable("ELAVIEW_BACKEND_DATABASE_HOST",
            _dbContainer.Hostname);
        Environment.SetEnvironmentVariable("ELAVIEW_BACKEND_DATABASE_PORT",
            _dbContainer.GetMappedPublicPort(5432).ToString());
        Environment.SetEnvironmentVariable("ELAVIEW_BACKEND_DATABASE_USER",
            "elaview_test");
        Environment.SetEnvironmentVariable("ELAVIEW_BACKEND_DATABASE_PASSWORD",
            "test");
        Environment.SetEnvironmentVariable("ELAVIEW_BACKEND_SERVER_PORT",
            "5000");
        Environment.SetEnvironmentVariable("ELAVIEW_BACKEND_CORS_ORIGINS",
            "http://localhost:3000");
        Environment.SetEnvironmentVariable("ELAVIEW_BACKEND_AUTH_COOKIE_NAME",
            "ElaviewAuth");

        _ = CreateClient();

        _dbConnection =
            new NpgsqlConnection(_dbContainer.GetConnectionString());
        await _dbConnection.OpenAsync();

        _respawner = await Respawner.CreateAsync(_dbConnection,
            new RespawnerOptions {
                DbAdapter = DbAdapter.Postgres,
                SchemasToInclude = ["public"]
            });
    }

    public new async Task DisposeAsync() {
        await _dbConnection.DisposeAsync();
        await _dbContainer.DisposeAsync();
        await base.DisposeAsync();
    }

    public HttpClient CreateHttpClient() {
        return CreateClient(new WebApplicationFactoryClientOptions {
            HandleCookies = true
        });
    }

    public async Task ResetDatabaseAsync() {
        await _respawner.ResetAsync(_dbConnection);
    }

    protected override void ConfigureWebHost(IWebHostBuilder builder) {
        builder.UseEnvironment("Testing");
        builder.UseContentRoot(GetContentRoot());
    }

    private static string GetContentRoot() {
        var currentDir = Directory.GetCurrentDirectory();
        var dir = new DirectoryInfo(currentDir);
        while (dir != null &&
               !File.Exists(Path.Combine(dir.FullName,
                   "ElaviewBackend.csproj"))) dir = dir.Parent;
        return dir?.FullName ?? currentDir;
    }
}