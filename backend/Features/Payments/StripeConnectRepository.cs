using ElaviewBackend.Data;
using ElaviewBackend.Data.Entities;
using Microsoft.EntityFrameworkCore;

namespace ElaviewBackend.Features.Payments;

public interface IStripeConnectRepository {
    Task<SpaceOwnerProfile?> GetSpaceOwnerProfileByUserIdAsync(Guid userId, CancellationToken ct);
    Task<SpaceOwnerProfile> UpdateStripeAccountIdAsync(SpaceOwnerProfile profile, string accountId, CancellationToken ct);
    Task<SpaceOwnerProfile> UpdateStripeAccountStatusAsync(SpaceOwnerProfile profile, string status, CancellationToken ct);
}

public sealed class StripeConnectRepository(AppDbContext context) : IStripeConnectRepository {
    public async Task<SpaceOwnerProfile?> GetSpaceOwnerProfileByUserIdAsync(Guid userId, CancellationToken ct)
        => await context.SpaceOwnerProfiles.FirstOrDefaultAsync(p => p.UserId == userId, ct);

    public async Task<SpaceOwnerProfile> UpdateStripeAccountIdAsync(
        SpaceOwnerProfile profile, string accountId, CancellationToken ct
    ) {
        var entry = context.Entry(profile);
        entry.Property(p => p.StripeAccountId).CurrentValue = accountId;
        await context.SaveChangesAsync(ct);
        return profile;
    }

    public async Task<SpaceOwnerProfile> UpdateStripeAccountStatusAsync(
        SpaceOwnerProfile profile, string status, CancellationToken ct
    ) {
        var entry = context.Entry(profile);
        entry.Property(p => p.StripeAccountStatus).CurrentValue = status;
        entry.Property(p => p.StripeLastAccountHealthCheck).CurrentValue = DateTime.UtcNow;
        await context.SaveChangesAsync(ct);
        return profile;
    }
}