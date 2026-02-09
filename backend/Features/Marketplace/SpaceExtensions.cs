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

    public static async Task<List<DatePrice>> GetEffectivePrices(
        [Parent] Space space,
        DateOnly startDate,
        DateOnly endDate,
        IPricingRuleService pricingRuleService,
        CancellationToken ct
    ) {
        return await pricingRuleService.GetEffectivePricesForRangeAsync(space.Id, startDate, endDate, ct);
    }
}