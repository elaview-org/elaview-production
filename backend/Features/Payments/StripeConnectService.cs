using System.Security.Claims;
using ElaviewBackend.Data;
using ElaviewBackend.Data.Entities;
using Microsoft.EntityFrameworkCore;
using Stripe;

namespace ElaviewBackend.Features.Payments;

public interface IStripeConnectService {
    Task<StripeConnectResult> CreateConnectAccountAsync(CancellationToken ct);
    Task<SpaceOwnerProfile> RefreshAccountStatusAsync(CancellationToken ct);
}

public sealed class StripeConnectService(
    IHttpContextAccessor httpContextAccessor,
    AppDbContext context
) : IStripeConnectService {
    private Guid GetCurrentUserId() {
        var principalId = httpContextAccessor.HttpContext?.User.FindFirstValue(
            ClaimTypes.NameIdentifier
        );
        return principalId is null
            ? throw new GraphQLException("Not authenticated")
            : Guid.Parse(principalId);
    }

    public async Task<StripeConnectResult> CreateConnectAccountAsync(CancellationToken ct) {
        var userId = GetCurrentUserId();

        var profile = await context.SpaceOwnerProfiles
            .FirstOrDefaultAsync(p => p.UserId == userId, ct)
            ?? throw new GraphQLException("Space owner profile not found");

        if (!string.IsNullOrEmpty(profile.StripeAccountId)) {
            var linkOptions = new AccountLinkCreateOptions {
                Account = profile.StripeAccountId,
                RefreshUrl = GetStripeRefreshUrl(),
                ReturnUrl = GetStripeReturnUrl(),
                Type = "account_onboarding"
            };
            var linkService = new AccountLinkService();
            var existingLink = await linkService.CreateAsync(linkOptions, cancellationToken: ct);
            return new StripeConnectResult(profile.StripeAccountId, existingLink.Url);
        }

        var options = new AccountCreateOptions {
            Type = "express",
            Country = "US",
            Capabilities = new AccountCapabilitiesOptions {
                Transfers = new AccountCapabilitiesTransfersOptions { Requested = true }
            }
        };

        var accountService = new AccountService();
        var account = await accountService.CreateAsync(options, cancellationToken: ct);

        var entry = context.Entry(profile);
        entry.Property(p => p.StripeAccountId).CurrentValue = account.Id;
        await context.SaveChangesAsync(ct);

        var accountLinkOptions = new AccountLinkCreateOptions {
            Account = account.Id,
            RefreshUrl = GetStripeRefreshUrl(),
            ReturnUrl = GetStripeReturnUrl(),
            Type = "account_onboarding"
        };

        var accountLinkService = new AccountLinkService();
        var accountLink = await accountLinkService.CreateAsync(accountLinkOptions, cancellationToken: ct);

        return new StripeConnectResult(account.Id, accountLink.Url);
    }

    public async Task<SpaceOwnerProfile> RefreshAccountStatusAsync(CancellationToken ct) {
        var userId = GetCurrentUserId();

        var profile = await context.SpaceOwnerProfiles
            .FirstOrDefaultAsync(p => p.UserId == userId, ct)
            ?? throw new GraphQLException("Space owner profile not found");

        if (string.IsNullOrEmpty(profile.StripeAccountId))
            throw new GraphQLException("No Stripe account connected");

        var service = new AccountService();
        var account = await service.GetAsync(profile.StripeAccountId, cancellationToken: ct);

        var entry = context.Entry(profile);
        entry.Property(p => p.StripeAccountStatus).CurrentValue =
            account.ChargesEnabled ? "active" : account.DetailsSubmitted ? "pending" : "incomplete";
        entry.Property(p => p.StripeLastAccountHealthCheck).CurrentValue = DateTime.UtcNow;

        await context.SaveChangesAsync(ct);
        return profile;
    }

    private static string GetStripeRefreshUrl() =>
        Environment.GetEnvironmentVariable("ELAVIEW_STRIPE_CONNECT_REFRESH_URL")
        ?? "http://localhost:3000/settings/payments/refresh";

    private static string GetStripeReturnUrl() =>
        Environment.GetEnvironmentVariable("ELAVIEW_STRIPE_CONNECT_RETURN_URL")
        ?? "http://localhost:3000/settings/payments/complete";
}

public record StripeConnectResult(
    string AccountId,
    string OnboardingUrl
);
