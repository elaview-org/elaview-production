using ElaviewBackend.Data.Entities;
using HotChocolate.Authorization;

namespace ElaviewBackend.Features.Marketplace;

[QueryType]
public static partial class ReviewQueries {
    [UsePaging]
    [UseProjection]
    [UseSorting]
    public static IQueryable<Review> GetReviewsBySpace(
        [ID] Guid spaceId, IReviewService reviewService
    ) => reviewService.GetReviewsBySpaceIdQuery(spaceId);

    [Authorize]
    [UseFirstOrDefault]
    [UseProjection]
    public static IQueryable<Review> GetReviewByBooking(
        [ID] Guid bookingId, ReviewerType reviewerType, IReviewService reviewService
    ) => reviewService.GetReviewByBookingIdQuery(bookingId, reviewerType);

    [Authorize]
    [UsePaging]
    [UseProjection]
    [UseSorting]
    public static IQueryable<Review> GetMyReviews(IReviewService reviewService)
        => reviewService.GetMyReviewsQuery();
}