using ElaviewBackend.Data.Entities;
using ElaviewBackend.Features.Users;
using HotChocolate.Authorization;

namespace ElaviewBackend.Features.Marketplace;

[QueryType]
public static partial class ReviewQueries {
    [UsePaging]
    [UseProjection]
    [UseSorting]
    public static IQueryable<Review> GetReviewsBySpace(
        [ID] Guid spaceId,
        IReviewService reviewService
    ) => reviewService.GetBySpaceId(spaceId);

    [Authorize]
    [UseFirstOrDefault]
    [UseProjection]
    public static IQueryable<Review> GetReviewByBooking(
        [ID] Guid bookingId,
        ReviewerType reviewerType,
        IReviewService reviewService
    ) => reviewService.GetByBookingIdAndType(bookingId, reviewerType);

    [Authorize]
    [UsePaging]
    [UseProjection]
    [UseSorting]
    public static IQueryable<Review> GetMyReviews(
        IUserService userService,
        IReviewService reviewService
    ) => reviewService.GetByUserId(userService.GetPrincipalId());
}