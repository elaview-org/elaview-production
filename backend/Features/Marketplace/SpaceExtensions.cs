using ElaviewBackend.Data.Entities;
using HotChocolate.Authorization;

namespace ElaviewBackend.Features.Marketplace;

[ExtendObjectType<Space>]
public static class SpaceExtensions {
    [Authorize]
    public static async Task<SpaceOwnerProfile?> GetOwner(
        [Parent] Space space, ISpaceService spaceService, CancellationToken ct
    ) {
        return await spaceService.GetSpaceOwnerBySpaceIdAsync(space.Id, ct);
    }

    [UsePaging]
    [UseProjection]
    [UseFiltering]
    [UseSorting]
    public static IQueryable<Booking> GetBookings(
        [Parent] Space space, ISpaceService spaceService
    ) {
        return spaceService.GetBookingsBySpaceId(space.Id);
    }

    [UsePaging]
    [UseProjection]
    [UseFiltering]
    [UseSorting]
    public static IQueryable<Review> GetReviews(
        [Parent] Space space, ISpaceService spaceService
    ) {
        return spaceService.GetReviewsBySpaceId(space.Id);
    }
}