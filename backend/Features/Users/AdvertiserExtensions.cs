using ElaviewBackend.Data.Entities;
using ElaviewBackend.Features.Marketplace;
using HotChocolate.Authorization;

namespace ElaviewBackend.Features.Users;

[ExtendObjectType<AdvertiserProfile>]
public static class AdvertiserExtensions {
    // [Authorize]
    // [UsePaging]
    // [UseProjection]
    // [UseFiltering]
    // [UseSorting]
    // public static IQueryable<Campaign> GetCampaigns(
    //     [Parent] AdvertiserProfile advertiser, ICampaignService campaignService
    // ) => campaignService.GetByAdvertiserId(advertiser.Id);
}
