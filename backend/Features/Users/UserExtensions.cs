using ElaviewBackend.Data.Entities;
using ElaviewBackend.Features.Marketplace;

namespace ElaviewBackend.Features.Users;

[ExtendObjectType<SpaceOwnerProfile>]
public static class SpaceOwnerProfileExtensions {
    [UsePaging]
    [UseProjection]
    [UseFiltering]
    [UseSorting]
    public static IQueryable<Space> GetSpaces(
        [Parent] SpaceOwnerProfile owner,
        ISpaceService spaceService)
        => spaceService.GetByOwnerId(owner.Id);

    [UsePaging]
    [UseProjection]
    [UseFiltering]
    [UseSorting]
    public static IQueryable<Review> GetReviews(
        [Parent] SpaceOwnerProfile owner,
        IReviewService reviewService)
        => reviewService.GetByOwnerProfileId(owner.Id);

    public static async Task<float> GetResponseRate(
        [Parent] SpaceOwnerProfile owner,
        IResponseMetricsBySpaceOwnerProfileIdDataLoader loader,
        CancellationToken ct) {
        var metrics = await loader.LoadAsync(owner.Id, ct);
        return metrics?.ResponseRate ?? 0f;
    }

    public static async Task<int> GetAverageResponseTime(
        [Parent] SpaceOwnerProfile owner,
        IResponseMetricsBySpaceOwnerProfileIdDataLoader loader,
        CancellationToken ct) {
        var metrics = await loader.LoadAsync(owner.Id, ct);
        return metrics?.AverageResponseTimeHours ?? 0;
    }
}

[ExtendObjectType<AdvertiserProfile>]
public static class AdvertiserExtensions {
    [UsePaging]
    [UseProjection]
    [UseFiltering]
    [UseSorting]
    public static IQueryable<Campaign> GetCampaigns(
        [Parent] AdvertiserProfile advertiser,
        ICampaignService campaignService)
        => campaignService.GetByAdvertiserId(advertiser.Id);

    public static async Task<decimal> GetTotalSpend(
        [Parent] AdvertiserProfile advertiser,
        ITotalSpendByAdvertiserIdDataLoader loader,
        CancellationToken ct
    ) => await loader.LoadAsync(advertiser.Id, ct);
}