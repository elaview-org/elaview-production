using ElaviewBackend.Data;
using ElaviewBackend.Features.Auth;
using ElaviewBackend.Features.Users;
using ElaviewBackend.Settings;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;

namespace ElaviewBackend.Bootstrap;

public static class Services {
    public static void AddServices(this WebApplicationBuilder builder) {
        builder.Services
            .Configure<GlobalSettings>(builder.Configuration)
            .AddHttpContextAccessor()
            .AddDbContext<AppDbContext>((sp, options) => {
                var connectionString = sp
                    .GetRequiredService<IOptions<GlobalSettings>>()
                    .Value.Database.GetConnectionString();
                options.UseNpgsql(connectionString,
                    o => o.EnableRetryOnFailure());

                if (builder.Environment.IsDevelopment()) {
                    options.LogTo(Console.WriteLine,
                            [DbLoggerCategory.Database.Command.Name],
                            LogLevel.Information)
                        .EnableSensitiveDataLogging();
                }
            })
            .AddOpenApi()
            .AddScoped<AuthService>()
            .AddScoped<IUserService, UserService>()
            .AddScoped<IUserRepository, UserRepository>()
            .AddScoped<DatabaseSeeder>()
            .AddControllers();

        var envVars = Environment.GetEnvironmentVariables();
        var corsOrigins =
            envVars["ELAVIEW_BACKEND_CORS_ORIGINS"]?.ToString()?.Split(',') ??
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
            .AddAuthentication(
                CookieAuthenticationDefaults.AuthenticationScheme)
            .AddCookie(options => {
                options.Cookie.Name =
                    envVars["ELAVIEW_BACKEND_AUTH_COOKIE_NAME"]!.ToString()!;
                options.Cookie.HttpOnly = true;
                options.Cookie.SecurePolicy =
                    builder.Environment.IsDevelopment()
                        ? CookieSecurePolicy.None
                        : CookieSecurePolicy.Always;
                options.Cookie.SameSite = builder.Environment.IsDevelopment()
                    ? SameSiteMode.Lax
                    : SameSiteMode.Strict;
                options.ExpireTimeSpan = TimeSpan.FromDays(7);
                options.SlidingExpiration = true;
                options.LoginPath = "/api/auth/login";
                options.LogoutPath = "/api/auth/logout";
                options.Events.OnRedirectToLogin = context => {
                    context.Response.StatusCode =
                        StatusCodes.Status401Unauthorized;
                    return Task.CompletedTask;
                };
            });

        builder
            .AddGraphQL()
            .AddAuthorization()
            .AddTypes()
            .AddQueryContext()
            .AddProjections()
            .AddFiltering()
            .AddSorting()
            .AddMutationConventions();
    }
}