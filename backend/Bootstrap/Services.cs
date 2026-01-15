using ElaviewBackend.Data;
using ElaviewBackend.Features.Auth;
using ElaviewBackend.Features.Marketplace;
using ElaviewBackend.Features.Notifications;
using ElaviewBackend.Features.Payments;
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
            .AddScoped<ISpaceService, SpaceService>()
            .AddScoped<ISpaceRepository, SpaceRepository>()
            .AddScoped<ICampaignService, CampaignService>()
            .AddScoped<ICampaignRepository, CampaignRepository>()
            .AddScoped<IBookingService, BookingService>()
            .AddScoped<IBookingRepository, BookingRepository>()
            .AddScoped<IReviewService, ReviewService>()
            .AddScoped<IReviewRepository, ReviewRepository>()
            .AddScoped<IPaymentService, PaymentService>()
            .AddScoped<IPaymentRepository, PaymentRepository>()
            .AddScoped<IPayoutService, PayoutService>()
            .AddScoped<IPayoutRepository, PayoutRepository>()
            .AddScoped<IRefundService, RefundService>()
            .AddScoped<IRefundRepository, RefundRepository>()
            .AddScoped<ITransactionService, TransactionService>()
            .AddScoped<ITransactionRepository, TransactionRepository>()
            .AddScoped<IStripeConnectService, StripeConnectService>()
            .AddScoped<INotificationService, NotificationService>()
            .AddScoped<INotificationRepository, NotificationRepository>()
            .AddScoped<INotificationPreferenceRepository, NotificationPreferenceRepository>()
            .AddScoped<IConversationService, ConversationService>()
            .AddScoped<IConversationRepository, ConversationRepository>()
            .AddScoped<IMessageService, MessageService>()
            .AddScoped<IMessageRepository, MessageRepository>()
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
                var isTestOrDev = builder.Environment.IsDevelopment() ||
                                  builder.Environment.EnvironmentName == "Testing";
                options.Cookie.Name =
                    envVars["ELAVIEW_BACKEND_AUTH_COOKIE_NAME"]!.ToString()!;
                options.Cookie.HttpOnly = true;
                options.Cookie.SecurePolicy = isTestOrDev
                    ? CookieSecurePolicy.None
                    : CookieSecurePolicy.Always;
                options.Cookie.SameSite = isTestOrDev
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
            .AddMutationConventions()
            .AddInMemorySubscriptions();
    }
}