using ElaviewBackend.Data;
using ElaviewBackend.Data.Entities;
using Microsoft.EntityFrameworkCore;

namespace ElaviewBackend.Features.Marketplace;

public interface IBookingRepository {
    Task<Booking?> GetByIdAsync(Guid id, CancellationToken ct);

    Task<Campaign?> GetCampaignByBookingIdAsync(Guid bookingId,
        CancellationToken ct);

    Task<Space?> GetSpaceByBookingIdAsync(Guid bookingId, CancellationToken ct);

    Task<BookingProof?> GetProofByBookingIdAsync(Guid bookingId,
        CancellationToken ct);

    Task<BookingDispute?> GetDisputeByBookingIdAsync(Guid bookingId,
        CancellationToken ct);

    Task<IReadOnlyList<Review>> GetReviewsByBookingIdAsync(Guid bookingId,
        CancellationToken ct);

    Task<IReadOnlyList<Payment>> GetPaymentsByBookingIdAsync(Guid bookingId,
        CancellationToken ct);

    Task<IReadOnlyList<Payout>> GetPayoutsByBookingIdAsync(Guid bookingId,
        CancellationToken ct);
}

public sealed class BookingRepository(
    IBookingByIdDataLoader bookingById,
    ICampaignByBookingIdDataLoader campaignByBookingId,
    ISpaceByBookingIdDataLoader spaceByBookingId,
    IProofByBookingIdDataLoader proofByBookingId,
    IDisputeByBookingIdDataLoader disputeByBookingId,
    IReviewsByBookingIdDataLoader reviewsByBookingId,
    IPaymentsByBookingIdDataLoader paymentsByBookingId,
    IPayoutsByBookingIdDataLoader payoutsByBookingId
) : IBookingRepository {
    public async Task<Booking?> GetByIdAsync(Guid id, CancellationToken ct) {
        return await bookingById.LoadAsync(id, ct);
    }

    public async Task<Campaign?> GetCampaignByBookingIdAsync(Guid bookingId,
        CancellationToken ct) {
        return await campaignByBookingId.LoadAsync(bookingId, ct);
    }

    public async Task<Space?> GetSpaceByBookingIdAsync(Guid bookingId,
        CancellationToken ct) {
        return await spaceByBookingId.LoadAsync(bookingId, ct);
    }

    public async Task<BookingProof?> GetProofByBookingIdAsync(Guid bookingId,
        CancellationToken ct) {
        return await proofByBookingId.LoadAsync(bookingId, ct);
    }

    public async Task<BookingDispute?> GetDisputeByBookingIdAsync(
        Guid bookingId, CancellationToken ct) {
        return await disputeByBookingId.LoadAsync(bookingId, ct);
    }

    public async Task<IReadOnlyList<Review>> GetReviewsByBookingIdAsync(
        Guid bookingId, CancellationToken ct) {
        return await reviewsByBookingId.LoadAsync(bookingId, ct) ?? [];
    }

    public async Task<IReadOnlyList<Payment>> GetPaymentsByBookingIdAsync(
        Guid bookingId, CancellationToken ct) {
        return await paymentsByBookingId.LoadAsync(bookingId, ct) ?? [];
    }

    public async Task<IReadOnlyList<Payout>> GetPayoutsByBookingIdAsync(
        Guid bookingId, CancellationToken ct) {
        return await payoutsByBookingId.LoadAsync(bookingId, ct) ?? [];
    }
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