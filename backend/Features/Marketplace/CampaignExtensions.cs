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
}