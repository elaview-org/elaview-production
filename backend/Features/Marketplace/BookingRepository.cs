using ElaviewBackend.Data;
using ElaviewBackend.Data.Entities;
using Microsoft.EntityFrameworkCore;

namespace ElaviewBackend.Features.Marketplace;

public interface IBookingRepository {
    IQueryable<Booking> Query();
    Task<Booking?> GetByIdAsync(Guid id, CancellationToken ct);
    Task<Booking?> GetByIdWithRelationsAsync(Guid id, CancellationToken ct);
    Task<Campaign?> GetCampaignByBookingIdAsync(Guid bookingId, CancellationToken ct);
    Task<Space?> GetSpaceByBookingIdAsync(Guid bookingId, CancellationToken ct);
    Task<BookingProof?> GetProofByBookingIdAsync(Guid bookingId, CancellationToken ct);
    Task<BookingDispute?> GetDisputeByBookingIdAsync(Guid bookingId, CancellationToken ct);
    IQueryable<Booking> GetByAdvertiserUserId(Guid userId);
    IQueryable<Booking> GetByOwnerUserId(Guid userId);
    IQueryable<Booking> GetPendingByOwnerUserId(Guid userId);
    IQueryable<Booking> GetRequiringActionByUserId(Guid userId);
    IQueryable<Review> GetReviewsByBookingId(Guid bookingId);
    IQueryable<Payment> GetPaymentsByBookingId(Guid bookingId);
    IQueryable<Payout> GetPayoutsByBookingId(Guid bookingId);
    Task<Guid?> GetCampaignIdIfOwnedByUserAsync(Guid campaignId, Guid userId, CancellationToken ct);
    Task<SpaceInfo?> GetActiveSpaceInfoAsync(Guid spaceId, CancellationToken ct);
    Task<Booking> AddAsync(Booking booking, CancellationToken ct);
    Task<Booking> UpdateStatusAsync(Booking booking, BookingStatus status, CancellationToken ct);
    Task SaveChangesAsync(CancellationToken ct);
}

public record SpaceInfo(Guid Id, decimal PricePerDay, decimal? InstallationFee);

public sealed class BookingRepository(
    AppDbContext context,
    IBookingByIdDataLoader bookingById,
    ICampaignByBookingIdDataLoader campaignByBookingId,
    ISpaceByBookingIdDataLoader spaceByBookingId,
    IProofByBookingIdDataLoader proofByBookingId,
    IDisputeByBookingIdDataLoader disputeByBookingId
) : IBookingRepository {
    public IQueryable<Booking> Query() => context.Bookings;

    public async Task<Booking?> GetByIdAsync(Guid id, CancellationToken ct)
        => await bookingById.LoadAsync(id, ct);

    public async Task<Booking?> GetByIdWithRelationsAsync(Guid id, CancellationToken ct)
        => await context.Bookings
            .Include(b => b.Campaign).ThenInclude(c => c.AdvertiserProfile)
            .Include(b => b.Space).ThenInclude(s => s.SpaceOwnerProfile)
            .FirstOrDefaultAsync(b => b.Id == id, ct);

    public async Task<Campaign?> GetCampaignByBookingIdAsync(Guid bookingId, CancellationToken ct)
        => await campaignByBookingId.LoadAsync(bookingId, ct);

    public async Task<Space?> GetSpaceByBookingIdAsync(Guid bookingId, CancellationToken ct)
        => await spaceByBookingId.LoadAsync(bookingId, ct);

    public async Task<BookingProof?> GetProofByBookingIdAsync(Guid bookingId, CancellationToken ct)
        => await proofByBookingId.LoadAsync(bookingId, ct);

    public async Task<BookingDispute?> GetDisputeByBookingIdAsync(Guid bookingId, CancellationToken ct)
        => await disputeByBookingId.LoadAsync(bookingId, ct);

    public IQueryable<Booking> GetByAdvertiserUserId(Guid userId)
        => context.Bookings.Where(b => b.Campaign.AdvertiserProfile.UserId == userId);

    public IQueryable<Booking> GetByOwnerUserId(Guid userId)
        => context.Bookings.Where(b => b.Space.SpaceOwnerProfile.UserId == userId);

    public IQueryable<Booking> GetPendingByOwnerUserId(Guid userId)
        => context.Bookings.Where(b =>
            b.Space.SpaceOwnerProfile.UserId == userId &&
            b.Status == BookingStatus.PendingApproval);

    public IQueryable<Booking> GetRequiringActionByUserId(Guid userId)
        => context.Bookings.Where(b =>
            (b.Campaign.AdvertiserProfile.UserId == userId && b.Status == BookingStatus.Verified) ||
            (b.Space.SpaceOwnerProfile.UserId == userId &&
             (b.Status == BookingStatus.PendingApproval ||
              b.Status == BookingStatus.Paid ||
              b.Status == BookingStatus.FileDownloaded ||
              b.Status == BookingStatus.Installed)));

    public IQueryable<Review> GetReviewsByBookingId(Guid bookingId)
        => context.Reviews.Where(r => r.BookingId == bookingId);

    public IQueryable<Payment> GetPaymentsByBookingId(Guid bookingId)
        => context.Payments.Where(p => p.BookingId == bookingId);

    public IQueryable<Payout> GetPayoutsByBookingId(Guid bookingId)
        => context.Payouts.Where(p => p.BookingId == bookingId);

    public async Task<Guid?> GetCampaignIdIfOwnedByUserAsync(Guid campaignId, Guid userId, CancellationToken ct)
        => await context.Campaigns
            .Where(c => c.Id == campaignId && c.AdvertiserProfile.UserId == userId)
            .Select(c => (Guid?)c.Id)
            .FirstOrDefaultAsync(ct);

    public async Task<SpaceInfo?> GetActiveSpaceInfoAsync(Guid spaceId, CancellationToken ct)
        => await context.Spaces
            .Where(s => s.Id == spaceId && s.Status == SpaceStatus.Active)
            .Select(s => new SpaceInfo(s.Id, s.PricePerDay, s.InstallationFee))
            .FirstOrDefaultAsync(ct);

    public async Task<Booking> AddAsync(Booking booking, CancellationToken ct) {
        context.Bookings.Add(booking);
        await context.SaveChangesAsync(ct);
        return booking;
    }

    public async Task<Booking> UpdateStatusAsync(Booking booking, BookingStatus status, CancellationToken ct) {
        context.Entry(booking).Property(b => b.Status).CurrentValue = status;
        context.Entry(booking).Property(b => b.UpdatedAt).CurrentValue = DateTime.UtcNow;
        await context.SaveChangesAsync(ct);
        return booking;
    }

    public async Task SaveChangesAsync(CancellationToken ct)
        => await context.SaveChangesAsync(ct);
}

internal static class BookingDataLoaders {
    [DataLoader]
    public static async Task<IReadOnlyDictionary<Guid, Booking>> GetBookingById(
        IReadOnlyList<Guid> ids, AppDbContext context, CancellationToken ct
    ) {
        return await context.Bookings
            .Where(b => ids.Contains(b.Id))
            .ToDictionaryAsync(b => b.Id, ct);
    }

    [DataLoader]
    public static async Task<IReadOnlyDictionary<Guid, Campaign>>
        GetCampaignByBookingId(
            IReadOnlyList<Guid> bookingIds, AppDbContext context,
            CancellationToken ct
        ) {
        return await context.Bookings
            .Where(b => bookingIds.Contains(b.Id))
            .Include(b => b.Campaign)
            .ToDictionaryAsync(b => b.Id, b => b.Campaign, ct);
    }

    [DataLoader]
    public static async Task<IReadOnlyDictionary<Guid, Space>>
        GetSpaceByBookingId(
            IReadOnlyList<Guid> bookingIds, AppDbContext context,
            CancellationToken ct
        ) {
        return await context.Bookings
            .Where(b => bookingIds.Contains(b.Id))
            .Include(b => b.Space)
            .ToDictionaryAsync(b => b.Id, b => b.Space, ct);
    }

    [DataLoader]
    public static async Task<IReadOnlyDictionary<Guid, BookingProof>>
        GetProofByBookingId(
            IReadOnlyList<Guid> bookingIds, AppDbContext context,
            CancellationToken ct
        ) {
        return await context.BookingProofs
            .Where(p => bookingIds.Contains(p.BookingId))
            .ToDictionaryAsync(p => p.BookingId, ct);
    }

    [DataLoader]
    public static async Task<IReadOnlyDictionary<Guid, BookingDispute>>
        GetDisputeByBookingId(
            IReadOnlyList<Guid> bookingIds, AppDbContext context,
            CancellationToken ct
        ) {
        return await context.BookingDisputes
            .Where(d => bookingIds.Contains(d.BookingId))
            .ToDictionaryAsync(d => d.BookingId, ct);
    }

    [DataLoader]
    public static async Task<ILookup<Guid, Review>> GetReviewsByBookingId(
        IReadOnlyList<Guid> bookingIds, AppDbContext context,
        CancellationToken ct
    ) {
        return (await context.Reviews
            .Where(r => bookingIds.Contains(r.BookingId))
            .ToListAsync(ct)).ToLookup(r => r.BookingId);
    }

    [DataLoader]
    public static async Task<ILookup<Guid, Payment>> GetPaymentsByBookingId(
        IReadOnlyList<Guid> bookingIds, AppDbContext context,
        CancellationToken ct
    ) {
        return (await context.Payments
            .Where(p => bookingIds.Contains(p.BookingId))
            .ToListAsync(ct)).ToLookup(p => p.BookingId);
    }

    [DataLoader]
    public static async Task<ILookup<Guid, Payout>> GetPayoutsByBookingId(
        IReadOnlyList<Guid> bookingIds, AppDbContext context,
        CancellationToken ct
    ) {
        return (await context.Payouts
            .Where(p => bookingIds.Contains(p.BookingId))
            .ToListAsync(ct)).ToLookup(p => p.BookingId);
    }
}