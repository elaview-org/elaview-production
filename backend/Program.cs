using dotenv.net;
using ElaviewBackend.Features.Auth;
using ElaviewBackend.Features.Users;
using ElaviewBackend.Shared;
using ElaviewBackend.Shared.Settings;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Server.Kestrel.Core;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;

var builder = WebApplication.CreateBuilder(args);

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
    if (string.IsNullOrEmpty(certPath)) {
        throw new InvalidOperationException("SERVER_TLS_CERT_PATH is required");
    }

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

builder.Services
    .Configure<GlobalSettings>(builder.Configuration)
    .AddHttpContextAccessor()
    .AddDbContext<AppDbContext>((sp, options) => {
        if (builder.Environment.IsDevelopment()) {
            options.LogTo(Console.WriteLine);
        }

        var connectionString = sp.GetRequiredService<IOptions<GlobalSettings>>()
            .Value.Database.GetConnectionString();
        options.UseNpgsql(connectionString);
    })
    .AddOpenApi()
    .AddScoped<AuthService>()
    .AddScoped<UserService>()
    .AddScoped<DatabaseSeeder>()
    .AddControllers();

var corsOrigins =
    envVars["CORS_ORIGINS"]?.ToString()?.Split(',') ??
    throw new InvalidOperationException(
        "Missing CORS origins"
    );

builder.Services
    .AddCors(options =>
        options.AddDefaultPolicy(policy =>
            policy.WithOrigins(corsOrigins)
                .AllowAnyHeader()
                .AllowAnyMethod()
                .AllowCredentials()))
    .AddAuthorization()
    .AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme)
    .AddCookie(options => {
        options.Cookie.Name = envVars["AUTH_COOKIE_NAME"]!.ToString()!;
        options.Cookie.HttpOnly = true;
        options.Cookie.SecurePolicy = CookieSecurePolicy.Always;
        options.Cookie.SameSite = SameSiteMode.Strict;
        options.ExpireTimeSpan = TimeSpan.FromDays(7);
        options.SlidingExpiration = true;
        options.LoginPath = "/api/auth/login";
        options.LogoutPath = "/api/auth/logout";
        options.Events.OnRedirectToLogin = context => {
            context.Response.StatusCode = StatusCodes.Status401Unauthorized;
            return Task.CompletedTask;
        };
    });

builder
    .AddGraphQL()
    .AddTypes()
    .AddQueryContext()
    .AddProjections()
    .AddFiltering()
    .AddSorting()
    .AddMutationConventions(applyToAllMutations: true);

var app = builder.Build();

if (app.Environment.IsDevelopment()) {
    app.MapOpenApi();
}

var developmentAccounts = builder.Configuration
    .GetSection("DevelopmentAccounts").GetChildren();
if (developmentAccounts.Any()) {
    await app.Services.CreateScope().ServiceProvider
        .GetRequiredService<DatabaseSeeder>()
        .SeedDevelopmentAccountsAsync(app.Environment.IsDevelopment());
}

if (!app.Environment.IsDevelopment()) {
    app.UseHttpsRedirection();
}

app
    .UseCors()
    .UseAuthentication()
    .UseAuthorization();

app.MapControllers();
app.MapGraphQL("/api/graphql");

var logger = app.Services.GetRequiredService<ILogger<Program>>();
var serverPort = envVars["SERVER_PORT"]!.ToString();
var protocol = app.Environment.IsDevelopment() ? "http" : "https";
logger.LogInformation(
    "{Protocol}://localhost:{ServerPort}", protocol, serverPort
);
logger.LogInformation(
    "{Protocol}://localhost:{ServerPort}/api/graphql", protocol, serverPort
);

app.RunWithGraphQLCommands(args);