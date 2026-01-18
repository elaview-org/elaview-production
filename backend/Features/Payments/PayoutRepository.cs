using ElaviewBackend.Data;
using ElaviewBackend.Data.Entities;
using Microsoft.EntityFrameworkCore;

namespace ElaviewBackend.Features.Payments;

public interface IPayoutRepository {
    IQueryable<Payout> GetByUserId(Guid userId);
    IQueryable<Payout> GetById(Guid id);
    Task<Payout?> GetByIdAsync(Guid id, CancellationToken ct);
    Task<Payout?> GetByBookingIdAndStageAsync(Guid bookingId, PayoutStage stage, CancellationToken ct);
    Task<BookingPayoutInfo?> GetBookingInfoForPayoutAsync(Guid bookingId, CancellationToken ct);
    Task<List<Payout>> GetByUserIdAsync(Guid userId, CancellationToken ct);
    Task<Payout> AddAsync(Payout payout, CancellationToken ct);
    Task<Payout> UpdateStatusCompletedAsync(Payout payout, string transferId, CancellationToken ct);
    Task<Payout> UpdateStatusFailedAsync(Payout payout, string failureReason, CancellationToken ct);
    Task SaveChangesAsync(CancellationToken ct);
}

public record BookingPayoutInfo(
    Guid BookingId,
    Guid SpaceOwnerProfileId,
    string? StripeAccountId,
    decimal SubtotalAmount,
    decimal InstallationFee
);

public sealed class PayoutRepository(
    AppDbContext context,
    IPayoutByIdDataLoader payoutById
) : IPayoutRepository {
    public IQueryable<Payout> GetByUserId(Guid userId)
        => context.Payouts.Where(p => p.SpaceOwnerProfile.UserId == userId);

    public IQueryable<Payout> GetById(Guid id)
        => context.Payouts.Where(p => p.Id == id);

    public async Task<Payout?> GetByIdAsync(Guid id, CancellationToken ct)
        => await payoutById.LoadAsync(id, ct);

    public async Task<Payout?> GetByBookingIdAndStageAsync(Guid bookingId, PayoutStage stage, CancellationToken ct)
        => await context.Payouts.FirstOrDefaultAsync(
            p => p.BookingId == bookingId && p.Stage == stage, ct);

    public async Task<BookingPayoutInfo?> GetBookingInfoForPayoutAsync(Guid bookingId, CancellationToken ct)
        => await context.Bookings
            .Where(b => b.Id == bookingId)
            .Select(b => new BookingPayoutInfo(
                b.Id,
                b.Space.SpaceOwnerProfileId,
                b.Space.SpaceOwnerProfile.StripeAccountId,
                b.SubtotalAmount,
                b.InstallationFee
            ))
            .FirstOrDefaultAsync(ct);

    public async Task<List<Payout>> GetByUserIdAsync(Guid userId, CancellationToken ct)
        => await context.Payouts
            .Where(p => p.SpaceOwnerProfile.UserId == userId)
            .ToListAsync(ct);

    public async Task<Payout> AddAsync(Payout payout, CancellationToken ct) {
        context.Payouts.Add(payout);
        await context.SaveChangesAsync(ct);
        return payout;
    }

    public async Task<Payout> UpdateStatusCompletedAsync(Payout payout, string transferId, CancellationToken ct) {
        var entry = context.Entry(payout);
        entry.Property(p => p.StripeTransferId).CurrentValue = transferId;
        entry.Property(p => p.Status).CurrentValue = PayoutStatus.Completed;
        entry.Property(p => p.ProcessedAt).CurrentValue = DateTime.UtcNow;
        entry.Property(p => p.FailureReason).CurrentValue = null;
        entry.Property(p => p.AttemptCount).CurrentValue = payout.AttemptCount + 1;
        entry.Property(p => p.LastAttemptAt).CurrentValue = DateTime.UtcNow;
        await context.SaveChangesAsync(ct);
        return payout;
    }

    public async Task<Payout> UpdateStatusFailedAsync(Payout payout, string failureReason, CancellationToken ct) {
        var entry = context.Entry(payout);
        entry.Property(p => p.Status).CurrentValue = PayoutStatus.Failed;
        entry.Property(p => p.FailureReason).CurrentValue = failureReason;
        entry.Property(p => p.AttemptCount).CurrentValue = payout.AttemptCount + 1;
        entry.Property(p => p.LastAttemptAt).CurrentValue = DateTime.UtcNow;
        await context.SaveChangesAsync(ct);
        return payout;
    }

    public async Task SaveChangesAsync(CancellationToken ct)
        => await context.SaveChangesAsync(ct);
}

internal static class PayoutDataLoaders {
    [DataLoader]
    public static async Task<IReadOnlyDictionary<Guid, Payout>> GetPayoutById(
        IReadOnlyList<Guid> ids, AppDbContext context, CancellationToken ct
    ) => await context.Payouts
        .Where(p => ids.Contains(p.Id))
        .ToDictionaryAsync(p => p.Id, ct);

    [DataLoader]
    public static async Task<ILookup<Guid, Payout>> GetPayoutsByBookingId(
        IReadOnlyList<Guid> bookingIds, AppDbContext context, CancellationToken ct
    ) => (await context.Payouts
        .Where(p => bookingIds.Contains(p.BookingId))
        .ToListAsync(ct)).ToLookup(p => p.BookingId);

    [DataLoader]
    public static async Task<ILookup<Guid, Payout>> GetPayoutsBySpaceOwnerProfileId(
        IReadOnlyList<Guid> profileIds, AppDbContext context, CancellationToken ct
    ) => (await context.Payouts
        .Where(p => profileIds.Contains(p.SpaceOwnerProfileId))
        .ToListAsync(ct)).ToLookup(p => p.SpaceOwnerProfileId);
}