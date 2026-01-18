using ElaviewBackend.Features.Shared.Errors;
using ElaviewBackend.Features.Users;
using HotChocolate.Authorization;

namespace ElaviewBackend.Features.Payments;

[MutationType]
public static partial class StripeConnectMutations {
    [Authorize]
    [Error<NotFoundException>]
    [Error<PaymentException>]
    public static async Task<ConnectStripeAccountPayload> ConnectStripeAccount(
        IUserService userService,
        IStripeConnectService stripeConnectService,
        CancellationToken ct
    ) {
        var result = await stripeConnectService.CreateConnectAccountAsync(userService.GetPrincipalId(), ct);
        return new ConnectStripeAccountPayload(result.AccountId, result.OnboardingUrl);
    }

    [Authorize]
    [Error<NotFoundException>]
    [Error<ValidationException>]
    [Error<PaymentException>]
    public static async Task<RefreshStripeAccountStatusPayload> RefreshStripeAccountStatus(
        IUserService userService,
        IStripeConnectService stripeConnectService,
        CancellationToken ct
    ) => new(await stripeConnectService.RefreshAccountStatusAsync(userService.GetPrincipalId(), ct));
}