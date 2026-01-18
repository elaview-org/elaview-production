using ElaviewBackend.Data;
using ElaviewBackend.Data.Entities;
using Microsoft.EntityFrameworkCore;

namespace ElaviewBackend.Features.Marketplace;

public interface IReviewRepository {
    IQueryable<Review> Query();
    Task<Review?> GetByIdAsync(Guid id, CancellationToken ct);
    Task<Review?> GetByIdWithRelationsAsync(Guid id, CancellationToken ct);
    Task<Booking?> GetBookingByReviewIdAsync(Guid reviewId, CancellationToken ct);
    Task<Space?> GetSpaceByReviewIdAsync(Guid reviewId, CancellationToken ct);
    IQueryable<Review> GetBySpaceId(Guid spaceId);
    IQueryable<Review> GetByBookingIdAndType(Guid bookingId, ReviewerType reviewerType);
    IQueryable<Review> GetByUserId(Guid userId);
    Task<CompletedBookingInfo?> GetCompletedBookingInfoAsync(Guid bookingId, CancellationToken ct);
    Task<bool> ExistsAsync(Guid bookingId, ReviewerType reviewerType, CancellationToken ct);
    Task<Review> AddAsync(Review review, CancellationToken ct);
    Task<Review> UpdateAsync(Review review, UpdateReviewInput input, CancellationToken ct);
    Task<bool> DeleteAsync(Review review, CancellationToken ct);
    Task UpdateSpaceAverageRatingAsync(Guid spaceId, CancellationToken ct);
}

public record CompletedBookingInfo(
    Guid Id,
    Guid SpaceId,
    Guid AdvertiserUserId,
    Guid AdvertiserProfileId,
    Guid OwnerUserId,
    Guid OwnerProfileId
);

public sealed class ReviewRepository(
    AppDbContext context,
    IReviewByIdDataLoader reviewById,
    IBookingByReviewIdDataLoader bookingByReviewId,
    ISpaceByReviewIdDataLoader spaceByReviewId
) : IReviewRepository {
    public IQueryable<Review> Query() => context.Reviews;

    public async Task<Review?> GetByIdAsync(Guid id, CancellationToken ct)
        => await reviewById.LoadAsync(id, ct);

    public async Task<Review?> GetByIdWithRelationsAsync(Guid id, CancellationToken ct)
        => await context.Reviews
            .Where(r => r.Id == id)
            .Include(r => r.Booking).ThenInclude(b => b.Campaign).ThenInclude(c => c.AdvertiserProfile)
            .Include(r => r.Booking).ThenInclude(b => b.Space).ThenInclude(s => s.SpaceOwnerProfile)
            .FirstOrDefaultAsync(ct);

    public async Task<Booking?> GetBookingByReviewIdAsync(Guid reviewId, CancellationToken ct)
        => await bookingByReviewId.LoadAsync(reviewId, ct);

    public async Task<Space?> GetSpaceByReviewIdAsync(Guid reviewId, CancellationToken ct)
        => await spaceByReviewId.LoadAsync(reviewId, ct);

    public IQueryable<Review> GetBySpaceId(Guid spaceId)
        => context.Reviews.Where(r => r.SpaceId == spaceId);

    public IQueryable<Review> GetByBookingIdAndType(Guid bookingId, ReviewerType reviewerType)
        => context.Reviews.Where(r => r.BookingId == bookingId && r.ReviewerType == reviewerType);

    public IQueryable<Review> GetByUserId(Guid userId)
        => context.Reviews.Where(r =>
            (r.ReviewerType == ReviewerType.Advertiser &&
             r.Booking.Campaign.AdvertiserProfile.UserId == userId) ||
            (r.ReviewerType == ReviewerType.SpaceOwner &&
             r.Booking.Space.SpaceOwnerProfile.UserId == userId));

    public async Task<CompletedBookingInfo?> GetCompletedBookingInfoAsync(Guid bookingId, CancellationToken ct)
        => await context.Bookings
            .Where(b => b.Id == bookingId && b.Status == BookingStatus.Completed)
            .Select(b => new CompletedBookingInfo(
                b.Id,
                b.SpaceId,
                b.Campaign.AdvertiserProfile.UserId,
                b.Campaign.AdvertiserProfileId,
                b.Space.SpaceOwnerProfile.UserId,
                b.Space.SpaceOwnerProfileId))
            .FirstOrDefaultAsync(ct);

    public async Task<bool> ExistsAsync(Guid bookingId, ReviewerType reviewerType, CancellationToken ct)
        => await context.Reviews.AnyAsync(r => r.BookingId == bookingId && r.ReviewerType == reviewerType, ct);

    public async Task<Review> AddAsync(Review review, CancellationToken ct) {
        context.Reviews.Add(review);
        await context.SaveChangesAsync(ct);
        return review;
    }

    public async Task<Review> UpdateAsync(Review review, UpdateReviewInput input, CancellationToken ct) {
        var entry = context.Entry(review);
        if (input.Rating is not null)
            entry.Property(r => r.Rating).CurrentValue = input.Rating.Value;
        if (input.Comment is not null)
            entry.Property(r => r.Comment).CurrentValue = input.Comment;
        await context.SaveChangesAsync(ct);
        return review;
    }

    public async Task<bool> DeleteAsync(Review review, CancellationToken ct) {
        context.Reviews.Remove(review);
        await context.SaveChangesAsync(ct);
        return true;
    }

    public async Task UpdateSpaceAverageRatingAsync(Guid spaceId, CancellationToken ct) {
        var avgRating = await context.Reviews
            .Where(r => r.SpaceId == spaceId && r.ReviewerType == ReviewerType.Advertiser)
            .AverageAsync(r => (double?)r.Rating, ct);

        if (avgRating.HasValue) {
            await context.Spaces
                .Where(s => s.Id == spaceId)
                .ExecuteUpdateAsync(s => s.SetProperty(x => x.AverageRating, avgRating.Value), ct);
        }
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