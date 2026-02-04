using ElaviewBackend.Data.Entities;

namespace ElaviewBackend.Features.Payments;

public record ConnectStripeAccountPayload(
    string AccountId,
    string OnboardingUrl
);

public record RefreshStripeAccountStatusPayload(SpaceOwnerProfile Profile);

public record DisconnectStripeAccountPayload(SpaceOwnerProfile Profile);