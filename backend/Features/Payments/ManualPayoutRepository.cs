using ElaviewBackend.Data;
using ElaviewBackend.Data.Entities;
using Microsoft.EntityFrameworkCore;

namespace ElaviewBackend.Features.Payments;

public interface IManualPayoutRepository {
    IQueryable<ManualPayout> GetByUserId(Guid userId);
    Task<List<ManualPayout>> GetByUserIdAsync(Guid userId, CancellationToken ct);
    Task<List<ManualPayout>> GetCompletedByUserIdInRangeAsync(
        Guid userId, DateTime start, DateTime end, CancellationToken ct);
    Task<decimal> GetTotalWithdrawnByUserIdAsync(Guid userId, CancellationToken ct);
    Task<SpaceOwnerProfileInfo?> GetSpaceOwnerProfileByUserIdAsync(Guid userId, CancellationToken ct);
    Task<ManualPayout> AddAsync(ManualPayout payout, CancellationToken ct);
    Task<ManualPayout> UpdateStatusCompletedAsync(ManualPayout payout, string stripePayoutId, CancellationToken ct);
    Task<ManualPayout> UpdateStatusFailedAsync(ManualPayout payout, string failureReason, CancellationToken ct);
}

public record SpaceOwnerProfileInfo(
    Guid ProfileId,
    string? StripeAccountId,
    string? StripeAccountStatus
);

public sealed class ManualPayoutRepository(AppDbContext context) : IManualPayoutRepository {
    public IQueryable<ManualPayout> GetByUserId(Guid userId)
        => context.ManualPayouts.Where(p => p.SpaceOwnerProfile.UserId == userId);

    public async Task<List<ManualPayout>> GetByUserIdAsync(Guid userId, CancellationToken ct)
        => await context.ManualPayouts
            .Where(p => p.SpaceOwnerProfile.UserId == userId)
            .ToListAsync(ct);

    public async Task<List<ManualPayout>> GetCompletedByUserIdInRangeAsync(
        Guid userId, DateTime start, DateTime end, CancellationToken ct
    ) => await context.ManualPayouts
            .Where(p => p.SpaceOwnerProfile.UserId == userId &&
                        p.Status == ManualPayoutStatus.Completed &&
                        p.ProcessedAt >= start &&
                        p.ProcessedAt < end)
            .ToListAsync(ct);

    public async Task<decimal> GetTotalWithdrawnByUserIdAsync(Guid userId, CancellationToken ct)
        => await context.ManualPayouts
            .Where(p => p.SpaceOwnerProfile.UserId == userId &&
                        p.Status == ManualPayoutStatus.Completed)
            .SumAsync(p => p.Amount, ct);

    public async Task<SpaceOwnerProfileInfo?> GetSpaceOwnerProfileByUserIdAsync(Guid userId, CancellationToken ct)
        => await context.SpaceOwnerProfiles
            .Where(p => p.UserId == userId)
            .Select(p => new SpaceOwnerProfileInfo(
                p.Id,
                p.StripeAccountId,
                p.StripeAccountStatus
            ))
            .FirstOrDefaultAsync(ct);

    public async Task<ManualPayout> AddAsync(ManualPayout payout, CancellationToken ct) {
        context.ManualPayouts.Add(payout);
        await context.SaveChangesAsync(ct);
        return payout;
    }

    public async Task<ManualPayout> UpdateStatusCompletedAsync(
        ManualPayout payout, string stripePayoutId, CancellationToken ct
    ) {
        var entry = context.Entry(payout);
        entry.Property(p => p.StripePayoutId).CurrentValue = stripePayoutId;
        entry.Property(p => p.Status).CurrentValue = ManualPayoutStatus.Completed;
        entry.Property(p => p.ProcessedAt).CurrentValue = DateTime.UtcNow;
        entry.Property(p => p.FailureReason).CurrentValue = null;
        await context.SaveChangesAsync(ct);
        return payout;
    }

    public async Task<ManualPayout> UpdateStatusFailedAsync(
        ManualPayout payout, string failureReason, CancellationToken ct
    ) {
        var entry = context.Entry(payout);
        entry.Property(p => p.Status).CurrentValue = ManualPayoutStatus.Failed;
        entry.Property(p => p.FailureReason).CurrentValue = failureReason;
        await context.SaveChangesAsync(ct);
        return payout;
    }
}

internal static class ManualPayoutDataLoaders {
    [DataLoader]
    public static async Task<ILookup<Guid, ManualPayout>> GetManualPayoutsBySpaceOwnerProfileId(
        IReadOnlyList<Guid> profileIds, AppDbContext context, CancellationToken ct
    ) => (await context.ManualPayouts
        .Where(p => profileIds.Contains(p.SpaceOwnerProfileId))
        .ToListAsync(ct)).ToLookup(p => p.SpaceOwnerProfileId);
}
