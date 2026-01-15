using ElaviewBackend.Data.Entities;

namespace ElaviewBackend.Features.Payments;

public record ProcessPayoutPayload(Payout Payout);

public record RetryPayoutPayload(Payout Payout);
