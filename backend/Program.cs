using dotenv.net;
using ElaviewBackend.Data;
using ElaviewBackend.Services;
using ElaviewBackend.Settings;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Server.Kestrel.Core;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;

var builder = WebApplication.CreateBuilder(args);

var envVars = Environment.GetEnvironmentVariables();
var configData = new Dictionary<string, string?>();

if (builder.Environment.IsDevelopment()) {
    DotEnv.Load();
    envVars = Environment.GetEnvironmentVariables();

    configData["Database:Host"] = envVars["DATABASE_HOST"]?.ToString();
    configData["Database:Port"] = envVars["DATABASE_PORT"]?.ToString();
    configData["Database:User"] = envVars["DATABASE_USER"]?.ToString();
    configData["Database:Password"] =
        envVars["DATABASE_PASSWORD"]?.ToString();

    var i = 0;
    var emailKey = $"DEV_ACCOUNT_{i}_EMAIL";
    while (envVars[emailKey] != null) {
        configData[$"DevelopmentAccounts:{i}:Email"] =
            envVars[emailKey]?.ToString();
        configData[$"DevelopmentAccounts:{i}:Password"] =
            envVars[$"DEV_ACCOUNT_{i}_PASSWORD"]?.ToString();
        configData[$"DevelopmentAccounts:{i}:Name"] =
            envVars[$"DEV_ACCOUNT_{i}_NAME"]?.ToString();
        configData[$"DevelopmentAccounts:{i}:Role"] =
            envVars[$"DEV_ACCOUNT_{i}_ROLE"]?.ToString();
        ++i;
        emailKey = $"DEV_ACCOUNT_{i}_EMAIL";
    }
}
else {
// todo: parse configs during staging and production
}

builder.Configuration.AddInMemoryCollection(configData);

builder.WebHost.UseQuic(options => {
#pragma warning disable CA2252
    options.MaxBidirectionalStreamCount = 200;
#pragma warning restore CA2252
});
builder.WebHost.ConfigureKestrel((_, serverOptions) => {
    // todo: staging and production should have a different TLS 1.3 cert
    serverOptions.ListenAnyIP(int.Parse(envVars["SERVER_PORT"]!.ToString()!),
        listenOptions => {
            listenOptions.Protocols = HttpProtocols.Http1AndHttp2AndHttp3;
            listenOptions.UseHttps(
                envVars["SERVER_TLS_CERT_PATH"]!.ToString()!,
                envVars["SERVER_TLS_CERT_PASSWORD"]!.ToString()!
            );
        });
});

builder.Services
    .Configure<GlobalSettings>(builder.Configuration)
    .AddHttpContextAccessor()
    .AddDbContext<AppDbContext>((sp, options) => {
        options.LogTo(Console.WriteLine);
        var connectionString = sp.GetRequiredService<IOptions<GlobalSettings>>()
            .Value.Database.GetConnectionString();
        options.UseNpgsql(connectionString);
    })
    .AddOpenApi()
    .AddScoped<AuthService>()
    .AddScoped<UserService>()
    .AddScoped<DatabaseSeeder>()
    .AddControllers();

builder.Services
    .AddCors(options =>
        options.AddDefaultPolicy(policy =>
            policy.WithOrigins("http://localhost:3000", "http://localhost:8081")
                .AllowAnyHeader()
                .AllowAnyMethod()
                .AllowCredentials()))
    .AddAuthorization()
    .AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme)
    .AddCookie(options => {
        options.Cookie.Name = "ElaviewAuth";
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
    .AddMutationConventions();

var app = builder.Build();

if (app.Environment.IsDevelopment()) {
    app.MapOpenApi();
    await app.Services.CreateScope().ServiceProvider
        .GetRequiredService<DatabaseSeeder>()
        .SeedDevelopmentAccountsAsync();
}

app
    .UseHttpsRedirection()
    .UseCors()
    .UseAuthentication()
    .UseAuthorization();

app.MapGet("/", () => "Hello World!");
app.MapControllers();
app.MapGraphQL("/api/graphql");

if (app.Environment.IsDevelopment()) {
    var logger = app.Services.GetRequiredService<ILogger<Program>>();
    var serverPort = envVars["SERVER_PORT"]!.ToString();
    logger.LogInformation("Server running at https://localhost:{Port}",
        serverPort);
    logger.LogInformation(
        "GraphQL endpoint: https://localhost:{Port}/api/graphql", serverPort);
}

app.RunWithGraphQLCommands(args);