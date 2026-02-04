using ElaviewBackend.Data.Entities;
using ElaviewBackend.Features.Shared.Errors;
using Stripe;

namespace ElaviewBackend.Features.Payments;

public interface IStripeConnectService {
    Task<StripeConnectResult> CreateConnectAccountAsync(Guid userId, CancellationToken ct);
    Task<SpaceOwnerProfile> RefreshAccountStatusAsync(Guid userId, CancellationToken ct);
    Task<SpaceOwnerProfile> DisconnectAccountAsync(Guid userId, CancellationToken ct);
}

public sealed class StripeConnectService(IStripeConnectRepository repository) : IStripeConnectService {
    public async Task<StripeConnectResult> CreateConnectAccountAsync(Guid userId, CancellationToken ct) {
        var profile = await repository.GetSpaceOwnerProfileByUserIdAsync(userId, ct)
            ?? throw new NotFoundException("SpaceOwnerProfile", userId);

        if (!string.IsNullOrEmpty(profile.StripeAccountId)) {
            var linkOptions = new AccountLinkCreateOptions {
                Account = profile.StripeAccountId,
                RefreshUrl = GetStripeRefreshUrl(),
                ReturnUrl = GetStripeReturnUrl(),
                Type = "account_onboarding"
            };
            AccountLinkService linkService = new();
            AccountLink existingLink;
            try {
                existingLink = await linkService.CreateAsync(linkOptions, cancellationToken: ct);
            }
            catch (StripeException ex) {
                throw new PaymentException("account link", ex.Message);
            }
            return new StripeConnectResult(profile.StripeAccountId, existingLink.Url);
        }

        var options = new AccountCreateOptions {
            Type = "express",
            Country = "US",
            Capabilities = new AccountCapabilitiesOptions {
                Transfers = new AccountCapabilitiesTransfersOptions { Requested = true }
            }
        };

        AccountService accountService = new();
        Account account;
        try {
            account = await accountService.CreateAsync(options, cancellationToken: ct);
        }
        catch (StripeException ex) {
            throw new PaymentException("account creation", ex.Message);
        }

        await repository.UpdateStripeAccountIdAsync(profile, account.Id, ct);

        var accountLinkOptions = new AccountLinkCreateOptions {
            Account = account.Id,
            RefreshUrl = GetStripeRefreshUrl(),
            ReturnUrl = GetStripeReturnUrl(),
            Type = "account_onboarding"
        };

        AccountLinkService accountLinkService = new();
        AccountLink accountLink;
        try {
            accountLink = await accountLinkService.CreateAsync(accountLinkOptions, cancellationToken: ct);
        }
        catch (StripeException ex) {
            throw new PaymentException("account link", ex.Message);
        }

        return new StripeConnectResult(account.Id, accountLink.Url);
    }

    public async Task<SpaceOwnerProfile> RefreshAccountStatusAsync(Guid userId, CancellationToken ct) {
        var profile = await repository.GetSpaceOwnerProfileByUserIdAsync(userId, ct)
            ?? throw new NotFoundException("SpaceOwnerProfile", userId);

        if (string.IsNullOrEmpty(profile.StripeAccountId))
            throw new ValidationException("StripeAccountId", "No Stripe account connected");

        AccountService service = new();
        Account account;
        try {
            account = await service.GetAsync(profile.StripeAccountId, cancellationToken: ct);
        }
        catch (StripeException ex) {
            throw new PaymentException("account status refresh", ex.Message);
        }

        var status = account.ChargesEnabled ? "active" :
            account.DetailsSubmitted ? "pending" : "incomplete";

        return await repository.UpdateStripeAccountStatusAsync(profile, status, ct);
    }

    public async Task<SpaceOwnerProfile> DisconnectAccountAsync(Guid userId, CancellationToken ct) {
        var profile = await repository.GetSpaceOwnerProfileByUserIdAsync(userId, ct)
            ?? throw new NotFoundException("SpaceOwnerProfile", userId);

        if (string.IsNullOrEmpty(profile.StripeAccountId))
            throw new ValidationException("StripeAccountId", "No Stripe account connected");

        AccountService accountService = new();
        try {
            await accountService.DeleteAsync(profile.StripeAccountId, cancellationToken: ct);
        }
        catch (StripeException ex) when (
            ex.HttpStatusCode is System.Net.HttpStatusCode.NotFound
                or System.Net.HttpStatusCode.Forbidden) {
        }
        catch (StripeException ex) {
            throw new PaymentException("account disconnect", ex.Message);
        }

        return await repository.DisconnectStripeAccountAsync(profile, ct);
    }

    private static string GetStripeRefreshUrl()
        => Environment.GetEnvironmentVariable(
            "ELAVIEW_BACKEND_STRIPE_CONNECT_REFRESH_URL")!;

    private static string GetStripeReturnUrl()
        => Environment.GetEnvironmentVariable(
            "ELAVIEW_BACKEND_STRIPE_CONNECT_RETURN_URL")!;
}

public record StripeConnectResult(string AccountId, string OnboardingUrl);