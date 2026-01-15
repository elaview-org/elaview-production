using System.Diagnostics.CodeAnalysis;
using HotChocolate.Authorization;

namespace ElaviewBackend.Features.Payments;

[MutationType]
[SuppressMessage("ReSharper", "MemberCanBePrivate.Global")]
public static partial class StripeConnectMutations {
    [Authorize]
    public static async Task<ConnectStripeAccountPayload> ConnectStripeAccount(
        IStripeConnectService stripeConnectService, CancellationToken ct
    ) {
        var result = await stripeConnectService.CreateConnectAccountAsync(ct);
        return new ConnectStripeAccountPayload(result.AccountId, result.OnboardingUrl);
    }

    [Authorize]
    public static async Task<RefreshStripeAccountStatusPayload> RefreshStripeAccountStatus(
        IStripeConnectService stripeConnectService, CancellationToken ct
    ) => new(await stripeConnectService.RefreshAccountStatusAsync(ct));
}
