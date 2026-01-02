using ElaviewBackend.Data;
using ElaviewBackend.Services;
using ElaviewBackend.Settings;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;

var builder = WebApplication.CreateBuilder(args);

builder.Configuration.AddJsonFile("secrets.json", optional: false,
    reloadOnChange: true);

// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services
    .Configure<GlobalSettings>(builder.Configuration)
    .AddDbContext<AppDbContext>((serviceProvider, options) => {
            options.LogTo(Console.WriteLine);
            options.UseNpgsql(serviceProvider
                .GetRequiredService<IOptions<GlobalSettings>>().Value.Database
                .GetConnectionString());
        }
    )
    .AddOpenApi()
    .AddHttpContextAccessor();

builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<UserService>();
builder.Services.AddScoped<DatabaseSeeder>();

builder.Services.AddControllers();

builder.Services
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

builder.Services.AddAuthorization();
builder.Services.AddCors(options => {
    options.AddDefaultPolicy(policy => {
        policy.WithOrigins("http://localhost:3000", "http://localhost:8081")
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials();
    });
});
builder.AddGraphQL().AddTypes();

var app = builder.Build();

if (app.Environment.IsDevelopment()) {
    app.MapOpenApi();
    using var scope = app.Services.CreateScope();
    var seeder = scope.ServiceProvider.GetRequiredService<DatabaseSeeder>();
    await seeder.SeedDevelopmentAccountsAsync();
}

app.UseHttpsRedirection();
app.UseCors();
app.UseAuthentication();
app.UseAuthorization();
app.MapGet("/", () => "Hello World!");
app.MapControllers();
app.MapGraphQL("/api/graphql");
app.RunWithGraphQLCommands(args);