using ElaviewBackend.Data.Entities;
using HotChocolate.Authorization;

namespace ElaviewBackend.Features.Marketplace;

[ExtendObjectType<Campaign>]
public static class CampaignExtensions {
    [Authorize]
    public static async Task<AdvertiserProfile?> GetAdvertiser(
        [Parent] Campaign campaign, ICampaignService campaignService,
        CancellationToken ct
    ) {
        return await campaignService.GetAdvertiserByCampaignIdAsync(campaign.Id,
            ct);
    }

    [Authorize]
    [UsePaging]
    [UseProjection]
    [UseFiltering]
    [UseSorting]
    public static IQueryable<Booking> GetBookings(
        [Parent] Campaign campaign, ICampaignService campaignService
    ) {
        return campaignService.GetBookingsByCampaignId(campaign.Id);
    }

    [Authorize]
    public static async Task<decimal> GetTotalSpend(
        [Parent] Campaign campaign,
        ITotalSpendByCampaignIdDataLoader loader,
        CancellationToken ct
    ) => await loader.LoadAsync(campaign.Id, ct);

    [Authorize]
    public static async Task<int> GetSpacesCount(
        [Parent] Campaign campaign,
        ISpacesCountByCampaignIdDataLoader loader,
        CancellationToken ct
    ) => await loader.LoadAsync(campaign.Id, ct);
}