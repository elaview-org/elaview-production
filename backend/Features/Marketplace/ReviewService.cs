using ElaviewBackend.Data.Entities;
using ElaviewBackend.Features.Shared.Errors;

namespace ElaviewBackend.Features.Marketplace;

public interface IReviewService {
    IQueryable<Review> GetBySpaceId(Guid spaceId);
    IQueryable<Review> GetByBookingIdAndType(Guid bookingId, ReviewerType reviewerType);
    IQueryable<Review> GetByUserId(Guid userId);
    Task<Review?> GetByIdAsync(Guid id, CancellationToken ct);
    Task<Booking?> GetBookingByReviewIdAsync(Guid reviewId, CancellationToken ct);
    Task<Space?> GetSpaceByReviewIdAsync(Guid reviewId, CancellationToken ct);
    Task<Review> CreateAsync(Guid userId, Guid bookingId, CreateReviewInput input, CancellationToken ct);
    Task<Review> UpdateAsync(Guid userId, Guid id, UpdateReviewInput input, CancellationToken ct);
    Task<bool> DeleteAsync(Guid id, CancellationToken ct);
}

public sealed class ReviewService(IReviewRepository repository) : IReviewService {
    public IQueryable<Review> GetBySpaceId(Guid spaceId)
        => repository.GetBySpaceId(spaceId);

    public IQueryable<Review> GetByBookingIdAndType(Guid bookingId, ReviewerType reviewerType)
        => repository.GetByBookingIdAndType(bookingId, reviewerType);

    public IQueryable<Review> GetByUserId(Guid userId)
        => repository.GetByUserId(userId);

    public async Task<Review?> GetByIdAsync(Guid id, CancellationToken ct)
        => await repository.GetByIdAsync(id, ct);

    public async Task<Booking?> GetBookingByReviewIdAsync(Guid reviewId, CancellationToken ct)
        => await repository.GetBookingByReviewIdAsync(reviewId, ct);

    public async Task<Space?> GetSpaceByReviewIdAsync(Guid reviewId, CancellationToken ct)
        => await repository.GetSpaceByReviewIdAsync(reviewId, ct);

    public async Task<Review> CreateAsync(Guid userId, Guid bookingId, CreateReviewInput input, CancellationToken ct) {
        var booking = await repository.GetCompletedBookingInfoAsync(bookingId, ct)
            ?? throw new NotFoundException("Booking", bookingId);

        ReviewerType reviewerType;
        Guid reviewerProfileId;

        if (booking.AdvertiserUserId == userId) {
            reviewerType = ReviewerType.Advertiser;
            reviewerProfileId = booking.AdvertiserProfileId;
        } else if (booking.OwnerUserId == userId) {
            reviewerType = ReviewerType.SpaceOwner;
            reviewerProfileId = booking.OwnerProfileId;
        } else {
            throw new ForbiddenException("review this booking");
        }

        if (await repository.ExistsAsync(bookingId, reviewerType, ct))
            throw new ConflictException("Review", "Review already exists for this booking");

        var review = new Review {
            BookingId = bookingId,
            SpaceId = booking.SpaceId,
            ReviewerType = reviewerType,
            ReviewerProfileId = reviewerProfileId,
            Rating = input.Rating,
            Comment = input.Comment,
            CreatedAt = DateTime.UtcNow
        };

        var result = await repository.AddAsync(review, ct);

        if (reviewerType == ReviewerType.Advertiser) {
            await repository.UpdateSpaceAverageRatingAsync(booking.SpaceId, ct);
        }

        return result;
    }

    public async Task<Review> UpdateAsync(Guid userId, Guid id, UpdateReviewInput input, CancellationToken ct) {
        var review = await repository.GetByIdWithRelationsAsync(id, ct)
            ?? throw new NotFoundException("Review", id);

        var isOwner = (review.ReviewerType == ReviewerType.Advertiser &&
                       review.Booking.Campaign.AdvertiserProfile.UserId == userId) ||
                      (review.ReviewerType == ReviewerType.SpaceOwner &&
                       review.Booking.Space.SpaceOwnerProfile.UserId == userId);

        if (!isOwner)
            throw new ForbiddenException("update this review");

        var editWindow = review.CreatedAt.AddHours(24);
        if (DateTime.UtcNow > editWindow)
            throw new ValidationException("Review", "Review can only be edited within 24 hours");

        return await repository.UpdateAsync(review, input, ct);
    }

    public async Task<bool> DeleteAsync(Guid id, CancellationToken ct) {
        var review = await repository.GetByIdAsync(id, ct);
        if (review is null) return false;

        return await repository.DeleteAsync(review, ct);
    }
}