using System.Security.Claims;
using ElaviewBackend.Data;
using ElaviewBackend.Data.Entities;
using Microsoft.EntityFrameworkCore;

namespace ElaviewBackend.Features.Marketplace;

public interface IReviewService {
    Guid? GetCurrentUserIdOrNull();
    IQueryable<Review> GetReviewsBySpaceIdQuery(Guid spaceId);
    IQueryable<Review> GetReviewByBookingIdQuery(Guid bookingId, ReviewerType reviewerType);
    IQueryable<Review> GetMyReviewsQuery();
    Task<Review?> GetReviewByIdAsync(Guid id, CancellationToken ct);
    Task<Review> CreateAsync(Guid bookingId, CreateReviewInput input, CancellationToken ct);
    Task<Review> UpdateAsync(Guid id, UpdateReviewInput input, CancellationToken ct);
    Task<bool> DeleteAsync(Guid id, CancellationToken ct);
}

public sealed class ReviewService(
    IHttpContextAccessor httpContextAccessor,
    AppDbContext context,
    IReviewRepository reviewRepository
) : IReviewService {
    public Guid? GetCurrentUserIdOrNull() {
        var principalId = httpContextAccessor.HttpContext?.User.FindFirstValue(
            ClaimTypes.NameIdentifier
        );
        return principalId is null ? null : Guid.Parse(principalId);
    }

    private Guid GetCurrentUserId() =>
        GetCurrentUserIdOrNull() ?? throw new GraphQLException("Not authenticated");

    public IQueryable<Review> GetReviewsBySpaceIdQuery(Guid spaceId) =>
        context.Reviews.Where(r => r.SpaceId == spaceId);

    public IQueryable<Review> GetReviewByBookingIdQuery(Guid bookingId, ReviewerType reviewerType) =>
        context.Reviews.Where(r => r.BookingId == bookingId && r.ReviewerType == reviewerType);

    public IQueryable<Review> GetMyReviewsQuery() {
        var userId = GetCurrentUserId();
        return context.Reviews.Where(r =>
            (r.ReviewerType == ReviewerType.Advertiser &&
             r.Booking.Campaign.AdvertiserProfile.UserId == userId) ||
            (r.ReviewerType == ReviewerType.SpaceOwner &&
             r.Booking.Space.SpaceOwnerProfile.UserId == userId));
    }

    public async Task<Review?> GetReviewByIdAsync(Guid id, CancellationToken ct) =>
        await reviewRepository.GetByIdAsync(id, ct);

    public async Task<Review> CreateAsync(Guid bookingId, CreateReviewInput input, CancellationToken ct) {
        var userId = GetCurrentUserId();

        var booking = await context.Bookings
            .Where(b => b.Id == bookingId && b.Status == BookingStatus.Completed)
            .Select(b => new {
                b.Id,
                b.SpaceId,
                AdvertiserUserId = b.Campaign.AdvertiserProfile.UserId,
                AdvertiserProfileId = b.Campaign.AdvertiserProfileId,
                OwnerUserId = b.Space.SpaceOwnerProfile.UserId,
                OwnerProfileId = b.Space.SpaceOwnerProfileId
            })
            .FirstOrDefaultAsync(ct)
            ?? throw new GraphQLException("Booking not found or not completed");

        ReviewerType reviewerType;
        Guid reviewerProfileId;

        if (booking.AdvertiserUserId == userId) {
            reviewerType = ReviewerType.Advertiser;
            reviewerProfileId = booking.AdvertiserProfileId;
        }
        else if (booking.OwnerUserId == userId) {
            reviewerType = ReviewerType.SpaceOwner;
            reviewerProfileId = booking.OwnerProfileId;
        }
        else {
            throw new GraphQLException("Not authorized to review this booking");
        }

        var existingReview = await context.Reviews
            .AnyAsync(r => r.BookingId == bookingId && r.ReviewerType == reviewerType, ct);

        if (existingReview)
            throw new GraphQLException("Review already exists for this booking");

        var review = new Review {
            BookingId = bookingId,
            SpaceId = booking.SpaceId,
            ReviewerType = reviewerType,
            ReviewerProfileId = reviewerProfileId,
            Rating = input.Rating,
            Comment = input.Comment,
            CreatedAt = DateTime.UtcNow
        };

        context.Reviews.Add(review);

        if (reviewerType == ReviewerType.Advertiser) {
            var avgRating = await context.Reviews
                .Where(r => r.SpaceId == booking.SpaceId && r.ReviewerType == ReviewerType.Advertiser)
                .AverageAsync(r => (double?)r.Rating, ct) ?? input.Rating;

            await context.Spaces
                .Where(s => s.Id == booking.SpaceId)
                .ExecuteUpdateAsync(s => s.SetProperty(x => x.AverageRating, avgRating), ct);
        }

        await context.SaveChangesAsync(ct);
        return review;
    }

    public async Task<Review> UpdateAsync(Guid id, UpdateReviewInput input, CancellationToken ct) {
        var userId = GetCurrentUserId();

        var review = await context.Reviews
            .Where(r => r.Id == id)
            .Include(r => r.Booking)
                .ThenInclude(b => b.Campaign)
                    .ThenInclude(c => c.AdvertiserProfile)
            .Include(r => r.Booking)
                .ThenInclude(b => b.Space)
                    .ThenInclude(s => s.SpaceOwnerProfile)
            .FirstOrDefaultAsync(ct)
            ?? throw new GraphQLException("Review not found");

        var isOwner = (review.ReviewerType == ReviewerType.Advertiser &&
                       review.Booking.Campaign.AdvertiserProfile.UserId == userId) ||
                      (review.ReviewerType == ReviewerType.SpaceOwner &&
                       review.Booking.Space.SpaceOwnerProfile.UserId == userId);

        if (!isOwner)
            throw new GraphQLException("Not authorized to update this review");

        var editWindow = review.CreatedAt.AddHours(24);
        if (DateTime.UtcNow > editWindow)
            throw new GraphQLException("Review can only be edited within 24 hours");

        var entry = context.Entry(review);
        if (input.Rating is not null)
            entry.Property(r => r.Rating).CurrentValue = input.Rating.Value;
        if (input.Comment is not null)
            entry.Property(r => r.Comment).CurrentValue = input.Comment;

        await context.SaveChangesAsync(ct);
        return review;
    }

    public async Task<bool> DeleteAsync(Guid id, CancellationToken ct) {
        var review = await context.Reviews.FindAsync([id], ct);
        if (review is null) return false;

        context.Reviews.Remove(review);
        await context.SaveChangesAsync(ct);
        return true;
    }
}