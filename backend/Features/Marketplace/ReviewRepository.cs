using ElaviewBackend.Data;
using ElaviewBackend.Data.Entities;
using Microsoft.EntityFrameworkCore;

namespace ElaviewBackend.Features.Marketplace;

public interface IReviewRepository {
    Task<Review?> GetByIdAsync(Guid id, CancellationToken ct);

    Task<Booking?> GetBookingByReviewIdAsync(Guid reviewId,
        CancellationToken ct);

    Task<Space?> GetSpaceByReviewIdAsync(Guid reviewId, CancellationToken ct);
}

public sealed class ReviewRepository(
    IReviewByIdDataLoader reviewById,
    IBookingByReviewIdDataLoader bookingByReviewId,
    ISpaceByReviewIdDataLoader spaceByReviewId
) : IReviewRepository {
    public async Task<Review?> GetByIdAsync(Guid id, CancellationToken ct) {
        return await reviewById.LoadAsync(id, ct);
    }

    public async Task<Booking?> GetBookingByReviewIdAsync(Guid reviewId,
        CancellationToken ct) {
        return await bookingByReviewId.LoadAsync(reviewId, ct);
    }

    public async Task<Space?> GetSpaceByReviewIdAsync(Guid reviewId,
        CancellationToken ct) {
        return await spaceByReviewId.LoadAsync(reviewId, ct);
    }
}

internal static class ReviewDataLoaders {
    [DataLoader]
    public static async Task<IReadOnlyDictionary<Guid, Review>> GetReviewById(
        IReadOnlyList<Guid> ids, AppDbContext context, CancellationToken ct
    ) {
        return await context.Reviews
            .Where(r => ids.Contains(r.Id))
            .ToDictionaryAsync(r => r.Id, ct);
    }

    [DataLoader]
    public static async Task<IReadOnlyDictionary<Guid, Booking>>
        GetBookingByReviewId(
            IReadOnlyList<Guid> reviewIds, AppDbContext context,
            CancellationToken ct
        ) {
        return await context.Reviews
            .Where(r => reviewIds.Contains(r.Id))
            .Include(r => r.Booking)
            .ToDictionaryAsync(r => r.Id, r => r.Booking, ct);
    }

    [DataLoader]
    public static async Task<IReadOnlyDictionary<Guid, Space>>
        GetSpaceByReviewId(
            IReadOnlyList<Guid> reviewIds, AppDbContext context,
            CancellationToken ct
        ) {
        return await context.Reviews
            .Where(r => reviewIds.Contains(r.Id))
            .Include(r => r.Space)
            .ToDictionaryAsync(r => r.Id, r => r.Space, ct);
    }
}