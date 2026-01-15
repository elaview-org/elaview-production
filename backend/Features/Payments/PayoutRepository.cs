using ElaviewBackend.Data;
using ElaviewBackend.Data.Entities;
using Microsoft.EntityFrameworkCore;

namespace ElaviewBackend.Features.Payments;

public interface IPayoutRepository {
    IQueryable<Payout> Query();
    Task<Payout?> GetByIdAsync(Guid id, CancellationToken ct);
    Task<Payout> AddAsync(Payout payout, CancellationToken ct);
    Task SaveChangesAsync(CancellationToken ct);
}

public sealed class PayoutRepository(
    AppDbContext context,
    IPayoutByIdDataLoader payoutById
) : IPayoutRepository {
    public IQueryable<Payout> Query() => context.Payouts;

    public async Task<Payout?> GetByIdAsync(Guid id, CancellationToken ct) =>
        await payoutById.LoadAsync(id, ct);

    public async Task<Payout> AddAsync(Payout payout, CancellationToken ct) {
        context.Payouts.Add(payout);
        await context.SaveChangesAsync(ct);
        return payout;
    }

    public async Task SaveChangesAsync(CancellationToken ct) =>
        await context.SaveChangesAsync(ct);
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
