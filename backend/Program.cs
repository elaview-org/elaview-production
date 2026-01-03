using ElaviewBackend.Data;
using ElaviewBackend.Services;
using ElaviewBackend.Settings;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;

var builder = WebApplication.CreateBuilder(args);

builder.Configuration.AddJsonFile("secrets.json", optional: false,
    reloadOnChange: true);

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
    .AddSorting();

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
app.RunWithGraphQLCommands(args);